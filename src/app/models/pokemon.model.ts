/* pokemon.model.ts */
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string[];
  stats: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
    maxHp: number;
    specialAttack: number;
    specialDefense: number;
  };
  isDefeated?: boolean;
  isAttacking?: boolean;
  isFainted?: boolean;
  selected?: boolean;
  originalPosition?: number;
  battlesFought?: number;
  consecutiveBattles?: number;
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  abilities: string[];
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  evolutionChain?: EvolutionPokemon[];
}

export interface EvolutionPokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}
