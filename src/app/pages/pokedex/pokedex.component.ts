import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { PokedexCardComponent } from '../../components/pokedex-card/pokedex-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TypeFilterComponent } from '../../components/type-filter/type-filter.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    PokedexCardComponent,
    SearchBarComponent,
    TypeFilterComponent,
    PaginationComponent,
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  searchResults: Pokemon[] | null = null;
  pokemonTypes: string[] = [];
  selectedType: string | null = null;
  loading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 20;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonTypes();
    this.loadPokemonList();
  }

  async loadPokemonList(): Promise<void> {
    try {
      this.loading = true;
      const offset = (this.currentPage - 1) * this.itemsPerPage;
      this.pokemonList = await this.pokemonService.fetchPokemonList(
        offset,
        this.itemsPerPage
      );
      this.totalPages = Math.ceil(151 / this.itemsPerPage); // Limitando aos 151 Pokémon originais
      this.loading = false;
    } catch (error) {
      console.error('Erro ao carregar lista de Pokémon:', error);
      this.loading = false;
    }
  }

  async loadPokemonTypes(): Promise<void> {
    try {
      this.pokemonTypes = await this.pokemonService.fetchAllPokemonTypes();
    } catch (error) {
      console.error('Erro ao carregar tipos de Pokémon:', error);
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
      console.error('Erro na pesquisa:', error);
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
      console.error('Erro ao filtrar por tipo:', error);
      this.loading = false;
    }
  }

  async onPageChange(page: number): Promise<void> {
    this.currentPage = page;
    await this.loadPokemonList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
