/* pokemon-icon.component.ts */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PokemonIconsService,
  PokemonIcon,
} from '../../services/pokemon-icons.service';

@Component({
  selector: 'app-pokemon-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="pokemon-icon"
      [class.clickable]="clickable"
      [ngClass]="size"
      [ngStyle]="customStyle"
      [title]="icon?.name || ''"
    >
      <img
        *ngIf="icon"
        [src]="icon.path"
        [alt]="icon.name"
        [attr.aria-label]="icon.name"
      />
      <div *ngIf="!icon && showPlaceholder" class="placeholder">
        <span>?</span>
      </div>
    </div>
  `,
  styles: [
    `
      .pokemon-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .pokemon-icon.clickable {
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .pokemon-icon.clickable:hover {
        transform: scale(1.1);
      }

      .pokemon-icon.xs {
        width: 16px;
        height: 16px;
      }

      .pokemon-icon.sm {
        width: 24px;
        height: 24px;
      }

      .pokemon-icon.md {
        width: 32px;
        height: 32px;
      }

      .pokemon-icon.lg {
        width: 48px;
        height: 48px;
      }

      .pokemon-icon.xl {
        width: 64px;
        height: 64px;
      }

      .pokemon-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        border-radius: 50%;
        color: #999;
        font-weight: bold;
      }
    `,
  ],
})
export class PokemonIconComponent implements OnChanges {
  @Input() iconId: string | null = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() clickable: boolean = false;
  @Input() showPlaceholder: boolean = true;
  @Input() customStyle: { [key: string]: string } = {};
  iconPath!: string;

  icon?: PokemonIcon;

  constructor(private pokemonIconsService: PokemonIconsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconId']) {
      this.loadIcon();
    }
  }

  ngOnInit() {
    const icon = this.iconId
      ? this.pokemonIconsService.getIconById(this.iconId)
      : undefined;
    if (icon) {
      this.iconPath = icon.path;
    } else {
      // Usar um ícone de interrogação como fallback
      this.iconPath = 'assets/icons-svg/interrogação.svg';
      console.warn(
        `Ícone não encontrado: ${this.iconId}, usando ícone padrão.`
      );
    }
  }

  private loadIcon(): void {
    if (this.iconId) {
      this.icon = this.pokemonIconsService.getIconById(this.iconId);
    } else {
      this.icon = undefined;
    }
  }
}
