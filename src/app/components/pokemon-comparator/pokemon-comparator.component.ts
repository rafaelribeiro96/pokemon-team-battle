import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-comparator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comparator-container">
      <h2 class="comparator-title">Comparador de Pokémon</h2>

      <div class="pokemon-selectors">
        <div class="pokemon-selector">
          <label for="pokemon1">Primeiro Pokémon</label>
          <select
            id="pokemon1"
            [(ngModel)]="selectedPokemon1Id"
            (change)="loadPokemon(1)"
            [disabled]="loading"
          >
            <option value="">Selecione um Pokémon</option>
            <option *ngFor="let pokemon of pokemonList" [value]="pokemon.id">
              #{{ pokemon.id }} - {{ pokemon.name }}
            </option>
          </select>
        </div>

        <div class="vs-badge">VS</div>

        <div class="pokemon-selector">
          <label for="pokemon2">Segundo Pokémon</label>
          <select
            id="pokemon2"
            [(ngModel)]="selectedPokemon2Id"
            (change)="loadPokemon(2)"
            [disabled]="loading"
          >
            <option value="">Selecione um Pokémon</option>
            <option *ngFor="let pokemon of pokemonList" [value]="pokemon.id">
              #{{ pokemon.id }} - {{ pokemon.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="comparison-results" *ngIf="pokemon1 && pokemon2">
        <div class="pokemon-cards">
          <div class="pokemon-card">
            <img
              [src]="pokemon1.image"
              [alt]="pokemon1.name"
              class="pokemon-image"
            />
            <h3 class="pokemon-name">{{ pokemon1.name }}</h3>
            <div class="pokemon-types">
              <span
                *ngFor="let type of pokemon1.type"
                class="type-badge"
                [class]="type"
              >
                {{ type }}
              </span>
            </div>
          </div>

          <div class="pokemon-card">
            <img
              [src]="pokemon2.image"
              [alt]="pokemon2.name"
              class="pokemon-image"
            />
            <h3 class="pokemon-name">{{ pokemon2.name }}</h3>
            <div class="pokemon-types">
              <span
                *ngFor="let type of pokemon2.type"
                class="type-badge"
                [class]="type"
              >
                {{ type }}
              </span>
            </div>
          </div>
        </div>

        <div class="stats-comparison">
          <h3>Estatísticas</h3>

          <div class="stat-row">
            <div class="stat-label">HP</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon1.stats.hp)"
                ></div>
                <span class="stat-value">{{ pokemon1.stats.hp }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon2.stats.hp)"
                ></div>
                <span class="stat-value">{{ pokemon2.stats.hp }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row">
            <div class="stat-label">Ataque</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon1.stats.attack)"
                ></div>
                <span class="stat-value">{{ pokemon1.stats.attack }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon2.stats.attack)"
                ></div>
                <span class="stat-value">{{ pokemon2.stats.attack }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row">
            <div class="stat-label">Defesa</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon1.stats.defense)"
                ></div>
                <span class="stat-value">{{ pokemon1.stats.defense }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon2.stats.defense)"
                ></div>
                <span class="stat-value">{{ pokemon2.stats.defense }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row">
            <div class="stat-label">Ataque Especial</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="
                    getStatPercentage(pokemon1.stats.specialAttack)
                  "
                ></div>
                <span class="stat-value">{{
                  pokemon1.stats.specialAttack
                }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="
                    getStatPercentage(pokemon2.stats.specialAttack)
                  "
                ></div>
                <span class="stat-value">{{
                  pokemon2.stats.specialAttack
                }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row">
            <div class="stat-label">Defesa Especial</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="
                    getStatPercentage(pokemon1.stats.specialDefense)
                  "
                ></div>
                <span class="stat-value">{{
                  pokemon1.stats.specialDefense
                }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="
                    getStatPercentage(pokemon2.stats.specialDefense)
                  "
                ></div>
                <span class="stat-value">{{
                  pokemon2.stats.specialDefense
                }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row">
            <div class="stat-label">Velocidade</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon1.stats.speed)"
                ></div>
                <span class="stat-value">{{ pokemon1.stats.speed }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="getStatPercentage(pokemon2.stats.speed)"
                ></div>
                <span class="stat-value">{{ pokemon2.stats.speed }}</span>
              </div>
            </div>
          </div>

          <div class="stat-row total">
            <div class="stat-label">Total</div>
            <div class="stat-bars">
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  [style.width.%]="getTotalStatPercentage(pokemon1)"
                ></div>
                <span class="stat-value">{{ getTotalStats(pokemon1) }}</span>
              </div>
              <div class="stat-bar-container reverse">
                <div
                  class="stat-bar"
                  [style.width.%]="getTotalStatPercentage(pokemon2)"
                ></div>
                <span class="stat-value">{{ getTotalStats(pokemon2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="battle-prediction">
          <h3>Previsão de Batalha</h3>
          <div class="prediction-result">
            <div class="winner" *ngIf="getWinner()">
              <p>Vantagem para:</p>
              <div class="winner-badge">
                <img [src]="getWinner()?.image" [alt]="getWinner()?.name" />
                <span>{{ getWinner()?.name }}</span>
              </div>
            </div>
            <div class="tie" *ngIf="!getWinner()">
              <p>Empate!</p>
              <p class="tie-description">
                Os Pokémon estão equilibrados em força
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-message" *ngIf="loading">
        <p>Carregando dados dos Pokémon...</p>
      </div>

      <div class="empty-state" *ngIf="!pokemon1 || !pokemon2">
        <p>Selecione dois Pokémon para compará-los</p>
      </div>
    </div>
  `,
  styles: [
    `
      .comparator-container {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 20px 0;
      }

      .comparator-title {
        text-align: center;
        color: #e3350d;
        margin-bottom: 20px;
        font-size: 1.8rem;
      }

      .pokemon-selectors {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
      }

      .pokemon-selector {
        flex: 1;
        min-width: 200px;

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 16px;

          &:focus {
            outline: none;
            border-color: #e3350d;
            box-shadow: 0 0 0 2px rgba(227, 53, 13, 0.2);
          }
        }
      }

      .vs-badge {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e3350d;
        color: white;
        font-weight: bold;
        font-size: 18px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(227, 53, 13, 0.4);
      }

      .pokemon-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        margin-bottom: 30px;
      }

      .pokemon-card {
        flex: 1;
        min-width: 200px;
        max-width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        border-radius: 10px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

        .pokemon-image {
          width: 120px;
          height: 120px;
          object-fit: contain;
        }

        .pokemon-name {
          margin: 10px 0;
          font-size: 1.2rem;
          text-transform: capitalize;
        }

        .pokemon-types {
          display: flex;
          gap: 8px;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          text-transform: uppercase;
          color: white;
          font-weight: 500;

          &.grass {
            background-color: #78c850;
          }
          &.fire {
            background-color: #f08030;
          }
          &.water {
            background-color: #6890f0;
          }
          &.bug {
            background-color: #a8b820;
          }
          &.normal {
            background-color: #a8a878;
          }
          &.poison {
            background-color: #a040a0;
          }
          &.electric {
            background-color: #f8d030;
          }
          &.ground {
            background-color: #e0c068;
          }
          &.fairy {
            background-color: #ee99ac;
          }
          &.fighting {
            background-color: #c03028;
          }
          &.psychic {
            background-color: #f85888;
          }
          &.rock {
            background-color: #b8a038;
          }
          &.ghost {
            background-color: #705898;
          }
          &.ice {
            background-color: #98d8d8;
          }
          &.dragon {
            background-color: #7038f8;
          }
          &.dark {
            background-color: #705848;
          }
          &.steel {
            background-color: #b8b8d0;
          }
          &.flying {
            background-color: #a890f0;
          }
        }
      }

      .stats-comparison {
        margin-bottom: 30px;

        h3 {
          text-align: center;
          margin-bottom: 15px;
          color: #333;
        }
      }

      .stat-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &.total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-weight: bold;

          .stat-bar {
            background-color: #e3350d;
          }
        }
      }

      .stat-label {
        width: 120px;
        font-size: 14px;
      }

      .stat-bars {
        flex: 1;
        display: flex;
        gap: 10px;
      }

      .stat-bar-container {
        flex: 1;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        position: relative;
        overflow: hidden;

        &.reverse {
          direction: rtl;
        }

        .stat-bar {
          height: 100%;
          background-color: #3d7dca;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .stat-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 500;
          color: #333;
        }
      }

      .battle-prediction {
        text-align: center;

        h3 {
          margin-bottom: 15px;
          color: #333;
        }
      }

      .prediction-result {
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;

        p {
          margin-bottom: 10px;
        }
      }

      .winner-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        span {
          font-size: 18px;
          font-weight: bold;
          text-transform: capitalize;
        }
      }

      .tie-description {
        font-style: italic;
        color: #666;
      }

      .loading-message,
      .empty-state {
        text-align: center;
        padding: 30px;
        color: #666;
      }
    `,
  ],
})
export class PokemonComparatorComponent {
  pokemonList: { id: number; name: string }[] = [];
  selectedPokemon1Id: number | string = '';
  selectedPokemon2Id: number | string = '';
  pokemon1: PokemonDetail | null = null;
  pokemon2: PokemonDetail | null = null;
  loading: boolean = false;

  constructor(private pokemonService: PokemonService) {
    this.loadPokemonList();
  }

  async loadPokemonList(): Promise<void> {
    try {
      // Carregar uma lista de Pokémon para os seletores
      const pokemonList = await this.pokemonService.fetchPokemonList(0, 151);
      this.pokemonList = pokemonList.map((p) => ({ id: p.id, name: p.name }));
    } catch (error) {
      console.error('Erro ao carregar lista de Pokémon:', error);
    }
  }

  async loadPokemon(pokemonNumber: number): Promise<void> {
    const id =
      pokemonNumber === 1 ? this.selectedPokemon1Id : this.selectedPokemon2Id;

    if (!id) return;

    this.loading = true;

    try {
      const pokemon = await this.pokemonService.fetchPokemonById(Number(id));

      if (pokemonNumber === 1) {
        this.pokemon1 = pokemon;
      } else {
        this.pokemon2 = pokemon;
      }
    } catch (error) {
      console.error(`Erro ao carregar Pokémon ${id}:`, error);
    } finally {
      this.loading = false;
    }
  }

  getStatPercentage(value: number): number {
    // Considerando 255 como valor máximo para uma estatística
    return Math.min(100, (value / 255) * 100);
  }

  getTotalStats(pokemon: PokemonDetail): number {
    return (
      pokemon.stats.hp +
      pokemon.stats.attack +
      pokemon.stats.defense +
      pokemon.stats.specialAttack +
      pokemon.stats.specialDefense +
      pokemon.stats.speed
    );
  }

  getTotalStatPercentage(pokemon: PokemonDetail): number {
    // Considerando 720 como valor máximo para o total (120 por estatística)
    const total = this.getTotalStats(pokemon);
    return Math.min(100, (total / 720) * 100);
  }

  getWinner(): PokemonDetail | null {
    if (!this.pokemon1 || !this.pokemon2) return null;

    const total1 = this.getTotalStats(this.pokemon1);
    const total2 = this.getTotalStats(this.pokemon2);

    // Se a diferença for menor que 5%, consideramos empate
    if (Math.abs(total1 - total2) < total1 * 0.05) return null;

    return total1 > total2 ? this.pokemon1 : this.pokemon2;
  }
}
