import { Injectable } from '@angular/core';
import type { Pokemon } from '../models/pokemon.model';

export interface SavedTeam {
  name: string;
  trainerAvatar: string;
  pokemons: Pokemon[];
}

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly STORAGE_KEY = 'pokemon_saved_team';

  constructor() {}

  saveTeam(team: SavedTeam): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Erro ao salvar o time:', error);
    }
  }

  loadTeam(): SavedTeam | null {
    try {
      const savedTeam = localStorage.getItem(this.STORAGE_KEY);
      return savedTeam ? JSON.parse(savedTeam) : null;
    } catch (error) {
      console.error('Erro ao carregar o time:', error);
      return null;
    }
  }

  deleteTeam(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao excluir o time:', error);
    }
  }
}
