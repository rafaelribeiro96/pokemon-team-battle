import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokedex-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex-card.component.html',
  styleUrls: ['./pokedex-card.component.scss'],
})
export class PokedexCardComponent {
  @Input() pokemon: any;

  constructor(private router: Router) {}

  navigateToDetail(): void {
    this.router.navigate(['/pokedex', this.pokemon.id]);
  }

  getTypeColor(type: string): string {
    return `var(--${type}-type)`;
  }

  formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
