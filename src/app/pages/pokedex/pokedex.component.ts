/* pokedex.component.ts */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { PokedexCardComponent } from '../../components/pokedex-card/pokedex-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TypeFilterComponent } from '../../components/type-filter/type-filter.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ItemsPerPageComponent } from '../../components/items-per-page/items-per-page.component';
import { Subscription } from 'rxjs';
import { PokemonProgressBarComponent } from '../../components/pokemon-progress-bar/pokemon-progress-bar.component';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    PokedexCardComponent,
    SearchBarComponent,
    TypeFilterComponent,
    PaginationComponent,
    ItemsPerPageComponent,
    PokemonProgressBarComponent,
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit, OnDestroy {
  pokemonList: Pokemon[] = [];
  searchResults: Pokemon[] | null = null;
  pokemonTypes: string[] = [];
  selectedType: string | null = null;
  loading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 20;
  itemsPerPageOptions: number[] = [20, 50, 100];
  totalPokemon: number = 0;

  // Variáveis para o progresso de carregamento
  loadingProgress: number = 0;
  isLoadingComplete: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.setupLoadingProgress();
    this.loadPokemonTypes();
    this.loadTotalPokemonCount();
    this.loadPokemonList();
  }

  ngOnDestroy(): void {
    // Limpar todas as inscrições para evitar vazamentos de memória
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  setupLoadingProgress(): void {
    // Monitorar o progresso de carregamento
    const progressSub = this.pokemonService
      .getLoadingProgress()
      .subscribe((progress) => {
        this.loadingProgress = progress;
      });

    // Monitorar quando o carregamento estiver completo
    const completeSub = this.pokemonService
      .getLoadingStatus()
      .subscribe((isComplete) => {
        this.isLoadingComplete = isComplete;
        if (isComplete) {
          // Atualizar o total de páginas quando o carregamento estiver completo
          this.updateTotalPages();
        }
      });

    this.subscriptions.push(progressSub, completeSub);
  }

  async loadTotalPokemonCount(): Promise<void> {
    try {
      this.totalPokemon = await this.pokemonService.getTotalPokemonCount();
      this.updateTotalPages();
    } catch (error) {
      // Valor padrão caso ocorra erro
      this.totalPages = Math.ceil(1025 / this.itemsPerPage);
    }
  }

  updateTotalPages(): void {
    if (this.isLoadingComplete) {
      // Se o carregamento estiver completo, usar o número real de Pokémon em cache
      this.totalPages = this.pokemonService.getTotalPages(this.itemsPerPage);
    } else {
      // Caso contrário, usar a estimativa baseada no total da API
      this.totalPages = Math.ceil(this.totalPokemon / this.itemsPerPage);
    }
  }

  async loadPokemonList(): Promise<void> {
    try {
      this.loading = true;

      if (this.isLoadingComplete) {
        // Se o carregamento estiver completo, usar o cache
        this.pokemonList = this.pokemonService.getPokemonPage(
          this.currentPage,
          this.itemsPerPage
        );
        this.loading = false;
      } else {
        // Caso contrário, buscar da API
        const offset = (this.currentPage - 1) * this.itemsPerPage;
        this.pokemonList = await this.pokemonService.fetchPokemonList(
          offset,
          this.itemsPerPage
        );
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
    }
  }

  async loadPokemonTypes(): Promise<void> {
    try {
      this.pokemonTypes = await this.pokemonService.fetchAllPokemonTypes();
    } catch (error) {
      // Erro silencioso
    }
  }

  async onSearch(query: string): Promise<void> {
    try {
      this.loading = true;

      if (!query) {
        this.searchResults = null;
        await this.loadPokemonList();
      } else {
        this.searchResults = await this.pokemonService.searchPokemon(query);
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  async onTypeSelect(type: string | null): Promise<void> {
    try {
      this.loading = true;
      this.selectedType = type;
      this.searchResults = null;

      if (type) {
        this.pokemonList = await this.pokemonService.fetchPokemonByType(type);
        this.totalPages = 1; // Não paginar resultados de tipo
      } else {
        await this.loadPokemonList();
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  async onPageChange(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadPokemonList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onItemsPerPageChange(value: number): Promise<void> {
    this.itemsPerPage = value;
    this.currentPage = 1; // Voltar para a primeira página
    this.updateTotalPages();
    await this.loadPokemonList();
  }
}
