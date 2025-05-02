import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokedexCardComponent } from '../../components/pokedex-card/pokedex-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { TypeFilterComponent } from '../../components/type-filter/type-filter.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PokedexCardComponent,
    PaginationComponent,
    TypeFilterComponent,
    SearchBarComponent,
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit {
  pokemonList: any[] = [];
  pokemonTypes: string[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPokemons: number = 0;
  selectedType: string | null = null;
  searchResults: any[] | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonList();
    this.loadPokemonTypes();

    this.pokemonService.pokemonList$.subscribe((pokemons) => {
      this.pokemonList = pokemons;
    });

    this.pokemonService.pokemonTypes$.subscribe((types) => {
      this.pokemonTypes = types;
    });

    this.pokemonService.loading$.subscribe((loading) => {
      this.loading = loading;
    });

    this.pokemonService.totalPokemons$.subscribe((total) => {
      this.totalPokemons = total;
    });
  }

  loadPokemonList(): void {
    const offset = (this.currentPage - 1) * this.itemsPerPage;
    this.pokemonService.fetchPokemonList(offset, this.itemsPerPage);
  }

  loadPokemonTypes(): void {
    this.pokemonService.fetchPokemonTypes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    if (this.selectedType) {
      // Se um tipo estiver selecionado, não fazemos nada aqui
      // pois a API de tipos não suporta paginação
      return;
    }

    if (this.searchResults) {
      // Se estiver mostrando resultados de busca, não fazemos nada
      return;
    }

    this.loadPokemonList();
  }

  onTypeSelect(type: string | null): void {
    this.selectedType = type;
    this.currentPage = 1;
    this.searchResults = null;

    if (type) {
      this.pokemonService.fetchPokemonsByType(type);
    } else {
      this.loadPokemonList();
    }
  }

  onSearch(query: string): void {
    if (!query) {
      this.searchResults = null;
      if (this.selectedType) {
        this.pokemonService.fetchPokemonsByType(this.selectedType);
      } else {
        this.loadPokemonList();
      }
      return;
    }

    this.pokemonService.searchPokemon(query).then((results) => {
      this.searchResults = results;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalPokemons / this.itemsPerPage);
  }
}
