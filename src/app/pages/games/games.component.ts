import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { SafePipe } from '../../pipes/safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import {
  PokemonGamesService,
  PokemonGame,
} from '../../services/pokemon-games.service';
import { ImgFallbackDirective } from '../../directives/fallback-image.directive';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    SafePipe,
    ImgFallbackDirective,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  animations: [
    trigger('cardExpand', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class GamesComponent implements OnInit {
  games: PokemonGame[] = [];
  filteredGames: PokemonGame[] = [];
  expandedGameId: number | null = null;
  activeView: string = 'grid';
  selectedGeneration: number | null = null;
  selectedPlatform: string | null = null;
  selectedCategory: string | null = null;
  sortOption: string = 'year-desc';

  // Dados pré-processados para as visualizações
  decades: number[] = [];
  years: number[] = [];
  platforms: string[] = [];
  categories: string[] = [];
  generations: number[] = [];

  // Fallback SVG para imagens que não carregam
  fallbackImageSvg: string;

  constructor(
    private sanitizer: DomSanitizer,
    private pokemonGamesService: PokemonGamesService
  ) {
    // SVG de fallback para jogos Pokémon
    this.fallbackImageSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
        <rect width="300" height="200" fill="#f0f0f0"/>
        <circle cx="150" cy="100" r="50" fill="#ff0000" stroke="#000" stroke-width="4"/>
        <circle cx="150" cy="100" r="15" fill="#ffffff" stroke="#000" stroke-width="4"/>
        <line x1="100" y1="100" x2="200" y2="100" stroke="#000" stroke-width="4"/>
        <text x="150" y="180" font-family="Arial" font-size="16" text-anchor="middle">Pokémon Game</text>
      </svg>
    `;
  }

  ngOnInit(): void {
    this.loadGames();
    this.processGameData();
    this.filterGames();
  }

  // Método para obter uma imagem de fallback segura para usar no template
  getSafeFallbackImage() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/svg+xml;base64,' + btoa(this.fallbackImageSvg)
    );
  }

  // Método para lidar com erros de carregamento de imagem
  handleImageError(event: any) {
    event.target.src =
      'data:image/svg+xml;base64,' + btoa(this.fallbackImageSvg);
  }

  loadGames(): void {
    this.games = this.pokemonGamesService.getGames();
  }

  processGameData(): void {
    // Extrair dados únicos para filtros
    this.platforms = [
      ...new Set(this.games.flatMap((game) => game.platforms)),
    ].sort();
    this.categories = [
      ...new Set(this.games.map((game) => game.category)),
    ].sort();
    this.generations = [
      ...new Set(this.games.map((game) => game.generation)),
    ].sort((a, b) => a - b);

    // Extrair anos e décadas para a visualização de linha do tempo
    this.years = [...new Set(this.games.map((game) => game.releaseYear))].sort(
      (a, b) => a - b
    );

    // Calcular décadas a partir dos anos
    const minYear = Math.min(...this.years);
    const maxYear = Math.max(...this.years);
    const minDecade = Math.floor(minYear / 10) * 10;
    const maxDecade = Math.floor(maxYear / 10) * 10;

    this.decades = [];
    for (let decade = minDecade; decade <= maxDecade; decade += 10) {
      this.decades.push(decade);
    }
  }

  filterGames(): void {
    this.filteredGames = this.games.filter((game) => {
      // Aplicar filtros
      const matchesGeneration =
        this.selectedGeneration === null ||
        game.generation === this.selectedGeneration;
      const matchesPlatform =
        this.selectedPlatform === null ||
        game.platforms.includes(this.selectedPlatform);
      const matchesCategory =
        this.selectedCategory === null ||
        game.category === this.selectedCategory;

      return matchesGeneration && matchesPlatform && matchesCategory;
    });

    this.sortGames();
  }

  sortGames(): void {
    this.filteredGames.sort((a, b) => {
      switch (this.sortOption) {
        case 'year-desc':
          return b.releaseYear - a.releaseYear;
        case 'year-asc':
          return a.releaseYear - b.releaseYear;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          return b.reception.score - a.reception.score;
        default:
          return 0;
      }
    });
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  clearFilters(): void {
    this.selectedGeneration = null;
    this.selectedPlatform = null;
    this.selectedCategory = null;
    this.sortOption = 'year-desc';
    this.filterGames();
  }

  toggleGameDetails(gameId: number): void {
    if (this.expandedGameId === gameId) {
      this.expandedGameId = null;
    } else {
      this.expandedGameId = gameId;
    }
  }

  // Métodos auxiliares para obter dados filtrados
  getGamesByYear(year: number): PokemonGame[] {
    return this.filteredGames.filter((game) => game.releaseYear === year);
  }

  getGamesByDecade(decade: number): PokemonGame[] {
    return this.filteredGames.filter(
      (game) => game.releaseYear >= decade && game.releaseYear < decade + 10
    );
  }

  getGamesByGeneration(generation: number): PokemonGame[] {
    return this.filteredGames.filter((game) => game.generation === generation);
  }

  getGamesByPlatform(platform: string): PokemonGame[] {
    return this.filteredGames.filter((game) =>
      game.platforms.includes(platform)
    );
  }

  getGamesByCategory(category: string): PokemonGame[] {
    return this.filteredGames.filter((game) => game.category === category);
  }

  // Método para obter o nome amigável da categoria
  getCategoryName(category: string): string {
    switch (category) {
      case 'main-series':
        return 'Série Principal';
      case 'remake':
        return 'Remake';
      case 'spin-off':
        return 'Spin-off';
      case 'mobile':
        return 'Mobile';
      default:
        return category;
    }
  }

  // Método para obter o ícone da plataforma
  getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'Game Boy':
      case 'Game Boy Color':
      case 'Game Boy Advance':
        return 'videogame_asset';
      case 'Nintendo DS':
      case 'Nintendo 3DS':
        return 'devices';
      case 'Nintendo Switch':
        return 'sports_esports';
      case 'Mobile':
        return 'smartphone';
      case 'PC':
        return 'computer';
      case 'Nintendo 64':
        return 'gamepad';
      default:
        return 'gamepad';
    }
  }

  // Método para obter a cor de fundo baseada na geração
  getGenerationColor(generation: number): string {
    switch (generation) {
      case 1:
        return '#ff1111'; // Vermelho (Red/Blue)
      case 2:
        return '#ffcc00'; // Dourado (Gold/Silver)
      case 3:
        return '#33cc33'; // Verde (Ruby/Sapphire/Emerald)
      case 4:
        return '#3366ff'; // Azul (Diamond/Pearl)
      case 5:
        return '#666666'; // Cinza (Black/White)
      case 6:
        return '#ff66cc'; // Rosa (X/Y)
      case 7:
        return '#ff9933'; // Laranja (Sun/Moon)
      case 8:
        return '#9966ff'; // Roxo (Sword/Shield)
      case 9:
        return '#00cccc'; // Turquesa (Scarlet/Violet)
      default:
        return '#cccccc';
    }
  }

  // Método para obter a cor de texto baseada na geração (para garantir contraste)
  getGenerationTextColor(generation: number): string {
    switch (generation) {
      case 1:
      case 3:
      case 4:
      case 5:
      case 8:
      case 9:
        return '#ffffff';
      default:
        return '#000000';
    }
  }

  // Método para verificar se um ano pertence a uma década
  isYearInDecade(year: number, decade: number): boolean {
    return Math.floor(year / 10) * 10 === decade;
  }
}
