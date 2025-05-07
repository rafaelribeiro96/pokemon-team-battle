import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[fallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  @Input() fallback = 'assets/images/imagemDefault.png';
  private originalSrc = '';
  private isApplied = false;
  private loadAttempts = 0;
  private readonly MAX_ATTEMPTS: number = 3;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Armazena o src original
    this.originalSrc = this.el.nativeElement.src;

    // Verificar se a imagem já está em erro no momento da inicialização
    if (
      this.el.nativeElement.complete &&
      this.el.nativeElement.naturalHeight === 0
    ) {
      this.onError();
    }
  }

  @HostListener('error')
  onError() {
    // Evita loops infinitos e limita tentativas
    if (!this.isApplied && this.loadAttempts < this.MAX_ATTEMPTS) {
      this.loadAttempts++;
      this.isApplied = true;

      // Verifica se o caminho do fallback é absoluto ou relativo
      let fallbackPath = this.fallback;
      if (!fallbackPath.startsWith('http') && !fallbackPath.startsWith('/')) {
        fallbackPath = '/' + fallbackPath;
      }

      // Aplica a imagem de fallback
      this.el.nativeElement.src = fallbackPath;

      // Adiciona um log para debug
      console.log(
        `Imagem não encontrada: ${this.originalSrc}. Substituída por: ${fallbackPath} (Tentativa ${this.loadAttempts})`
      );
    }
  }

  // Reseta o estado se a imagem for alterada
  @HostListener('load')
  onLoad() {
    if (this.el.nativeElement.src !== this.fallback) {
      this.isApplied = false;
      this.originalSrc = this.el.nativeElement.src;
    }
  }

  // Tentar novamente com a URL original quando o mouse passar sobre a imagem
  @HostListener('mouseenter')
  retryOriginalImage() {
    if (
      this.isApplied &&
      this.originalSrc &&
      this.loadAttempts < this.MAX_ATTEMPTS
    ) {
      this.loadAttempts++;
      this.isApplied = false;
      this.el.nativeElement.src = this.originalSrc;
      console.log(
        `Tentando recarregar imagem original: ${this.originalSrc} (Tentativa ${this.loadAttempts})`
      );
    }
  }
}
