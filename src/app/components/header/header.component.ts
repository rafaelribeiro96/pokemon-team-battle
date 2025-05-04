import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isPlaying: boolean = false;
  audio: HTMLAudioElement | null = null;
  volume: number = 0.5;
  previousVolume: number = 0.5;
  isMuted: boolean = false;
  userName: string = 'Ash Ketchum';
  isMobileMenuOpen: boolean = false;

  // Armazenar o estado do scroll anterior
  private lastScrollTop: number = 0;
  private headerVisible: boolean = true;

  ngOnInit(): void {
    this.audio = new Audio('/assets/music/pokemon-abertura.mp3');
    this.audio.loop = true;
    this.audio.volume = this.volume;

    // Verificar se há preferências salvas
    this.loadAudioPreferences();
  }

  ngOnDestroy(): void {
    this.stopMusic();
    this.saveAudioPreferences();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    // Determinar a direção do scroll
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 70) {
      // Scroll para baixo - esconder o header
      document.querySelector('.app-header')?.classList.add('header-hidden');
    } else {
      // Scroll para cima - mostrar o header
      document.querySelector('.app-header')?.classList.remove('header-hidden');
    }

    this.lastScrollTop = currentScrollTop;
  }

  togglePlay(): void {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch((error) => {
        console.error('Erro ao reproduzir áudio:', error);
      });
    }

    this.isPlaying = !this.isPlaying;
    this.saveAudioPreferences();
  }

  toggleMute(): void {
    if (!this.audio) return;

    if (this.isMuted) {
      this.volume = this.previousVolume;
      this.audio.volume = this.volume;
    } else {
      this.previousVolume = this.volume;
      this.volume = 0;
      this.audio.volume = 0;
    }

    this.isMuted = !this.isMuted;
    this.saveAudioPreferences();
  }

  setVolume(event: Event): void {
    if (!this.audio) return;

    const input = event.target as HTMLInputElement;
    this.volume = Number(input.value);
    this.audio.volume = this.volume;

    // Atualizar estado de mudo
    this.isMuted = this.volume === 0;
    this.saveAudioPreferences();
  }

  stopMusic(): void {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.saveAudioPreferences();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Bloquear o scroll do body quando o menu estiver aberto
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Salvar preferências de áudio no localStorage
  private saveAudioPreferences(): void {
    const preferences = {
      volume: this.volume,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
    };

    localStorage.setItem('audioPreferences', JSON.stringify(preferences));
  }

  // Carregar preferências de áudio do localStorage
  private loadAudioPreferences(): void {
    const savedPreferences = localStorage.getItem('audioPreferences');

    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      this.volume = preferences.volume;
      this.isMuted = preferences.isMuted;

      if (this.audio) {
        this.audio.volume = this.volume;

        if (preferences.isPlaying) {
          this.audio.play().catch(() => {
            // Autoplay pode ser bloqueado pelo navegador
            this.isPlaying = false;
          });
          this.isPlaying = true;
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Fechar o menu mobile se a tela for redimensionada para um tamanho maior
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
