import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Pokemon,
  PokemonDetail,
  PokemonListResponse,
  EvolutionPokemon,
} from '../models/pokemon.model';
import { StorageService } from './storage.service';

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

  // Observables para monitorar o progresso do carregamento
  private loadingProgress = new BehaviorSubject<number>(0);
  private isLoadingComplete = new BehaviorSubject<boolean>(false);
  private isPreloadingActive = false;

  // Tempo de validade do cache em milissegundos (7 dias)
  private cacheValidityPeriod = 7 * 24 * 60 * 60 * 1000;

  constructor(private storageService: StorageService) {
    // Iniciar carregamento dos dados do IndexedDB e depois verificar se precisa atualizar
    this.initializeFromStorage();
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      // Verificar se temos dados armazenados e se estão atualizados
      const lastUpdate = await this.storageService.getLastUpdateTimestamp();
      const currentTime = Date.now();

      if (
        lastUpdate &&
        currentTime - lastUpdate.timestamp < this.cacheValidityPeriod &&
        lastUpdate.count > 1000
      ) {
        console.log('Usando dados em cache do IndexedDB...');

        // Carregar dados do IndexedDB
        const storedPokemon = await this.storageService.loadPokemonList();

        if (storedPokemon.length > 0) {
          this.cachedList = storedPokemon;
          this.cachedList.sort((a, b) => a.id - b.id);
          console.log(
            `${this.cachedList.length} Pokémon carregados do armazenamento local.`
          );

          // Atualizar o sinal de carregamento completo
          this.isLoadingComplete.next(true);
          this.loadingProgress.next(100);

          // Não precisamos pré-carregar novamente
          return;
        }
      }

      // Se não temos dados armazenados ou estão desatualizados, iniciar pré-carregamento
      console.log(
        'Dados em cache não encontrados ou desatualizados. Iniciando pré-carregamento...'
      );
      this.preloadAllPokemon();
    } catch (error) {
      console.error('Erro ao inicializar do armazenamento:', error);
      // Em caso de erro, iniciar pré-carregamento normal
      this.preloadAllPokemon();
    }
  }

  // Método para pré-carregar todos os Pokémon em segundo plano
  async preloadAllPokemon(): Promise<void> {
    if (this.isPreloadingActive) {
      return; // Evitar múltiplos carregamentos simultâneos
    }

    this.isPreloadingActive = true;

    try {
      // Primeiro, obter o número total de Pokémon
      const totalCount = await this.getTotalPokemonCount();
      console.log(
        `Iniciando pré-carregamento de ${totalCount} Pokémon regulares...`
      );

      // Definir o tamanho do lote para não sobrecarregar a API
      const batchSize = 50;
      const totalBatches = Math.ceil(totalCount / batchSize);

      // Carregar Pokémon regulares em lotes
      for (let i = 0; i < totalBatches; i++) {
        const offset = i * batchSize;
        const limit = Math.min(batchSize, totalCount - offset);

        await this.fetchPokemonList(offset, limit);

        // Atualizar o progresso (90% para Pokémon regulares)
        const progress = Math.min(
          90,
          Math.round((((i + 1) * batchSize) / totalCount) * 90)
        );
        this.loadingProgress.next(progress);

        console.log(
          `Progresso: ${progress}% (${this.cachedList.length} Pokémon regulares)`
        );

        // Pequena pausa para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Agora carregar Pokémon especiais (IDs 10001+)
      console.log(
        'Carregando Pokémon especiais (formas alternativas, mega evoluções, etc.)...'
      );
      await this.loadSpecialPokemon();

      // Salvar todos os Pokémon no armazenamento local
      await this.storageService.savePokemonList(this.cachedList);

      console.log(
        `Pré-carregamento concluído! ${this.cachedList.length} Pokémon carregados no total.`
      );
      this.isLoadingComplete.next(true);
    } catch (error) {
      console.error('Erro durante o pré-carregamento:', error);
    } finally {
      this.isPreloadingActive = false;
    }
  }

  // Método para carregar Pokémon especiais (IDs 10001+)
  private async loadSpecialPokemon(): Promise<void> {
    try {
      // IDs conhecidos de Pokémon especiais (10001-10277)
      const startId = 10001;
      const endId = 10277;

      // Carregar em lotes menores para não sobrecarregar a API
      const batchSize = 20;
      const totalSpecial = endId - startId + 1;

      for (let i = 0; i < totalSpecial; i += batchSize) {
        const batchPromises = [];

        for (let j = 0; j < batchSize && i + j < totalSpecial; j++) {
          const id = startId + i + j;
          batchPromises.push(
            this.fetchBasicPokemonData(id).catch((err) => {
              console.log(
                `Pokémon especial ${id} não encontrado ou indisponível`
              );
              return null;
            })
          );
        }

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter((pokemon) => pokemon !== null);

        // Adicionar ao cache
        for (const pokemon of validResults) {
          if (pokemon && !this.cachedList.some((p) => p.id === pokemon.id)) {
            this.cachedList.push(pokemon);
          }
        }

        // Atualizar progresso (90-100% para Pokémon especiais)
        const specialProgress = Math.min(
          10,
          Math.round(((i + batchSize) / totalSpecial) * 10)
        );
        this.loadingProgress.next(90 + specialProgress);

        console.log(
          `Progresso especiais: ${90 + specialProgress}% (${
            this.cachedList.length
          } Pokémon no total)`
        );

        // Pausa para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Ordenar a lista completa por ID
      this.cachedList.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error('Erro ao carregar Pokémon especiais:', error);
    }
  }

  // Observables para monitorar o progresso
  getLoadingProgress(): Observable<number> {
    return this.loadingProgress.asObservable();
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoadingComplete.asObservable();
  }

  // Método para compatibilidade com TeamBuilderComponent
  async fetchPokemons(limit: number = 151): Promise<Pokemon[]> {
    try {
      // Se já temos todos os Pokémon em cache, use-os
      if (this.cachedList.length >= limit) {
        const result = this.cachedList.slice(0, limit);
        this._pokemons.set(result);
        return result;
      }

      // Caso contrário, busque-os
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
        // Garantir que não haja duplicatas e manter a ordem correta
        const newPokemon = pokemonList.filter(
          (pokemon) => !this.cachedList.some((p) => p.id === pokemon.id)
        );

        // Adicionar os novos Pokémon ao cache
        this.cachedList = [...this.cachedList, ...newPokemon];

        // Ordenar por ID
        this.cachedList.sort((a, b) => a.id - b.id);
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
      const response = await fetch(`${this.apiUrl}/pokemon?limit=1`);
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Erro ao buscar contagem total de Pokémon:', error);
      return 1025; // Valor padrão caso ocorra erro (atualizado para incluir todas as gerações)
    }
  }

  // Método para obter uma página específica de Pokémon do cache
  getPokemonPage(page: number, itemsPerPage: number): Pokemon[] {
    const startIndex = (page - 1) * itemsPerPage;
    return this.cachedList.slice(startIndex, startIndex + itemsPerPage);
  }

  // Método para obter o número total de páginas com base no tamanho da página
  getTotalPages(itemsPerPage: number): number {
    return Math.ceil(this.cachedList.length / itemsPerPage);
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
      // Se temos todos os Pokémon em cache, filtramos localmente
      if (this.isLoadingComplete.value) {
        return this.cachedList.filter((pokemon) => pokemon.type.includes(type));
      }

      // Caso contrário, buscamos da API
      const response = await fetch(`${this.apiUrl}/type/${type}`);
      const data = await response.json();

      const pokemonPromises = data.pokemon
        .slice(0, 100) // Aumentado para 100 para mostrar mais Pokémon por tipo
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
      return this.getPokemonPage(1, 20);
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

      // Se temos Pokémon em cache, usamos o cache para pesquisa
      if (this.cachedList.length > 0) {
        return this.cachedList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query)
        );
      }

      // Caso contrário, carregamos mais Pokémon para a pesquisa
      await this.fetchPokemonList(0, 500); // Carregar mais Pokémon para pesquisa

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
    // Verificar cache em memória
    if (this.cachedPokemon.has(id)) {
      return this.cachedPokemon.get(id)!;
    }

    try {
      // Verificar cache no IndexedDB
      const storedPokemon = await this.storageService.loadPokemonDetail(id);
      if (storedPokemon) {
        // Adicionar ao cache em memória
        this.cachedPokemon.set(id, storedPokemon);
        return storedPokemon;
      }

      // Se não estiver em cache, buscar da API
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

      // Adicionar ao cache em memória
      this.cachedPokemon.set(id, pokemon);

      // Salvar no IndexedDB
      await this.storageService.savePokemonDetail(pokemon);

      return pokemon;
    } catch (error) {
      console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
      throw error;
    }
  }

  async fetchEvolutionChain(pokemonId: number): Promise<EvolutionPokemon[]> {
    // Verificar cache em memória
    if (this.cachedEvolutions.has(pokemonId)) {
      return this.cachedEvolutions.get(pokemonId)!;
    }

    try {
      // Verificar cache no IndexedDB
      const storedEvolutions = await this.storageService.loadEvolutionChain(
        pokemonId
      );
      if (storedEvolutions) {
        // Adicionar ao cache em memória
        this.cachedEvolutions.set(pokemonId, storedEvolutions);
        return storedEvolutions;
      }

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

      // Adicionar ao cache em memória
      this.cachedEvolutions.set(pokemonId, evolutionChain);

      // Salvar no IndexedDB
      await this.storageService.saveEvolutionChain(pokemonId, evolutionChain);

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
