import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PokemonGame } from '../models/pokemon-game.model';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  constructor(private apiService: ApiService) {}

  // Obter todos os jogos
  getAllGames(): Observable<PokemonGame[]> {
    return this.apiService.get<PokemonGame[]>('games');
  }

  // Obter jogo por ID
  getGameById(id: number): Observable<PokemonGame> {
    return this.apiService.get<PokemonGame>(`games/${id}`);
  }

  // Obter jogos por geração
  getGamesByGeneration(generation: number): Observable<PokemonGame[]> {
    return this.apiService.get<PokemonGame[]>(`games/generation/${generation}`);
  }

  // Obter jogos por categoria
  getGamesByCategory(category: string): Observable<PokemonGame[]> {
    return this.apiService.get<PokemonGame[]>(`games/category/${category}`);
  }

  // Obter jogos por plataforma
  getGamesByPlatform(platform: string): Observable<PokemonGame[]> {
    return this.apiService.get<PokemonGame[]>(`games/platform/${platform}`);
  }

  // Criar um novo jogo (apenas admin)
  createGame(gameData: PokemonGame): Observable<PokemonGame> {
    return this.apiService.post<PokemonGame>('games', gameData);
  }

  // Atualizar um jogo (apenas admin)
  updateGame(
    id: number,
    gameData: Partial<PokemonGame>
  ): Observable<PokemonGame> {
    return this.apiService.put<PokemonGame>(`games/${id}`, gameData);
  }

  // Excluir um jogo (apenas admin)
  deleteGame(id: number): Observable<any> {
    return this.apiService.delete<any>(`games/${id}`);
  }
}
