import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PokemonIconsService,
  PokemonIcon,
} from '../../services/pokemon-icons.service';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

@Component({
  selector: 'app-pokemon-icon-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonIconComponent],
  template: `
    <div class="pokemon-icon-selector">
      <div class="search-controls">
        <div class="search-input">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Buscar ícone..."
            class="form-control"
          />
        </div>

        <div class="category-filter">
          <select
            [(ngModel)]="selectedCategory"
            (change)="onCategoryChange()"
            class="form-control"
          >
            <option value="all">Todas as categorias</option>
            <option value="pokemon">Pokémon</option>
            <option value="item">Itens</option>
            <option value="interface">Interface</option>
            <option value="type">Tipos</option>
            <option value="other">Outros</option>
          </select>
        </div>
      </div>

      <div class="icons-container">
        <div class="no-results" *ngIf="filteredIcons.length === 0">
          Nenhum ícone encontrado com os filtros atuais.
        </div>

        <div class="icon-grid">
          <div
            *ngFor="let icon of filteredIcons"
            class="icon-item"
            [class.selected]="isSelected(icon)"
            (click)="selectIcon(icon)"
          >
            <app-pokemon-icon
              [iconId]="icon.id"
              size="lg"
              [clickable]="true"
            ></app-pokemon-icon>
            <div class="icon-name">{{ icon.name }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pokemon-icon-selector {
        width: 100%;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
      }

      .search-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;

        @media (max-width: 768px) {
          flex-direction: column;
        }

        .search-input,
        .category-filter {
          flex: 1;

          input,
          select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;

            &:focus {
              outline: none;
              border-color: #3b4cca;
            }
          }
        }
      }

      .icons-container {
        .no-results {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;

          .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background-color: rgba(59, 76, 202, 0.1);
            }

            &.selected {
              background-color: rgba(59, 76, 202, 0.2);
            }

            .icon-name {
              margin-top: 5px;
              font-size: 12px;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 100%;
            }
          }
        }
      }
    `,
  ],
})
export class PokemonIconSelectorComponent implements OnInit {
  @Input() selectedIconId?: string;
  @Output() iconSelected = new EventEmitter<PokemonIcon>();

  allIcons: PokemonIcon[] = [];
  filteredIcons: PokemonIcon[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';

  constructor(private pokemonIconsService: PokemonIconsService) {}

  ngOnInit(): void {
    this.allIcons = this.pokemonIconsService.getAllIcons();
    this.filteredIcons = [...this.allIcons];
  }

  filterIcons(): void {
    // Primeiro filtra por categoria se selecionada
    let result = this.allIcons;

    if (this.selectedCategory && this.selectedCategory !== 'all') {
      result = this.pokemonIconsService.getIconsByCategory(
        this.selectedCategory as
          | 'pokemon'
          | 'item'
          | 'interface'
          | 'type'
          | 'other'
      );
    }

    // Depois filtra pelo termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (icon) =>
          icon.name.toLowerCase().includes(term) ||
          icon.id.toLowerCase().includes(term) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    this.filteredIcons = result;
  }

  onSearch(): void {
    this.filterIcons();
  }

  onCategoryChange(): void {
    this.filterIcons();
  }

  selectIcon(icon: PokemonIcon): void {
    this.selectedIconId = icon.id;
    this.iconSelected.emit(icon);
  }

  isSelected(icon: PokemonIcon): boolean {
    return this.selectedIconId === icon.id;
  }
}
