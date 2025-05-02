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
  };
  isDefeated?: boolean;
  isAttacking?: boolean;
  isFainted?: boolean;
  selected?: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
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
}
