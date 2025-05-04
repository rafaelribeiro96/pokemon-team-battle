import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import type { Pokemon } from '../../models/pokemon.model';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';
import { CustomIconComponent } from '../custom-icon/custom-icon.component';

@Component({
  standalone: true,
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss'],
  imports: [
    PokemonListComponent,
    CommonModule,
    MatButtonModule,
    PokemonIconComponent,
    CustomIconComponent,
  ],
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
      // Criar uma cópia do Pokémon para evitar referências compartilhadas
      const pokemonCopy = { ...pokemon };

      // Adicionar ao time
      const updatedTeam = [...this.team(), pokemonCopy];
      this.team.set(updatedTeam);

      // Emitir a mudança
      this.emitTeamChange();

      // Atualizar a lista de disponíveis
      this.availablePokemons.set(
        this.availablePokemons().filter((p) => p.id !== pokemon.id)
      );

      // Forçar detecção de mudanças
      this.cdr.detectChanges();
    }
  }

  removePokemonFromTeam(pokemon: Pokemon) {
    this.team.set(this.team().filter((p) => p.id !== pokemon.id));
    this.emitTeamChange();

    // Adicionar o Pokémon de volta à lista de disponíveis
    const pokemonToAdd = { ...pokemon };
    this.availablePokemons.set([...this.availablePokemons(), pokemonToAdd]);

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  addRandomToTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

    if (availablePokemons.length === 0) return;

    const randomPokemons: {
      id: number;
      name: string;
      image: string;
      type: string[];
      stats: {
        attack: number;
        defense: number;
        speed: number;
        hp: number;
        maxHp: number;
        specialAttack: number;
        specialDefense: number;
      };
      isDefeated?: boolean;
      isAttacking?: boolean;
      isFainted?: boolean;
      selected?: boolean;
    }[] = [];
    for (let i = 0; i < remainingSlots && availablePokemons.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      const randomPokemon = { ...availablePokemons[randomIndex] };
      randomPokemons.push(randomPokemon);
      availablePokemons.splice(randomIndex, 1);
    }

    this.team.set([...this.team(), ...randomPokemons]);
    this.emitTeamChange();

    // Atualizar a lista de disponíveis
    this.availablePokemons.set(
      this.availablePokemons().filter(
        (p) => !randomPokemons.some((rp) => rp.id === p.id)
      )
    );

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  autoCompleteTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

    const randomPokemons: {
      id: number;
      name: string;
      image: string;
      type: string[];
      stats: {
        attack: number;
        defense: number;
        speed: number;
        hp: number;
        maxHp: number;
        specialAttack: number;
        specialDefense: number;
      };
      isDefeated?: boolean;
      isAttacking?: boolean;
      isFainted?: boolean;
      selected?: boolean;
    }[] = [];

    while (
      randomPokemons.length < remainingSlots &&
      availablePokemons.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      const randomPokemon = availablePokemons.splice(randomIndex, 1)[0];
      randomPokemons.push({ ...randomPokemon });
    }

    this.team.set([...this.team(), ...randomPokemons]);
    this.emitTeamChange();

    // Atualizar a lista de disponíveis
    this.availablePokemons.set(
      this.availablePokemons().filter(
        (p) => !randomPokemons.some((rp) => rp.id === p.id)
      )
    );

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
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
