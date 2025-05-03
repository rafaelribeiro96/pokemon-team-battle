import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[fallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  @Input() fallback: string = 'assets/images/imagemDefault.png';
  private originalSrc: string = '';
  private isApplied: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Armazena o src original
    this.originalSrc = this.el.nativeElement.src;
  }

  @HostListener('error')
  onError() {
    // Evita loops infinitos
    if (!this.isApplied) {
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
        `Imagem não encontrada: ${this.originalSrc}. Substituída por: ${fallbackPath}`
      );
    }
  }

  // Reseta o estado se a imagem for alterada
  @HostListener('load')
  onLoad() {
    if (this.el.nativeElement.src !== this.fallback) {
      this.isApplied = false;
    }
  }
}
