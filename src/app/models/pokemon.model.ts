export interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}
