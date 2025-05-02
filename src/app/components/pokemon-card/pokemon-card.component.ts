import { Component, Input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() isAttacking = false;
  @Input() isFainted = false;
}
