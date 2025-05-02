import { Injectable, signal } from '@angular/core';
import axios from 'axios';
import { Pokemon } from '../models/pokemon.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  pokemons = signal<Pokemon[]>([]);

  // Novos sinais e subjects para a Pokédex
  private pokemonListSubject = new BehaviorSubject<any[]>([]);
  private pokemonTypesSubject = new BehaviorSubject<string[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalPokemonsSubject = new BehaviorSubject<number>(0);

  // Observables públicos
  pokemonList$: Observable<any[]> = this.pokemonListSubject.asObservable();
  pokemonTypes$: Observable<string[]> = this.pokemonTypesSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  totalPokemons$: Observable<number> = this.totalPokemonsSubject.asObservable();

  constructor() {
    // Carregar tipos de Pokémon ao inicializar o serviço
    this.fetchPokemonTypes();
  }

  async fetchPokemons(limit: number = 150): Promise<void> {
    try {
      const response = await axios.get(`${this.apiUrl}?limit=${limit}`);
      const pokemonData = response.data.results;

      const enrichedData = await Promise.all(
        pokemonData.map(async (pokemon: any) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: pokemon.name,
            image: details.data.sprites.front_default,
            type: details.data.types.map((t: any) => t.type.name),
            stats: {
              hp: details.data.stats[0].base_stat,
              maxHp: details.data.stats[0].base_stat,
              attack: details.data.stats[1].base_stat,
              defense: details.data.stats[2].base_stat,
              speed: details.data.stats[5].base_stat,
            },
          };
        })
      );

      this.pokemons.set(enrichedData);
    } catch (error) {
      console.error('Failed to fetch Pokémon data:', error);
    }
  }

  // Novos métodos para a Pokédex
  async fetchPokemonList(
    offset: number = 0,
    limit: number = 20
  ): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const response = await axios.get(
        `${this.apiUrl}?offset=${offset}&limit=${limit}`
      );
      const pokemonData = response.data.results;
      this.totalPokemonsSubject.next(response.data.count);

      const enrichedData = await Promise.all(
        pokemonData.map(async (pokemon: any) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: pokemon.name,
            image: details.data.sprites.front_default,
            types: details.data.types.map((t: any) => t.type.name),
            stats: {
              hp: details.data.stats[0].base_stat,
              attack: details.data.stats[1].base_stat,
              defense: details.data.stats[2].base_stat,
              specialAttack: details.data.stats[3].base_stat,
              specialDefense: details.data.stats[4].base_stat,
              speed: details.data.stats[5].base_stat,
            },
          };
        })
      );

      this.pokemonListSubject.next(enrichedData);
      this.loadingSubject.next(false);
    } catch (error) {
      console.error('Failed to fetch Pokémon list:', error);
      this.loadingSubject.next(false);
    }
  }

  async fetchPokemonById(id: number): Promise<any> {
    try {
      this.loadingSubject.next(true);
      const response = await axios.get(`${this.apiUrl}/${id}`);

      const pokemon = {
        id: response.data.id,
        name: response.data.name,
        height: response.data.height / 10, // Convert to meters
        weight: response.data.weight / 10, // Convert to kg
        types: response.data.types.map((t: any) => t.type.name),
        abilities: response.data.abilities.map((a: any) => a.ability.name),
        stats: {
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          specialAttack: response.data.stats[3].base_stat,
          specialDefense: response.data.stats[4].base_stat,
          speed: response.data.stats[5].base_stat,
        },
        sprites: {
          front_default: response.data.sprites.front_default,
          front_shiny: response.data.sprites.front_shiny,
          other: {
            'official-artwork': {
              front_default:
                response.data.sprites.other['official-artwork'].front_default,
              front_shiny:
                response.data.sprites.other['official-artwork'].front_shiny,
            },
          },
        },
      };

      this.loadingSubject.next(false);
      return pokemon;
    } catch (error) {
      console.error(`Failed to fetch Pokémon with ID ${id}:`, error);
      this.loadingSubject.next(false);
      throw error;
    }
  }

  async searchPokemon(query: string): Promise<any[]> {
    try {
      this.loadingSubject.next(true);

      // Se a consulta for um número, buscar por ID
      if (!isNaN(Number(query))) {
        const pokemon = await this.fetchPokemonById(Number(query));
        this.loadingSubject.next(false);
        return [pokemon];
      }

      // Caso contrário, buscar por nome
      const response = await axios.get(`${this.apiUrl}/${query.toLowerCase()}`);

      const pokemon = {
        id: response.data.id,
        name: response.data.name,
        image: response.data.sprites.front_default,
        types: response.data.types.map((t: any) => t.type.name),
      };

      this.loadingSubject.next(false);
      return [pokemon];
    } catch (error) {
      console.error(`Failed to search Pokémon with query ${query}:`, error);
      this.loadingSubject.next(false);
      return [];
    }
  }

  async fetchPokemonsByType(type: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      const pokemonData = response.data.pokemon;

      const enrichedData = await Promise.all(
        pokemonData.slice(0, 20).map(async (item: any) => {
          const details = await axios.get(item.pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name,
            image: details.data.sprites.front_default,
            types: details.data.types.map((t: any) => t.type.name),
          };
        })
      );

      this.pokemonListSubject.next(enrichedData);
      this.totalPokemonsSubject.next(pokemonData.length);
      this.loadingSubject.next(false);
    } catch (error) {
      console.error(`Failed to fetch Pokémon by type ${type}:`, error);
      this.loadingSubject.next(false);
    }
  }

  async fetchPokemonTypes(): Promise<void> {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      const types = response.data.results
        .map((type: any) => type.name)
        .filter((type: string) => type !== 'unknown' && type !== 'shadow');

      this.pokemonTypesSubject.next(types);
    } catch (error) {
      console.error('Failed to fetch Pokémon types:', error);
    }
  }
}
