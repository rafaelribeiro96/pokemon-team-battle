import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'pokemon-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());

  constructor() {
    // Aplicar tema inicial
    this.applyTheme(this.themeSubject.value);

    // Verificar preferência do sistema
    this.watchSystemPreference();
  }

  private getInitialTheme(): Theme {
    // Verificar se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem(this.themeKey) as Theme | null;

    if (savedTheme) {
      return savedTheme;
    }

    // Verificar preferência do sistema
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  private watchSystemPreference(): void {
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          // Só mudar automaticamente se o usuário não tiver escolhido um tema
          if (!localStorage.getItem(this.themeKey)) {
            const newTheme: Theme = e.matches ? 'dark' : 'light';
            this.setTheme(newTheme);
          }
        });
    }
  }

  getTheme(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const newTheme: Theme =
      this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);

    // Aplicar cores do tema
    if (theme === 'dark') {
      document.documentElement.style.setProperty(
        '--background-color',
        '#121212'
      );
      document.documentElement.style.setProperty('--text-color', '#e0e0e0');
      document.documentElement.style.setProperty(
        '--card-background',
        '#1e1e1e'
      );
      document.documentElement.style.setProperty('--border-color', '#333');
      document.documentElement.style.setProperty(
        '--shadow-color',
        'rgba(0, 0, 0, 0.5)'
      );
    } else {
      document.documentElement.style.setProperty(
        '--background-color',
        '#f5f5f5'
      );
      document.documentElement.style.setProperty('--text-color', '#333');
      document.documentElement.style.setProperty(
        '--card-background',
        '#ffffff'
      );
      document.documentElement.style.setProperty('--border-color', '#e0e0e0');
      document.documentElement.style.setProperty(
        '--shadow-color',
        'rgba(0, 0, 0, 0.1)'
      );
    }
  }
}
