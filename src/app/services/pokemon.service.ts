import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  from,
  of,
  catchError,
  map,
  tap,
  firstValueFrom,
  lastValueFrom,
} from 'rxjs';
import { environment } from '../../environments/environment';
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
  private apiUrl = `${environment.apiUrl}/pokemon`;
  private cachedPokemon: Map<number, PokemonDetail> = new Map();
  private cachedList: Pokemon[] = [];
  private cachedTypes: string[] = [];
  private cachedEvolutions: Map<number, EvolutionPokemon[]> = new Map();
  private _pokemons = signal<Pokemon[]>([]);

  // Observables para monitorar o progresso do carregamento
  private loadingProgress = new BehaviorSubject<number>(0);
  private isLoadingComplete = new BehaviorSubject<boolean>(false);
  private isPreloadingActive = false;

  constructor(private http: HttpClient) {
    // Iniciar carregamento dos dados
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      // Verificar se o backend tem dados em cache
      const response = await firstValueFrom(
        this.http.get<{ hasCache: boolean }>(`${this.apiUrl}/cache-status`)
      );

      if (response.hasCache) {
        this.isLoadingComplete.next(true);
        this.loadingProgress.next(100);
      } else {
        this.preloadAllPokemon();
      }
    } catch (error) {
      // Em caso de erro, iniciar pré-carregamento
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
      // Solicitar ao backend para pré-carregar os dados
      await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiUrl}/preload`, {})
      );

      this.isLoadingComplete.next(true);
      this.loadingProgress.next(100);

      // Monitorar o progresso do pré-carregamento
      const progressInterval = setInterval(async () => {
        try {
          const response = await firstValueFrom(
            this.http.get<{ progress: number }>(`${this.apiUrl}/preload-status`)
          );

          this.loadingProgress.next(response.progress);
          if (response.progress >= 100) {
            clearInterval(progressInterval);
            this.isLoadingComplete.next(true);
            this.isPreloadingActive = false;
          }
        } catch (error) {
          clearInterval(progressInterval);
          this.isLoadingComplete.next(true);
          this.isPreloadingActive = false;
        }
      }, 2000);
    } catch (error) {
      this.isPreloadingActive = false;
      this.isLoadingComplete.next(true);
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
      const pokemons = await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}?limit=${limit}`).pipe(
          catchError((error) => {
            console.error('Erro ao buscar Pokémon:', error);
            return of([]);
          })
        )
      );

      this._pokemons.set(pokemons);
      this.cachedList = pokemons;
      return pokemons;
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      return [];
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
    // Se já temos os Pokémon em cache, retornamos do cache
    if (this.cachedList.length > offset + limit) {
      return this.cachedList.slice(offset, offset + limit);
    }

    try {
      const pokemons = await firstValueFrom(
        this.http
          .get<Pokemon[]>(`${this.apiUrl}?offset=${offset}&limit=${limit}`)
          .pipe(
            catchError((error) => {
              console.error('Erro ao buscar lista de Pokémon:', error);
              return of([]);
            })
          )
      );

      // Atualizar cache
      if (offset === 0) {
        this.cachedList = pokemons;
      } else {
        // Garantir que não haja duplicatas
        const newPokemon = pokemons.filter(
          (pokemon) => !this.cachedList.some((p) => p.id === pokemon.id)
        );
        this.cachedList = [...this.cachedList, ...newPokemon];
        this.cachedList.sort((a, b) => a.id - b.id);
      }

      return pokemons;
    } catch (error) {
      console.error('Erro ao buscar lista de Pokémon:', error);
      return [];
    }
  }

  // Método para obter o número total de Pokémon
  async getTotalPokemonCount(): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ count: number }>(`${this.apiUrl}/count`).pipe(
          catchError(() => of({ count: 1025 })) // Valor padrão caso ocorra erro
        )
      );
      return response.count;
    } catch (error) {
      return 1025; // Valor padrão caso ocorra erro
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
      const types = await firstValueFrom(
        this.http.get<string[]>(`${this.apiUrl}/types`).pipe(
          catchError((error) => {
            console.error('Erro ao buscar tipos de Pokémon:', error);
            return of([]);
          })
        )
      );

      this.cachedTypes = types;
      return types;
    } catch (error) {
      console.error('Erro ao buscar tipos de Pokémon:', error);
      return [];
    }
  }

  async fetchPokemonByType(type: string): Promise<Pokemon[]> {
    // Se temos todos os Pokémon em cache, filtramos localmente
    if (this.isLoadingComplete.value && this.cachedList.length > 0) {
      const filteredPokemon = this.cachedList.filter((pokemon) =>
        pokemon.type.includes(type)
      );
      return filteredPokemon;
    }

    try {
      return await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}/type/${type}`).pipe(
          catchError((error) => {
            console.error(`Erro ao buscar Pokémon do tipo ${type}:`, error);
            return of([]);
          })
        )
      );
    } catch (error) {
      console.error(`Erro ao buscar Pokémon do tipo ${type}:`, error);
      return [];
    }
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    if (!query) {
      return this.getPokemonPage(1, 20);
    }

    query = query.toLowerCase();

    // Se for um número, buscar por ID
    if (/^\d+$/.test(query)) {
      const id = parseInt(query);
      try {
        const pokemon = await this.getPokemonById(id);
        return pokemon ? [pokemon] : [];
      } catch (error) {
        return [];
      }
    }

    // Se temos Pokémon em cache, usamos o cache para pesquisa
    if (this.cachedList.length > 0) {
      const filteredPokemon = this.cachedList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query)
      );
      return filteredPokemon;
    }

    try {
      return await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}/search?term=${query}`).pipe(
          catchError((error) => {
            console.error('Erro ao buscar Pokémon:', error);
            return of([]);
          })
        )
      );
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      return [];
    }
  }

  async getPokemonById(id: number): Promise<Pokemon | null> {
    try {
      return await firstValueFrom(
        this.http.get<Pokemon>(`${this.apiUrl}/${id}`).pipe(
          catchError((error) => {
            console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
            return of(null);
          })
        )
      );
    } catch (error) {
      console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
      return null;
    }
  }

  async fetchPokemonById(id: number): Promise<PokemonDetail> {
    // Verificar cache em memória
    if (this.cachedPokemon.has(id)) {
      return this.cachedPokemon.get(id)!;
    }

    try {
      const pokemon = await firstValueFrom(
        this.http.get<PokemonDetail>(`${this.apiUrl}/${id}/details`)
      );

      // Adicionar ao cache em memória
      this.cachedPokemon.set(id, pokemon);
      return pokemon;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do Pokémon com ID ${id}:`, error);
      throw error;
    }
  }

  async fetchEvolutionChain(pokemonId: number): Promise<EvolutionPokemon[]> {
    // Verificar cache em memória
    if (this.cachedEvolutions.has(pokemonId)) {
      return this.cachedEvolutions.get(pokemonId)!;
    }

    try {
      const evolutions = await firstValueFrom(
        this.http
          .get<EvolutionPokemon[]>(`${this.apiUrl}/${pokemonId}/evolution`)
          .pipe(
            catchError((error) => {
              console.error(
                `Erro ao buscar cadeia de evolução do Pokémon com ID ${pokemonId}:`,
                error
              );
              return of([]);
            })
          )
      );

      // Adicionar ao cache em memória
      this.cachedEvolutions.set(pokemonId, evolutions);
      return evolutions;
    } catch (error) {
      console.error(
        `Erro ao buscar cadeia de evolução do Pokémon com ID ${pokemonId}:`,
        error
      );
      return [];
    }
  }
}
