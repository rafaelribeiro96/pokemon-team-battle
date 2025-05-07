import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  catchError,
  firstValueFrom,
} from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  Pokemon,
  PokemonDetail,
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

  // Cache para URLs de imagens
  private imageCache: Map<string, string> = new Map();

  // Fontes de imagens em ordem de preferência
  private imageSources = [
    (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
    (id: number) =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  ];

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
  async fetchPokemons(limit = 151): Promise<Pokemon[]> {
    try {
      const pokemons = await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}?limit=${limit}`).pipe(
          catchError((error) => {
            console.error('Erro ao buscar Pokémon:', error);
            return of([]);
          })
        )
      );

      // Pré-verificar imagens para os Pokémon carregados
      for (const pokemon of pokemons) {
        if (pokemon.id && pokemon.image) {
          this.verifyAndCacheImage(pokemon.id, pokemon.image);
        }
      }

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

  async fetchPokemonList(offset = 0, limit = 20): Promise<Pokemon[]> {
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

      // Pré-verificar imagens para os Pokémon carregados
      for (const pokemon of pokemons) {
        if (pokemon.id && pokemon.image) {
          this.verifyAndCacheImage(pokemon.id, pokemon.image);
        }
      }

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
      const pokemons = await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}/type/${type}`).pipe(
          catchError((error) => {
            console.error(`Erro ao buscar Pokémon do tipo ${type}:`, error);
            return of([]);
          })
        )
      );

      // Pré-verificar imagens para os Pokémon carregados
      for (const pokemon of pokemons) {
        if (pokemon.id && pokemon.image) {
          this.verifyAndCacheImage(pokemon.id, pokemon.image);
        }
      }

      return pokemons;
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
      const id = Number.parseInt(query);
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
      const pokemons = await firstValueFrom(
        this.http.get<Pokemon[]>(`${this.apiUrl}/search?term=${query}`).pipe(
          catchError((error) => {
            console.error('Erro ao buscar Pokémon:', error);
            return of([]);
          })
        )
      );

      // Pré-verificar imagens para os resultados da pesquisa
      for (const pokemon of pokemons) {
        if (pokemon.id && pokemon.image) {
          this.verifyAndCacheImage(pokemon.id, pokemon.image);
        }
      }

      return pokemons;
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      return [];
    }
  }

  // Adicione este método ao seu PokemonService

  // Método para pesquisa sem carregar imagens
  async searchPokemonNamesOnly(query: string): Promise<any[]> {
    if (!query) {
      return [];
    }

    query = query.toLowerCase();

    // Se for um número, buscar por ID
    if (/^\d+$/.test(query)) {
      const id = Number.parseInt(query);
      try {
        const pokemon = await this.getPokemonById(id);
        return pokemon ? [{ id: pokemon.id, name: pokemon.name }] : [];
      } catch (error) {
        return [];
      }
    }

    // Se temos Pokémon em cache, usamos o cache para pesquisa
    if (this.cachedList.length > 0) {
      const filteredPokemon = this.cachedList
        .filter((pokemon) => pokemon.name.toLowerCase().includes(query))
        .map((pokemon) => ({ id: pokemon.id, name: pokemon.name }));
      return filteredPokemon;
    }

    try {
      // Modificar a chamada de API para solicitar apenas os dados básicos
      return await firstValueFrom(
        this.http
          .get<any[]>(`${this.apiUrl}/search?term=${query}&basic=true`)
          .pipe(
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
      const pokemon = await firstValueFrom(
        this.http.get<Pokemon>(`${this.apiUrl}/${id}`).pipe(
          catchError((error) => {
            console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
            return of(null);
          })
        )
      );

      if (pokemon && pokemon.id && pokemon.image) {
        this.verifyAndCacheImage(pokemon.id, pokemon.image);
      }

      return pokemon;
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

      // Verificar e cachear a imagem
      if (pokemon && pokemon.image) {
        this.verifyAndCacheImage(id, pokemon.image);
      }

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

      // Verificar e cachear imagens para cada Pokémon na cadeia de evolução
      for (const evolution of evolutions) {
        if (evolution.id && evolution.image) {
          this.verifyAndCacheImage(evolution.id, evolution.image);
        }
      }

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

  // NOVOS MÉTODOS PARA GERENCIAMENTO DE IMAGENS

  // Método para verificar e cachear imagens
  private verifyAndCacheImage(
    pokemonId: number,
    initialImageUrl: string
  ): void {
    // Se já temos uma imagem cacheada para este Pokémon, não fazemos nada
    if (this.imageCache.has(pokemonId.toString())) {
      return;
    }

    // Primeiro, tentamos a URL inicial
    this.checkImageExists(initialImageUrl).then((exists) => {
      if (exists) {
        this.imageCache.set(pokemonId.toString(), initialImageUrl);
        return;
      }

      // Se a imagem inicial não existir, tentamos as fontes alternativas
      this.tryAlternativeImageSources(pokemonId);
    });
  }

  private async tryAlternativeImageSources(pokemonId: number): Promise<void> {
    for (const sourceGenerator of this.imageSources) {
      const imageUrl = sourceGenerator(pokemonId);
      const exists = await this.checkImageExists(imageUrl);

      if (exists) {
        this.imageCache.set(pokemonId.toString(), imageUrl);
        return;
      }
    }

    // Se nenhuma imagem funcionar, usamos o placeholder
    this.imageCache.set(
      pokemonId.toString(),
      '/assets/images/imagemDefault.png'
    );
  }

  // Método para verificar se uma imagem existe
  private checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Método público para obter a melhor URL de imagem para um Pokémon
  getBestPokemonImageUrl(
    pokemonId: number,
    fallbackUrl: string
  ): Observable<string> {
    // Se já temos uma imagem cacheada, retornamos ela
    if (this.imageCache.has(pokemonId.toString())) {
      return of(this.imageCache.get(pokemonId.toString())!);
    }

    // Verificar se o Pokémon está no cache local
    const cachedPokemon = this.cachedList.find((p) => p.id === pokemonId);
    if (cachedPokemon && cachedPokemon.image) {
      this.imageCache.set(pokemonId.toString(), cachedPokemon.image);
      return of(cachedPokemon.image);
    }

    // Tentar cada fonte de imagem sequencialmente
    return new Observable<string>((observer) => {
      let imageFound = false;
      let currentSourceIndex = 0;

      const tryNextSource = () => {
        if (currentSourceIndex >= this.imageSources.length) {
          // Se nenhuma fonte funcionar, usar o fallback
          this.imageCache.set(
            pokemonId.toString(),
            fallbackUrl || '/assets/images/imagemDefault.png'
          );
          observer.next(fallbackUrl || '/assets/images/imagemDefault.png');
          observer.complete();
          return;
        }

        const imageUrl = this.imageSources[currentSourceIndex](pokemonId);

        this.checkImageExists(imageUrl).then((exists) => {
          if (exists) {
            this.imageCache.set(pokemonId.toString(), imageUrl);
            observer.next(imageUrl);
            observer.complete();
            imageFound = true;
          } else {
            currentSourceIndex++;
            tryNextSource();
          }
        });
      };

      tryNextSource();

      // Retornar uma função de limpeza
      return () => {
        imageFound = true; // Impedir mais tentativas se o observador for cancelado
      };
    });
  }

  // Método para pré-carregar imagens para um conjunto de Pokémon
  preloadPokemonImages(pokemonIds: number[]): void {
    for (const id of pokemonIds) {
      // Se já temos a imagem em cache, pulamos
      if (this.imageCache.has(id.toString())) {
        continue;
      }

      // Tentamos cada fonte de imagem
      for (const sourceGenerator of this.imageSources) {
        const imageUrl = sourceGenerator(id);
        this.checkImageExists(imageUrl).then((exists) => {
          if (exists && !this.imageCache.has(id.toString())) {
            this.imageCache.set(id.toString(), imageUrl);
          }
        });
      }
    }
  }

  // Método para atualizar a imagem de um Pokémon no cache
  updatePokemonImage(pokemonId: number, newImageUrl: string): void {
    this.checkImageExists(newImageUrl).then((exists) => {
      if (exists) {
        this.imageCache.set(pokemonId.toString(), newImageUrl);
      }
    });
  }
}
