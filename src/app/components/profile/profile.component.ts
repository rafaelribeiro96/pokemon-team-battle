/* components/profile/profile.component.ts */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PokemonIconsService } from '../../services/pokemon-icons.service';
import { ImgFallbackDirective } from '../../directives/fallback-image.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
    ImgFallbackDirective,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isUploading = false;
  isSaving = false;
  isChangingPassword = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordErrorMessage: string | null = null;
  passwordSuccessMessage: string | null = null;
  activeTab = 0;

  // Dados de gamificação
  trainerLevel = 1;
  experience = 0;
  nextLevelExp = 100;
  badges = [
    { name: 'Iniciante', icon: 'assets/icons-svg/estrela.svg', earned: true },
    {
      name: 'Colecionador',
      icon: 'assets/icons-svg/pokebola.svg',
      earned: false,
    },
    {
      name: 'Estrategista',
      icon: 'assets/icons-svg/ginasiofogo.svg',
      earned: false,
    },
    { name: 'Mestre', icon: 'assets/icons-svg/coroa.svg', earned: false },
  ];

  // Estatísticas do usuário
  stats = {
    battles: 0,
    wins: 0,
    teams: 0,
    quizzes: 0,
  };

  // Ícones de treinador disponíveis
  trainerIcons: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private pokemonIconsService: PokemonIconsService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Carregar ícones de treinador
    this.trainerIcons = this.pokemonIconsService.getIconsByTag('trainer');
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
        });

        // Simular carregamento de estatísticas (em um app real, viria do backend)
        this.loadUserStats();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Erro ao carregar perfil';
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  loadUserStats(): void {
    // Simulação - em um app real, estas estatísticas viriam do backend
    this.stats = {
      battles: Math.floor(Math.random() * 50),
      wins: Math.floor(Math.random() * 30),
      teams: Math.floor(Math.random() * 10),
      quizzes: Math.floor(Math.random() * 20),
    };

    // Calcular nível e experiência com base nas estatísticas
    this.experience =
      this.stats.battles * 5 +
      this.stats.wins * 10 +
      this.stats.teams * 15 +
      this.stats.quizzes * 5;
    this.trainerLevel = Math.floor(this.experience / 100) + 1;
    this.nextLevelExp = this.trainerLevel * 100;

    // Atualizar badges com base nas estatísticas
    if (this.stats.teams >= 3) this.badges[1].earned = true;
    if (this.stats.wins >= 10) this.badges[2].earned = true;
    if (this.trainerLevel >= 5) this.badges[3].earned = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;

    // Criar preview da imagem
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadAvatar(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Selecione uma imagem';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.updateAvatar(this.selectedFile).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.user.avatar = response.avatar;
        this.successMessage = 'Avatar atualizado com sucesso';

        // Atualizar usuário no localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.avatar = response.avatar;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Atualizar o usuário no serviço de autenticação
        this.authService.updateCurrentUser(storedUser);
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.error.message || 'Erro ao enviar avatar';
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const userData = this.profileForm.value;

    this.userService.updateProfile(userData).subscribe({
      next: (user) => {
        this.isSaving = false;
        this.user = user;
        this.successMessage = 'Perfil atualizado com sucesso';

        // Atualizar usuário no localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.username = user.username;
        storedUser.email = user.email;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Atualizar o usuário no serviço de autenticação
        this.authService.updateCurrentUser(storedUser);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.error.message || 'Erro ao atualizar perfil';
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isChangingPassword = true;
    this.passwordErrorMessage = null;
    this.passwordSuccessMessage = null;

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordSuccessMessage = 'Senha alterada com sucesso';
        this.passwordForm.reset();
      },
      error: (error) => {
        this.isChangingPassword = false;
        this.passwordErrorMessage =
          error.error.message || 'Erro ao alterar senha';
      },
    });
  }

  selectTrainerIcon(icon: any): void {
    // Em uma implementação real, você enviaria esta seleção para o backend
    this.successMessage = `Ícone de treinador ${icon.name} selecionado!`;
  }

  getExpPercentage(): number {
    return this.experience % 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
