/* header.component.ts */
import {
  Component,
  type OnInit,
  type OnDestroy,
  HostListener,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  type AfterViewInit,
  Renderer2,
  Inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, type MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import type { Subscription } from 'rxjs';
import { ImgFallbackDirective } from '../../directives/fallback-image.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    ImgFallbackDirective,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild('menuTrigger', { read: ElementRef }) menuTriggerEl!: ElementRef;

  isPlaying = false;
  audio: HTMLAudioElement | null = null;
  volume = 0.5;
  previousVolume = 0.5;
  isMuted = false;
  isMobileMenuOpen = false;

  // Usuário logado
  user: any = null;
  private userSubscription: Subscription | null = null;

  // Armazenar o estado do scroll anterior
  private lastScrollTop = 0;
  private headerVisible = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.audio = new Audio('/assets/music/pokemon-abertura.mp3');
    this.audio.loop = true;
    this.audio.volume = this.volume;

    // Verificar se há preferências salvas
    this.loadAudioPreferences();

    // Inscrever-se para mudanças no usuário logado
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });

    // Adicionar um ouvinte global para fechar o menu quando clicar fora
    this.renderer.listen('document', 'click', (event) => {
      if (this.menuTrigger?.menuOpen) {
        const clickTarget = event.target as HTMLElement;
        const menuContainer = this.document.querySelector(
          '.cdk-overlay-container'
        );
        const triggerEl = this.menuTriggerEl?.nativeElement;

        if (
          menuContainer &&
          !menuContainer.contains(clickTarget) &&
          triggerEl &&
          !triggerEl.contains(clickTarget)
        ) {
          this.menuTrigger.closeMenu();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Configurar o menu após a visualização ser inicializada
    if (this.menuTrigger) {
      // Adicionar listener para quando o menu abrir
      this.menuTrigger.menuOpened.subscribe(() => {
        // Forçar reposicionamento do menu
        setTimeout(() => {
          const overlayPane = this.document.querySelector('.cdk-overlay-pane');
          const menuContent = this.document.querySelector(
            '.mat-mdc-menu-content'
          );
          const triggerRect =
            this.menuTriggerEl.nativeElement.getBoundingClientRect();

          if (overlayPane && menuContent) {
            // Calcular posição manualmente
            const topPosition = triggerRect.bottom + 10; // 10px abaixo do botão
            const rightPosition = window.innerWidth - triggerRect.right;

            // Garantir que o menu esteja visível e posicionado corretamente
            this.renderer.setStyle(overlayPane, 'position', 'fixed');
            this.renderer.setStyle(overlayPane, 'top', `${topPosition}px`);
            this.renderer.setStyle(overlayPane, 'right', `${rightPosition}px`);
            this.renderer.setStyle(overlayPane, 'transform', 'none');
            this.renderer.setStyle(menuContent, 'max-height', '300px');
          }
        }, 0);
      });
    }
  }

  onMenuClosed(): void {
    // Limpar qualquer estilo personalizado que possa estar causando problemas
    const overlayElements = this.document.querySelectorAll(
      '.cdk-overlay-container, .cdk-overlay-backdrop'
    );
    overlayElements.forEach((el) => {
      this.renderer.removeStyle(el, 'position');
      this.renderer.removeStyle(el, 'bottom');
    });
  }

  ngOnDestroy(): void {
    this.stopMusic();
    this.saveAudioPreferences();

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
