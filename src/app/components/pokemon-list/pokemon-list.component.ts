import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  imports: [CommonModule],
})
export class PokemonListComponent {
  @Input() pokemons: Pokemon[] = [];
  @Output() selectPokemon = new EventEmitter<Pokemon>();

  onPokemonClick(pokemon: Pokemon) {
    this.selectPokemon.emit(pokemon);
  }
}
