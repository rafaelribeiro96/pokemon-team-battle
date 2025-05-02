/* pokemon.service.ts */
import { Injectable, signal } from '@angular/core';
import axios from 'axios';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  pokemons = signal<Pokemon[]>([]);

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
}
