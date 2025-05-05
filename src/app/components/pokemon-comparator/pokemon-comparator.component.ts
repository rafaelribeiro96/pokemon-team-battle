/* pokemon-comparator.component.ts */
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
  filteredPokemonList1: { id: number; name: string }[] = [];
  filteredPokemonList2: { id: number; name: string }[] = [];
  selectedPokemon1Id: number | string = '';
  selectedPokemon2Id: number | string = '';
  pokemon1: PokemonDetail | null = null;
  pokemon2: PokemonDetail | null = null;
  loading: boolean = false;
  initialLoading: boolean = true;
  searchTerm1: string = '';
  searchTerm2: string = '';
  showDropdown1: boolean = false;
  showDropdown2: boolean = false;
  generations: { id: number; name: string; range: [number, number] }[] = [
    { id: 1, name: 'Geração I (Kanto)', range: [1, 151] },
    { id: 2, name: 'Geração II (Johto)', range: [152, 251] },
    { id: 3, name: 'Geração III (Hoenn)', range: [252, 386] },
    { id: 4, name: 'Geração IV (Sinnoh)', range: [387, 493] },
    { id: 5, name: 'Geração V (Unova)', range: [494, 649] },
    { id: 6, name: 'Geração VI (Kalos)', range: [650, 721] },
    { id: 7, name: 'Geração VII (Alola)', range: [722, 809] },
    { id: 8, name: 'Geração VIII (Galar)', range: [810, 905] },
    { id: 9, name: 'Geração IX (Paldea)', range: [906, 1025] },
  ];
  selectedGeneration: number = 0; // 0 = todas as gerações
  totalPokemonCount: number = 1025; // Número aproximado de Pokémon até a geração mais recente
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
      this.initialLoading = true;
      // Carregar todos os Pokémon disponíveis
      const pokemonList = await this.pokemonService.fetchPokemonList(
        0,
        this.totalPokemonCount
      );
      this.pokemonList = pokemonList.map((p) => ({ id: p.id, name: p.name }));
      this.filteredPokemonList1 = [];
      this.filteredPokemonList2 = [];
    } catch (error) {
      console.error('Erro ao carregar lista de Pokémon:', error);
    } finally {
      this.initialLoading = false;
    }
  }

  filterPokemonList(listNumber: number): void {
    const searchTerm =
      listNumber === 1
        ? this.searchTerm1.toLowerCase()
        : this.searchTerm2.toLowerCase();

    if (!searchTerm || searchTerm.length < 2) {
      if (listNumber === 1) {
        this.filteredPokemonList1 = [];
        this.showDropdown1 = false;
      } else {
        this.filteredPokemonList2 = [];
        this.showDropdown2 = false;
      }
      return;
    }

    const sourceList = [...this.pokemonList];

    // Filtrar por geração se uma estiver selecionada
    let filteredByGeneration = sourceList;
    if (this.selectedGeneration > 0) {
      const genRange = this.generations.find(
        (g) => g.id === this.selectedGeneration
      )?.range;
      if (genRange) {
        filteredByGeneration = sourceList.filter(
          (p) => p.id >= genRange[0] && p.id <= genRange[1]
        );
      }
    }

    // Filtrar por termo de pesquisa
    const filtered = filteredByGeneration.filter((pokemon) => {
      // Verificar se o termo de pesquisa é um número (ID)
      const isNumeric = /^\d+$/.test(searchTerm);

      if (isNumeric) {
        return pokemon.id.toString().includes(searchTerm);
      } else {
        return pokemon.name.toLowerCase().includes(searchTerm);
      }
    });

    // Limitar a 20 resultados para performance
    const limitedResults = filtered.slice(0, 20);

    if (listNumber === 1) {
      this.filteredPokemonList1 = limitedResults;
      this.showDropdown1 = limitedResults.length > 0;
    } else {
      this.filteredPokemonList2 = limitedResults;
      this.showDropdown2 = limitedResults.length > 0;
    }
  }

  selectPokemon(
    listNumber: number,
    pokemon: { id: number; name: string }
  ): void {
    if (listNumber === 1) {
      this.selectedPokemon1Id = pokemon.id;
      this.searchTerm1 = `#${pokemon.id.toString().padStart(3, '0')} ${
        pokemon.name
      }`;
      this.showDropdown1 = false;
      this.loadPokemon(1);
    } else {
      this.selectedPokemon2Id = pokemon.id;
      this.searchTerm2 = `#${pokemon.id.toString().padStart(3, '0')} ${
        pokemon.name
      }`;
      this.showDropdown2 = false;
      this.loadPokemon(2);
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
      let minId = 1;
      let maxId = this.totalPokemonCount;

      // Se uma geração estiver selecionada, usar seu intervalo
      if (this.selectedGeneration > 0) {
        const genRange = this.generations.find(
          (g) => g.id === this.selectedGeneration
        )?.range;
        if (genRange) {
          minId = genRange[0];
          maxId = genRange[1];
        }
      }

      // Gerar dois IDs aleatórios dentro do intervalo
      const id1 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      let id2 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

      // Garantir que os IDs sejam diferentes
      while (id2 === id1) {
        id2 = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      }

      this.selectedPokemon1Id = id1;
      this.selectedPokemon2Id = id2;

      // Atualizar os termos de pesquisa
      const pokemon1 = this.pokemonList.find((p) => p.id === id1);
      const pokemon2 = this.pokemonList.find((p) => p.id === id2);

      if (pokemon1) {
        this.searchTerm1 = `#${pokemon1.id.toString().padStart(3, '0')} ${
          pokemon1.name
        }`;
      }

      if (pokemon2) {
        this.searchTerm2 = `#${pokemon2.id.toString().padStart(3, '0')} ${
          pokemon2.name
        }`;
      }

      // Carregar os Pokémon
      const pokemonData1 = await this.pokemonService.fetchPokemonById(id1);
      const pokemonData2 = await this.pokemonService.fetchPokemonById(id2);

      this.pokemon1 = pokemonData1;
      this.pokemon2 = pokemonData2;
    } catch (error) {
      console.error('Erro ao carregar Pokémon aleatórios:', error);
    } finally {
      this.loading = false;
    }
  }

  changeGeneration(genId: number): void {
    this.selectedGeneration = genId;
    // Atualizar as listas filtradas se houver termos de pesquisa
    if (this.searchTerm1) {
      this.filterPokemonList(1);
    }
    if (this.searchTerm2) {
      this.filterPokemonList(2);
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
    this.searchTerm1 = '';
    this.searchTerm2 = '';
    this.showDropdown1 = false;
    this.showDropdown2 = false;
  }

  // Método para fechar os dropdowns quando clicar fora deles
  closeDropdowns(): void {
    this.showDropdown1 = false;
    this.showDropdown2 = false;
  }

  // Impedir que o clique no dropdown feche o próprio dropdown
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
