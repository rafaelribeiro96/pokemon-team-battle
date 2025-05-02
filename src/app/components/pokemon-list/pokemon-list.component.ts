/* pokemon-list.component.ts */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  imports: [CommonModule, MatGridListModule],
  animations: [
    trigger('cardFlip', [
      state(
        'default',
        style({
          transform: 'none',
        })
      ),
      state(
        'flipped',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      transition('default => flipped', [animate('400ms')]),
      transition('flipped => default', [animate('400ms')]),
    ]),
  ],
})
export class PokemonListComponent {
  @Input() pokemons: Pokemon[] = [];
  @Output() selectPokemon = new EventEmitter<Pokemon>();

  onPokemonClick(pokemon: Pokemon) {
    this.selectPokemon.emit(pokemon);
  }
}
