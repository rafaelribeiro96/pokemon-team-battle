/* profile.component.ts */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isUploading = false;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
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
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Erro ao carregar perfil';
      },
    });
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
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.error.message || 'Erro ao atualizar perfil';
      },
    });
  }
}
