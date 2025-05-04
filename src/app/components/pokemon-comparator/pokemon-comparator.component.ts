import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-pokemon-comparator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-comparator.component.html',
  styleUrls: ['./pokemon-comparator.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class PokemonComparatorComponent implements OnInit {
  pokemonList: { id: number; name: string }[] = [];
  selectedPokemon1Id: number | string = '';
  selectedPokemon2Id: number | string = '';
  pokemon1: PokemonDetail | null = null;
  pokemon2: PokemonDetail | null = null;
  loading: boolean = false;
  randomMode: boolean = false;
  statColors: { [key: string]: string } = {
    hp: '#FF5959',
    attack: '#F5AC78',
    defense: '#FAE078',
    specialAttack: '#9DB7F5',
    specialDefense: '#A7DB8D',
    speed: '#FA92B2',
  };
  typeAdvantages: { [key: string]: string[] } = {
    normal: [],
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    electric: ['water', 'flying'],
    grass: ['water', 'ground', 'rock'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark'],
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonList();
  }

  async loadPokemonList(): Promise<void> {
    try {
      // Carregar uma lista de Pokémon para os seletores
      const pokemonList = await this.pokemonService.fetchPokemonList(0, 151);
      this.pokemonList = pokemonList.map((p) => ({ id: p.id, name: p.name }));
    } catch (error) {
      console.error('Erro ao carregar lista de Pokémon:', error);
    }
  }

  async loadPokemon(pokemonNumber: number): Promise<void> {
    const id =
      pokemonNumber === 1 ? this.selectedPokemon1Id : this.selectedPokemon2Id;

    if (!id) return;

    this.loading = true;

    try {
      const pokemon = await this.pokemonService.fetchPokemonById(Number(id));

      if (pokemonNumber === 1) {
        this.pokemon1 = pokemon;
      } else {
        this.pokemon2 = pokemon;
      }
    } catch (error) {
      console.error(`Erro ao carregar Pokémon ${id}:`, error);
    } finally {
      this.loading = false;
    }
  }

  async selectRandomPokemon(): Promise<void> {
    this.loading = true;

    try {
      // Gerar dois IDs aleatórios entre 1 e 151
      const id1 = Math.floor(Math.random() * 151) + 1;
      let id2 = Math.floor(Math.random() * 151) + 1;

      // Garantir que os IDs sejam diferentes
      while (id2 === id1) {
        id2 = Math.floor(Math.random() * 151) + 1;
      }

      this.selectedPokemon1Id = id1;
      this.selectedPokemon2Id = id2;

      // Carregar os Pokémon
      const pokemon1 = await this.pokemonService.fetchPokemonById(id1);
      const pokemon2 = await this.pokemonService.fetchPokemonById(id2);

      this.pokemon1 = pokemon1;
      this.pokemon2 = pokemon2;
    } catch (error) {
      console.error('Erro ao carregar Pokémon aleatórios:', error);
    } finally {
      this.loading = false;
    }
  }

  getStatPercentage(value: number): number {
    // Considerando 255 como valor máximo para uma estatística
    return Math.min(100, (value / 255) * 100);
  }

  getTotalStats(pokemon: PokemonDetail): number {
    return (
      pokemon.stats.hp +
      pokemon.stats.attack +
      pokemon.stats.defense +
      pokemon.stats.specialAttack +
      pokemon.stats.specialDefense +
      pokemon.stats.speed
    );
  }

  getTotalStatPercentage(pokemon: PokemonDetail): number {
    // Considerando 720 como valor máximo para o total (120 por estatística)
    const total = this.getTotalStats(pokemon);
    return Math.min(100, (total / 720) * 100);
  }

  getWinner(): PokemonDetail | null {
    if (!this.pokemon1 || !this.pokemon2) return null;

    const total1 = this.getTotalStats(this.pokemon1);
    const total2 = this.getTotalStats(this.pokemon2);

    // Se a diferença for menor que 5%, consideramos empate
    if (Math.abs(total1 - total2) < total1 * 0.05) return null;

    return total1 > total2 ? this.pokemon1 : this.pokemon2;
  }

  getTypeAdvantage(): { winner: PokemonDetail | null; reason: string } | null {
    if (!this.pokemon1 || !this.pokemon2) return null;

    let pokemon1Advantage = 0;
    let pokemon2Advantage = 0;

    // Verificar vantagens de tipo do Pokémon 1 sobre o Pokémon 2
    for (const type1 of this.pokemon1.type) {
      for (const type2 of this.pokemon2.type) {
        if (this.typeAdvantages[type1]?.includes(type2)) {
          pokemon1Advantage++;
        }
      }
    }

    // Verificar vantagens de tipo do Pokémon 2 sobre o Pokémon 1
    for (const type2 of this.pokemon2.type) {
      for (const type1 of this.pokemon1.type) {
        if (this.typeAdvantages[type2]?.includes(type1)) {
          pokemon2Advantage++;
        }
      }
    }

    if (pokemon1Advantage > pokemon2Advantage) {
      return {
        winner: this.pokemon1,
        reason: `${this.pokemon1.name} tem vantagem de tipo contra ${this.pokemon2.name}`,
      };
    } else if (pokemon2Advantage > pokemon1Advantage) {
      return {
        winner: this.pokemon2,
        reason: `${this.pokemon2.name} tem vantagem de tipo contra ${this.pokemon1.name}`,
      };
    }

    return null;
  }

  getStatColor(statName: string): string {
    return this.statColors[statName] || '#3D7DCA';
  }

  getHigherStat(stat1: number, stat2: number): number {
    return stat1 >= stat2 ? 1 : 2;
  }

  resetComparison(): void {
    this.pokemon1 = null;
    this.pokemon2 = null;
    this.selectedPokemon1Id = '';
    this.selectedPokemon2Id = '';
  }
}
