/* team-builder.component.ts */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss'],
  imports: [PokemonListComponent, CommonModule, MatButtonModule],
})
export class TeamBuilderComponent {
  availablePokemons = signal<Pokemon[]>([]);
  team = signal<Pokemon[]>([]);
  @Output() teamChange = new EventEmitter<Pokemon[]>();
  @Input() battleInProgress = false;

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {
    this.pokemonService.fetchPokemons().then(() => {
      const pokemons = this.pokemonService.pokemons().map((pokemon) => ({
        ...pokemon,
        stats: { ...pokemon.stats, maxHp: pokemon.stats.hp },
      }));
      this.availablePokemons.set(pokemons);
    });
  }

  addPokemonToTeam(pokemon: Pokemon) {
    if (this.team().length < 6 && !this.team().includes(pokemon)) {
      this.team.set([...this.team(), pokemon]);
      this.emitTeamChange();
    }
  }

  removePokemonFromTeam(pokemon: Pokemon) {
    this.team.set(this.team().filter((p) => p.id !== pokemon.id));
    this.emitTeamChange();
  }

  addRandomToTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

    const randomPokemons = Array.from(
      { length: remainingSlots },
      () =>
        availablePokemons[Math.floor(Math.random() * availablePokemons.length)]
    );

    this.team.set([...this.team(), ...randomPokemons]);
    this.emitTeamChange();
  }

  autoCompleteTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

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
    this.emitTeamChange();
  }

  private getAvailablePokemonsForTeam(): Pokemon[] {
    return this.availablePokemons().filter(
      (pokemon) => !this.team().includes(pokemon)
    );
  }

  private emitTeamChange() {
    this.teamChange.emit(this.team());
  }

  updateTeamPokemon(updatedPokemon: Pokemon) {
    const index = this.team().findIndex((p) => p.id === updatedPokemon.id);
    if (index !== -1) {
      const updatedTeam = [...this.team()];
      updatedTeam[index] = { ...updatedPokemon };
      this.team.set(updatedTeam);
      this.cdr.detectChanges();
    }
  }
}
