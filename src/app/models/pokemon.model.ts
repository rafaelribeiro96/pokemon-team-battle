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
  };
  isDefeated?: boolean;
  isAttacking?: boolean;
  isFainted?: boolean;
}
