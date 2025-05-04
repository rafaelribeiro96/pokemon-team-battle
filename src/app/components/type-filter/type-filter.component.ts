/* type-filter.component.ts */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-filter.component.html',
  styleUrls: ['./type-filter.component.scss'],
})
export class TypeFilterComponent {
  @Input() types: string[] = [];
  @Input() selectedType: string | null = null;
  @Output() typeSelect = new EventEmitter<string | null>();

  // Mapeamento de tipos em inglês para português
  private typeTranslations: { [key: string]: string } = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Planta',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Venenoso',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Metálico',
    fairy: 'Fada',
  };

  selectType(type: string | null): void {
    this.typeSelect.emit(type);
  }

  translateType(type: string): string {
    return this.typeTranslations[type] || this.capitalizeFirstLetter(type);
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
