import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { PokemonIconsService } from '../services/pokemon-icons.service';

@Directive({
  selector: '[appPokemonIcon]',
  standalone: true,
})
export class PokemonIconDirective implements OnChanges {
  @Input('appPokemonIcon') iconId?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  private sizeMap = {
    xs: '16px',
    sm: '24px',
    md: '32px',
    lg: '48px',
    xl: '64px',
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private pokemonIconsService: PokemonIconsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconId'] || changes['size']) {
      this.updateIcon();
    }
  }

  private updateIcon(): void {
    // Limpa o elemento
    while (this.el.nativeElement.firstChild) {
      this.renderer.removeChild(
        this.el.nativeElement,
        this.el.nativeElement.firstChild
      );
    }

    // Define o estilo do elemento
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'justify-content', 'center');
    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      this.sizeMap[this.size]
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'height',
      this.sizeMap[this.size]
    );

    if (this.iconId) {
      const icon = this.pokemonIconsService.getIconById(this.iconId);

      if (icon) {
        // Cria o elemento de imagem
        const img = this.renderer.createElement('img');
        this.renderer.setAttribute(img, 'src', icon.path);
        this.renderer.setAttribute(img, 'alt', icon.name);
        this.renderer.setStyle(img, 'width', '100%');
        this.renderer.setStyle(img, 'height', '100%');
        this.renderer.setStyle(img, 'object-fit', 'contain');

        // Adiciona a imagem ao elemento
        this.renderer.appendChild(this.el.nativeElement, img);
      }
    }
  }
}
