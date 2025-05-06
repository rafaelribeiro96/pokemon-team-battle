export interface PokemonGameReception {
  score: number;
  review: string;
}

export interface PokemonGame {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  generation: number;
  category: string;
  coverImage: string;
  trailerUrl?: string;
  reception: PokemonGameReception;
  platforms: string[];
  screenshots?: string[];
  features: string[];
}
