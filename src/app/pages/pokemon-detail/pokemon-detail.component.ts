import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetail | null = null;
  previousPokemon: { id: number; name: string; image: string } | null = null;
  nextPokemon: { id: number; name: string; image: string } | null = null;
  loading: boolean = true;
  showShiny: boolean = false;
  error: string | null = null;

  // Mapeamento de tipos para cores
  typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  // Mapeamento de tipos em inglês para português
  typeTranslations: { [key: string]: string } = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    electric: 'Elétrico',
    grass: 'Planta',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Venenoso',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Metálico',
    fairy: 'Fada',
  };

  // Mapeamento de efetividade de tipos
  typeEffectiveness: {
    [key: string]: { weakTo: string[]; strongAgainst: string[] };
  } = {
    normal: {
      weakTo: ['fighting'],
      strongAgainst: [],
    },
    fire: {
      weakTo: ['water', 'ground', 'rock'],
      strongAgainst: ['grass', 'ice', 'bug', 'steel'],
    },
    water: {
      weakTo: ['electric', 'grass'],
      strongAgainst: ['fire', 'ground', 'rock'],
    },
    electric: {
      weakTo: ['ground'],
      strongAgainst: ['water', 'flying'],
    },
    grass: {
      weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
      strongAgainst: ['water', 'ground', 'rock'],
    },
    ice: {
      weakTo: ['fire', 'fighting', 'rock', 'steel'],
      strongAgainst: ['grass', 'ground', 'flying', 'dragon'],
    },
    fighting: {
      weakTo: ['flying', 'psychic', 'fairy'],
      strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    },
    poison: {
      weakTo: ['ground', 'psychic'],
      strongAgainst: ['grass', 'fairy'],
    },
    ground: {
      weakTo: ['water', 'grass', 'ice'],
      strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
    },
    flying: {
      weakTo: ['electric', 'ice', 'rock'],
      strongAgainst: ['grass', 'fighting', 'bug'],
    },
    psychic: {
      weakTo: ['bug', 'ghost', 'dark'],
      strongAgainst: ['fighting', 'poison'],
    },
    bug: {
      weakTo: ['fire', 'flying', 'rock'],
      strongAgainst: ['grass', 'psychic', 'dark'],
    },
    rock: {
      weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
      strongAgainst: ['fire', 'ice', 'flying', 'bug'],
    },
    ghost: {
      weakTo: ['ghost', 'dark'],
      strongAgainst: ['psychic', 'ghost'],
    },
    dragon: {
      weakTo: ['ice', 'dragon', 'fairy'],
      strongAgainst: ['dragon'],
    },
    dark: {
      weakTo: ['fighting', 'bug', 'fairy'],
      strongAgainst: ['psychic', 'ghost'],
    },
    steel: {
      weakTo: ['fire', 'fighting', 'ground'],
      strongAgainst: ['ice', 'rock', 'fairy'],
    },
    fairy: {
      weakTo: ['poison', 'steel'],
      strongAgainst: ['fighting', 'dragon', 'dark'],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadPokemon(id);
    });
  }

  async loadPokemon(id: number): Promise<void> {
    try {
      this.loading = true;
      this.pokemon = await this.pokemonService.fetchPokemonById(id);

      // Carregar Pokémon anterior se existir
      if (id > 1) {
        const prevPokemon = await this.pokemonService.fetchPokemonById(id - 1);
        this.previousPokemon = {
          id: prevPokemon.id,
          name: prevPokemon.name,
          image: prevPokemon.sprites.front_default,
        };
      } else {
        this.previousPokemon = null;
      }

      // Carregar próximo Pokémon
      try {
        const nextPokemon = await this.pokemonService.fetchPokemonById(id + 1);
        this.nextPokemon = {
          id: nextPokemon.id,
          name: nextPokemon.name,
          image: nextPokemon.sprites.front_default,
        };
      } catch {
        this.nextPokemon = null;
      }

      // Carregar evolução
      if (this.pokemon) {
        try {
          this.pokemon.evolutionChain =
            await this.pokemonService.fetchEvolutionChain(this.pokemon.id);
        } catch (error) {
          console.error('Erro ao carregar cadeia de evolução:', error);
        }
      }

      this.loading = false;
    } catch (error) {
      this.error = 'Falha ao carregar detalhes do Pokémon';
      this.loading = false;
      console.error(error);
    }
  }

  navigateToPokemon(id: number): void {
    this.router.navigate(['/pokedex', id]);
  }

  toggleShiny(): void {
    this.showShiny = !this.showShiny;
  }

  backToPokedex(): void {
    this.router.navigate(['/pokedex']);
  }

  formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  translateType(type: string): string {
    return (
      this.typeTranslations[type.toLowerCase()] ||
      this.capitalizeFirstLetter(type)
    );
  }

  getTypeColor(type: string): string {
    return this.typeColors[type.toLowerCase()] || '#A8A878';
  }

  getMainTypeColor(): string {
    if (!this.pokemon || !this.pokemon.type || this.pokemon.type.length === 0) {
      return 'transparent';
    }

    const mainType = this.pokemon.type[0].toLowerCase();
    return this.typeColors[mainType] || '#A8A878';
  }

  getStatPercentage(value: number): number {
    // Base stat max is typically 255
    return (value / 255) * 100;
  }

  getStatColor(value: number): string {
    if (value < 50) return '#ff7675';
    if (value < 80) return '#fdcb6e';
    if (value < 120) return '#74b9ff';
    return '#00b894';
  }

  getWeaknesses(): string[] {
    if (!this.pokemon || !this.pokemon.type || this.pokemon.type.length === 0) {
      return [];
    }

    // Combinar fraquezas de todos os tipos do Pokémon
    const weaknesses = new Set<string>();
    this.pokemon.type.forEach((type) => {
      const typeWeaknesses =
        this.typeEffectiveness[type.toLowerCase()]?.weakTo || [];
      typeWeaknesses.forEach((weakness) => weaknesses.add(weakness));
    });

    return Array.from(weaknesses);
  }

  getStrengths(): string[] {
    if (!this.pokemon || !this.pokemon.type || this.pokemon.type.length === 0) {
      return [];
    }

    // Combinar forças de todos os tipos do Pokémon
    const strengths = new Set<string>();
    this.pokemon.type.forEach((type) => {
      const typeStrengths =
        this.typeEffectiveness[type.toLowerCase()]?.strongAgainst || [];
      typeStrengths.forEach((strength) => strengths.add(strength));
    });

    return Array.from(strengths);
  }
}
