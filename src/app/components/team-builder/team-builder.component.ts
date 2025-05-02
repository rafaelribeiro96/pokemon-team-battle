import { Component, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss'],
  imports: [PokemonListComponent, CommonModule],
})
export class TeamBuilderComponent {
  availablePokemons = signal<Pokemon[]>([]);
  team = signal<Pokemon[]>([]);

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.fetchPokemons().then(() => {
      this.availablePokemons.set(this.pokemonService.pokemons());
    });
  }

  addPokemonToTeam(pokemon: Pokemon) {
    if (this.team().length < 6 && !this.team().includes(pokemon)) {
      this.team.set([...this.team(), pokemon]);
    }
  }

  // Remover Pokémon do time
  removePokemonFromTeam(pokemon: Pokemon) {
    this.team.set(this.team().filter((p) => p.id !== pokemon.id));
  }

  addRandomToTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.availablePokemons().filter(
      (pokemon) => !this.team().includes(pokemon)
    );

    const randomPokemons = Array.from(
      { length: remainingSlots },
      () =>
        availablePokemons[Math.floor(Math.random() * availablePokemons.length)]
    );

    this.team.set([...this.team(), ...randomPokemons]);
  }

  autoCompleteTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.availablePokemons().filter(
      (pokemon) => !this.team().includes(pokemon)
    );

    const randomPokemons = [];

    while (
      randomPokemons.length < remainingSlots &&
      availablePokemons.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      const randomPokemon = availablePokemons.splice(randomIndex, 1)[0];
      randomPokemons.push(randomPokemon);
    }

    this.team.set([...this.team(), ...randomPokemons]);
  }
}
