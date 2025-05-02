import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface Gym {
  id: string;
  name: string;
  type: string;
  leader: string;
}

@Component({
  selector: 'app-gym-selector',
  standalone: true,
  imports: [CommonModule, PokemonIconsModule, PokemonIconComponent],
  template: `
    <div class="gym-selector">
      <h3>Escolha um Ginásio</h3>

      <div class="gyms-grid">
        <div
          *ngFor="let gym of availableGyms"
          class="gym-item"
          [class.selected]="selectedGym === gym.id"
          (click)="selectGym(gym.id)"
        >
          <app-pokemon-icon [iconId]="gym.id" size="lg"></app-pokemon-icon>
          <div class="gym-info">
            <div class="gym-name">{{ gym.name }}</div>
            <div class="gym-type">
              <app-pokemon-icon
                [iconId]="gym.type + '-type'"
                size="xs"
              ></app-pokemon-icon>
              {{ gym.type }}
            </div>
            <div class="gym-leader">Líder: {{ gym.leader }}</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="cancel-btn" (click)="cancel()">Cancelar</button>
        <button
          class="confirm-btn"
          (click)="confirmSelection()"
          [disabled]="!selectedGym"
        >
          <app-pokemon-icon iconId="badge" size="sm"></app-pokemon-icon>
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .gym-selector {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        margin: 0 auto;

        h3 {
          text-align: center;
          color: #3b4cca;
          margin-bottom: 20px;
        }

        .gyms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 15px;
          margin-bottom: 20px;

          .gym-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #eee;

            &:hover {
              background-color: rgba(59, 76, 202, 0.1);
              transform: translateY(-5px);
            }

            &.selected {
              background-color: rgba(59, 76, 202, 0.2);
              border: 2px solid #3b4cca;
              transform: scale(1.05);
            }

            .gym-info {
              margin-top: 10px;
              text-align: center;

              .gym-name {
                font-weight: bold;
                font-size: 1.1rem;
                margin-bottom: 5px;
              }

              .gym-type {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                margin-bottom: 5px;
                font-size: 0.9rem;
                color: #666;
              }

              .gym-leader {
                font-size: 0.9rem;
                color: #666;
              }
            }
          }
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 15px;

          button {
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover:not(:disabled) {
              transform: translateY(-2px);
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          }

          .cancel-btn {
            background-color: #f5f5f5;
            color: #333;

            &:hover {
              background-color: #e0e0e0;
            }
          }

          .confirm-btn {
            background-color: #3b4cca;
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;

            &:hover:not(:disabled) {
              background-color: #2a3ba9;
            }
          }
        }
      }
    `,
  ],
})
export class GymSelectorComponent {
  @Output() gymSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  selectedGym: string | null = null;

  availableGyms: Gym[] = [
    {
      id: 'fire-gym',
      name: 'Ginásio de Cinnabar',
      type: 'fire',
      leader: 'Blaine',
    },
    {
      id: 'water-gym',
      name: 'Ginásio de Cerulean',
      type: 'water',
      leader: 'Misty',
    },
    {
      id: 'electric-gym',
      name: 'Ginásio de Vermilion',
      type: 'electric',
      leader: 'Lt. Surge',
    },
    {
      id: 'grass-gym',
      name: 'Ginásio de Celadon',
      type: 'grass',
      leader: 'Erika',
    },
    {
      id: 'psychic-gym',
      name: 'Ginásio de Saffron',
      type: 'psychic',
      leader: 'Sabrina',
    },
    {
      id: 'rock-gym',
      name: 'Ginásio de Pewter',
      type: 'rock',
      leader: 'Brock',
    },
  ];

  selectGym(id: string) {
    this.selectedGym = id;
  }

  confirmSelection() {
    if (this.selectedGym) {
      this.gymSelected.emit(this.selectedGym);
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
