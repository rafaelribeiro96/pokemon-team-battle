/* auth.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);

        // Verificar se há um tempo de expiração salvo
        const expirationTime = localStorage.getItem('tokenExpiration');
        if (expirationTime) {
          const remainingTime =
            new Date(expirationTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            // Verificar se "lembrar acesso" está ativado
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            if (!rememberMe) {
              this.autoLogout(remainingTime);
            }
          } else {
            // Token expirado, fazer logout
            this.logout();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        this.logout();
      }
    }
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      })
      .pipe(tap((response) => this.handleAuthResponse(response, false)));
  }

  login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(tap((response) => this.handleAuthResponse(response, rememberMe)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('rememberMe');
    this.currentUserSubject.next(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleAuthResponse(
    response: AuthResponse,
    rememberMe: boolean = false
  ): void {
    if (response && response.token) {
      // Salvar token e usuário no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Salvar a preferência de "lembrar acesso"
      localStorage.setItem('rememberMe', rememberMe.toString());

      // Atualizar o BehaviorSubject
      this.currentUserSubject.next(response.user);

      // Configurar expiração do token
      // Para "lembrar acesso", usamos 30 dias, caso contrário 1 dia
      const expirationDuration = rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;
      const expirationDate = new Date(
        new Date().getTime() + expirationDuration
      );
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());

      // Configurar o auto logout apenas se não for "lembrar acesso"
      if (!rememberMe) {
        this.autoLogout(expirationDuration);
      }

      // Navegar para a página inicial após o login
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 100);
    }
  }

  private autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, expirationDuration);
  }
}
