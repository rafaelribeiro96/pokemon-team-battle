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
  loading: boolean = true;
  showShiny: boolean = false;
  error: string | null = null;

  // Mapeamento de tipos em inglês para português
  private typeTranslations: { [key: string]: string } = {
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
    return this.typeTranslations[type] || this.capitalizeFirstLetter(type);
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
}
