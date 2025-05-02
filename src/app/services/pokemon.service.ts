import { Injectable, signal } from '@angular/core';
import {
  Pokemon,
  PokemonDetail,
  PokemonListResponse,
  EvolutionPokemon,
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private cachedPokemon: Map<number, PokemonDetail> = new Map();
  private cachedList: Pokemon[] = [];
  private cachedTypes: string[] = [];
  private cachedEvolutions: Map<number, EvolutionPokemon[]> = new Map();
  private _pokemons = signal<Pokemon[]>([]);
  private totalPokemonCount = 898; // Número total de Pokémon na API (até a 8ª geração)

  constructor() {}

  // Método para compatibilidade com TeamBuilderComponent
  async fetchPokemons(limit: number = 151): Promise<Pokemon[]> {
    try {
      const pokemonList = await this.fetchPokemonList(0, limit);
      this._pokemons.set(pokemonList);
      return pokemonList;
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      throw error;
    }
  }

  // Método para compatibilidade com TeamBuilderComponent
  pokemons() {
    return this._pokemons();
  }

  async fetchPokemonList(
    offset: number = 0,
    limit: number = 20
  ): Promise<Pokemon[]> {
    try {
      // Se já temos os Pokémon em cache, retornamos do cache
      if (this.cachedList.length > offset + limit) {
        return this.cachedList.slice(offset, offset + limit);
      }

      console.log(
        `Buscando Pokémon do offset ${offset} ao ${offset + limit - 1}`
      );

      const response = await fetch(
        `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data: PokemonListResponse = await response.json();

      const pokemonPromises = data.results.map(async (result) => {
        const id = this.extractIdFromUrl(result.url);
        return this.fetchBasicPokemonData(id);
      });

      const pokemonList = await Promise.all(pokemonPromises);

      // Atualizar cache
      if (offset === 0) {
        this.cachedList = pokemonList;
      } else {
        // Garantir que não haja duplicatas
        const newPokemon = pokemonList.filter(
          (pokemon) => !this.cachedList.some((p) => p.id === pokemon.id)
        );
        this.cachedList = [...this.cachedList, ...newPokemon];
      }

      console.log(
        `Carregados ${pokemonList.length} Pokémon. Total em cache: ${this.cachedList.length}`
      );
      return pokemonList;
    } catch (error) {
      console.error('Erro ao buscar lista de Pokémon:', error);
      throw error;
    }
  }

  // Método para obter o número total de Pokémon
  async getTotalPokemonCount(): Promise<number> {
    try {
      // Se já temos o valor em cache, retornamos
      if (this.totalPokemonCount > 0) {
        return this.totalPokemonCount;
      }

      const response = await fetch(`${this.apiUrl}/pokemon?limit=1`);
      const data = await response.json();
      this.totalPokemonCount = data.count;
      return this.totalPokemonCount;
    } catch (error) {
      console.error('Erro ao buscar contagem total de Pokémon:', error);
      return 898; // Valor padrão caso ocorra erro
    }
  }

  async fetchAllPokemonTypes(): Promise<string[]> {
    if (this.cachedTypes.length > 0) {
      return this.cachedTypes;
    }

    try {
      const response = await fetch(`${this.apiUrl}/type`);
      const data = await response.json();

      const types = data.results
        .map((type: { name: string }) => type.name)
        .filter((type: string) => !['unknown', 'shadow'].includes(type));

      this.cachedTypes = types;
      return types;
    } catch (error) {
      console.error('Erro ao buscar tipos de Pokémon:', error);
      throw error;
    }
  }

  async fetchPokemonByType(type: string): Promise<Pokemon[]> {
    try {
      const response = await fetch(`${this.apiUrl}/type/${type}`);
      const data = await response.json();

      const pokemonPromises = data.pokemon
        .slice(0, 50) // Aumentado para 50 para mostrar mais Pokémon por tipo
        .map(async (entry: { pokemon: { name: string; url: string } }) => {
          const id = this.extractIdFromUrl(entry.pokemon.url);
          return this.fetchBasicPokemonData(id);
        });

      return await Promise.all(pokemonPromises);
    } catch (error) {
      console.error(`Erro ao buscar Pokémon do tipo ${type}:`, error);
      throw error;
    }
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    if (!query) {
      return this.fetchPokemonList(0, 20);
    }

    query = query.toLowerCase();

    try {
      // Se for um número, buscar por ID
      if (/^\d+$/.test(query)) {
        const id = parseInt(query);
        try {
          const pokemon = await this.fetchBasicPokemonData(id);
          return [pokemon];
        } catch {
          return [];
        }
      }

      // Buscar todos os Pokémon para pesquisa por nome parcial
      // Aumentamos o limite para garantir que mais Pokémon sejam carregados
      if (this.cachedList.length < 251) {
        await this.fetchPokemonList(0, 251); // Carregar pelo menos os 251 primeiros
      }

      // Filtrar por nome parcial
      return this.cachedList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error('Erro ao pesquisar Pokémon:', error);
      throw error;
    }
  }

  async fetchPokemonById(id: number): Promise<PokemonDetail> {
    // Verificar cache
    if (this.cachedPokemon.has(id)) {
      return this.cachedPokemon.get(id)!;
    }

    try {
      const response = await fetch(`${this.apiUrl}/pokemon/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const hp = data.stats.find(
        (stat: { stat: { name: string } }) => stat.stat.name === 'hp'
      ).base_stat;

      const pokemon: PokemonDetail = {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other['official-artwork'].front_default ||
          data.sprites.front_default,
        type: data.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map(
          (ability: { ability: { name: string } }) => ability.ability.name
        ),
        sprites: {
          front_default: data.sprites.front_default,
          front_shiny: data.sprites.front_shiny,
          other: {
            'official-artwork': {
              front_default:
                data.sprites.other['official-artwork'].front_default,
              front_shiny: data.sprites.other['official-artwork'].front_shiny,
            },
          },
        },
        stats: {
          hp: hp,
          attack: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'attack'
          ).base_stat,
          defense: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'defense'
          ).base_stat,
          specialAttack: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === 'special-attack'
          ).base_stat,
          specialDefense: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === 'special-defense'
          ).base_stat,
          speed: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'speed'
          ).base_stat,
          maxHp: hp,
        },
      };

      // Adicionar ao cache
      this.cachedPokemon.set(id, pokemon);

      return pokemon;
    } catch (error) {
      console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
      throw error;
    }
  }

  async fetchEvolutionChain(pokemonId: number): Promise<EvolutionPokemon[]> {
    // Verificar cache
    if (this.cachedEvolutions.has(pokemonId)) {
      return this.cachedEvolutions.get(pokemonId)!;
    }

    try {
      // Primeiro, precisamos obter a espécie do Pokémon
      const speciesResponse = await fetch(
        `${this.apiUrl}/pokemon-species/${pokemonId}`
      );

      if (!speciesResponse.ok) {
        throw new Error(
          `Erro na API de espécies: ${speciesResponse.status} ${speciesResponse.statusText}`
        );
      }

      const speciesData = await speciesResponse.json();

      // Obter URL da cadeia de evolução
      const evolutionChainUrl = speciesData.evolution_chain.url;

      // Buscar dados da cadeia de evolução
      const evolutionResponse = await fetch(evolutionChainUrl);

      if (!evolutionResponse.ok) {
        throw new Error(
          `Erro na API de evolução: ${evolutionResponse.status} ${evolutionResponse.statusText}`
        );
      }

      const evolutionData = await evolutionResponse.json();

      // Processar a cadeia de evolução
      const evolutionChain: EvolutionPokemon[] = [];

      // Função recursiva para processar a cadeia
      const processEvolutionChain = async (chain: any) => {
        const pokemonId = this.extractIdFromUrl(chain.species.url);
        try {
          const pokemon = await this.fetchBasicPokemonData(pokemonId);

          evolutionChain.push({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
          });

          // Processar próximas evoluções
          if (chain.evolves_to && chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
              await processEvolutionChain(evolution);
            }
          }
        } catch (error) {
          console.error(
            `Erro ao processar evolução do Pokémon ${pokemonId}:`,
            error
          );
        }
      };

      await processEvolutionChain(evolutionData.chain);

      // Adicionar ao cache
      this.cachedEvolutions.set(pokemonId, evolutionChain);

      return evolutionChain;
    } catch (error) {
      console.error(
        `Erro ao buscar cadeia de evolução para Pokémon ${pokemonId}:`,
        error
      );
      return [];
    }
  }

  private async fetchBasicPokemonData(id: number): Promise<Pokemon> {
    try {
      const response = await fetch(`${this.apiUrl}/pokemon/${id}`);

      if (!response.ok) {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const hp = data.stats.find(
        (stat: { stat: { name: string } }) => stat.stat.name === 'hp'
      ).base_stat;

      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other['official-artwork'].front_default ||
          data.sprites.front_default,
        type: data.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        stats: {
          hp: hp,
          attack: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'attack'
          ).base_stat,
          defense: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'defense'
          ).base_stat,
          specialAttack: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === 'special-attack'
          ).base_stat,
          specialDefense: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === 'special-defense'
          ).base_stat,
          speed: data.stats.find(
            (stat: { stat: { name: string } }) => stat.stat.name === 'speed'
          ).base_stat,
          maxHp: hp,
        },
      };
    } catch (error) {
      console.error(`Erro ao buscar dados básicos do Pokémon ${id}:`, error);
      throw error;
    }
  }

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/?$/);
    return matches ? parseInt(matches[1]) : 0;
  }
}
