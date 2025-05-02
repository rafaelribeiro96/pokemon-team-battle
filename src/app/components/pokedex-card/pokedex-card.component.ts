import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokedex-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokedex-card.component.html',
  styleUrls: ['./pokedex-card.component.scss'],
})
export class PokedexCardComponent {
  @Input() pokemon!: Pokemon;
  isFlipped: boolean = false;

  // Mapeamento de tipos para cores
  typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  // Mapeamento de tipos em inglês para português
  typeTranslations: { [key: string]: string } = {
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

  getTypeColor(type: string): string {
    return this.typeColors[type.toLowerCase()] || '#A8A878';
  }

  translateType(type: string): string {
    return this.typeTranslations[type.toLowerCase()] || type;
  }

  formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  toggleFlip(): void {
    this.isFlipped = !this.isFlipped;
  }

  getMainTypeColor(): string {
    if (!this.pokemon || !this.pokemon.type || this.pokemon.type.length === 0) {
      return 'transparent';
    }

    const mainType = this.pokemon.type[0].toLowerCase();
    return this.typeColors[mainType] || '#A8A878';
  }
}
