import { Pokemon } from './pokemon.model';

export interface BattlePokemon extends Pokemon {
  originalPosition: number;
  battlesFought: number;
  consecutiveBattles: number;
}
