import { Injectable } from '@angular/core';
import {
  Pokemon,
  PokemonDetail,
  EvolutionPokemon,
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbName = 'pokemon-team-battle';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): Promise<boolean> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB não é suportado neste navegador.');
        resolve(false);
        return;
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Erro ao abrir o banco de dados:', event);
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        console.log('Banco de dados inicializado com sucesso!');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Criar stores para diferentes tipos de dados
        if (!db.objectStoreNames.contains('pokemon')) {
          db.createObjectStore('pokemon', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('pokemonDetail')) {
          db.createObjectStore('pokemonDetail', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('evolution')) {
          db.createObjectStore('evolution', { keyPath: 'pokemonId' });
        }

        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  // Salvar lista de Pokémon
  async savePokemonList(pokemonList: Pokemon[]): Promise<void> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('pokemon', 'readwrite');
        const store = transaction.objectStore('pokemon');

        // Limpar store antes de adicionar novos dados
        store.clear();

        // Adicionar cada Pokémon individualmente
        for (const pokemon of pokemonList) {
          store.put(pokemon);
        }

        // Salvar metadata com timestamp
        const metaTransaction = this.db!.transaction('metadata', 'readwrite');
        const metaStore = metaTransaction.objectStore('metadata');
        metaStore.put({
          key: 'lastPokemonListUpdate',
          timestamp: Date.now(),
          count: pokemonList.length,
        });

        transaction.oncomplete = () => {
          console.log(`${pokemonList.length} Pokémon salvos no IndexedDB.`);
          resolve();
        };

        transaction.onerror = (event) => {
          console.error('Erro ao salvar Pokémon:', event);
          reject(new Error('Erro ao salvar Pokémon no IndexedDB.'));
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Carregar lista de Pokémon
  async loadPokemonList(): Promise<Pokemon[]> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return [];
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('pokemon', 'readonly');
        const store = transaction.objectStore('pokemon');
        const request = store.getAll();

        request.onsuccess = () => {
          const pokemonList = request.result as Pokemon[];
          console.log(`${pokemonList.length} Pokémon carregados do IndexedDB.`);
          resolve(pokemonList);
        };

        request.onerror = (event) => {
          console.error('Erro ao carregar Pokémon:', event);
          reject(new Error('Erro ao carregar Pokémon do IndexedDB.'));
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Salvar detalhes de um Pokémon
  async savePokemonDetail(pokemon: PokemonDetail): Promise<void> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('pokemonDetail', 'readwrite');
        const store = transaction.objectStore('pokemonDetail');

        const request = store.put(pokemon);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          console.error('Erro ao salvar detalhes do Pokémon:', event);
          reject(new Error('Erro ao salvar detalhes do Pokémon no IndexedDB.'));
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Carregar detalhes de um Pokémon
  async loadPokemonDetail(id: number): Promise<PokemonDetail | null> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return null;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('pokemonDetail', 'readonly');
        const store = transaction.objectStore('pokemonDetail');
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = (event) => {
          console.error('Erro ao carregar detalhes do Pokémon:', event);
          reject(
            new Error('Erro ao carregar detalhes do Pokémon do IndexedDB.')
          );
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Salvar cadeia de evolução
  async saveEvolutionChain(
    pokemonId: number,
    evolutions: EvolutionPokemon[]
  ): Promise<void> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('evolution', 'readwrite');
        const store = transaction.objectStore('evolution');

        const request = store.put({
          pokemonId,
          evolutions,
          timestamp: Date.now(),
        });

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          console.error('Erro ao salvar cadeia de evolução:', event);
          reject(new Error('Erro ao salvar cadeia de evolução no IndexedDB.'));
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Carregar cadeia de evolução
  async loadEvolutionChain(
    pokemonId: number
  ): Promise<EvolutionPokemon[] | null> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return null;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('evolution', 'readonly');
        const store = transaction.objectStore('evolution');
        const request = store.get(pokemonId);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.evolutions);
          } else {
            resolve(null);
          }
        };

        request.onerror = (event) => {
          console.error('Erro ao carregar cadeia de evolução:', event);
          reject(
            new Error('Erro ao carregar cadeia de evolução do IndexedDB.')
          );
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Verificar se os dados estão atualizados
  async getLastUpdateTimestamp(): Promise<{
    timestamp: number;
    count: number;
  } | null> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return null;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction('metadata', 'readonly');
        const store = transaction.objectStore('metadata');
        const request = store.get('lastPokemonListUpdate');

        request.onsuccess = () => {
          if (request.result) {
            resolve({
              timestamp: request.result.timestamp,
              count: request.result.count,
            });
          } else {
            resolve(null);
          }
        };

        request.onerror = (event) => {
          console.error('Erro ao carregar timestamp de atualização:', event);
          reject(
            new Error('Erro ao carregar timestamp de atualização do IndexedDB.')
          );
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }

  // Limpar todos os dados
  async clearAllData(): Promise<void> {
    await this.initDatabase();

    if (!this.db || !this.isInitialized) {
      console.warn('Banco de dados não inicializado.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(
          ['pokemon', 'pokemonDetail', 'evolution', 'metadata'],
          'readwrite'
        );

        transaction.objectStore('pokemon').clear();
        transaction.objectStore('pokemonDetail').clear();
        transaction.objectStore('evolution').clear();
        transaction.objectStore('metadata').clear();

        transaction.oncomplete = () => {
          console.log('Todos os dados foram limpos do IndexedDB.');
          resolve();
        };

        transaction.onerror = (event) => {
          console.error('Erro ao limpar dados:', event);
          reject(new Error('Erro ao limpar dados do IndexedDB.'));
        };
      } catch (error) {
        console.error('Erro ao iniciar transação:', error);
        reject(error);
      }
    });
  }
}
