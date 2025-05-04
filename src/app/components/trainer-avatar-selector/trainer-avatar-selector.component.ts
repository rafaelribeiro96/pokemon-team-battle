/* trainer-avatar-selector.component.ts */
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface TrainerAvatar {
  id: string;
  name: string;
}

@Component({
  selector: 'app-trainer-avatar-selector',
  standalone: true,
  imports: [CommonModule, PokemonIconsModule, PokemonIconComponent],
  template: `
    <div class="trainer-avatar-selector">
      <h3>Escolha seu Treinador</h3>

      <div class="avatars-grid">
        <div
          *ngFor="let avatar of availableAvatars"
          class="avatar-item"
          [class.selected]="selectedAvatar === avatar.id"
          (click)="selectAvatar(avatar.id)"
        >
          <app-pokemon-icon [iconId]="avatar.id" size="lg"></app-pokemon-icon>
          <div class="avatar-name">{{ avatar.name }}</div>
        </div>
      </div>

      <div class="actions">
        <button
          class="confirm-btn"
          (click)="confirmSelection()"
          [disabled]="!selectedAvatar"
        >
          <app-pokemon-icon iconId="pokeball" size="sm"></app-pokemon-icon>
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .trainer-avatar-selector {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        margin: 0 auto;

        h3 {
          text-align: center;
          color: #3b4cca;
          margin-bottom: 20px;
        }

        .avatars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 15px;
          margin-bottom: 20px;

          .avatar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background-color: rgba(59, 76, 202, 0.1);
              transform: translateY(-5px);
            }

            &.selected {
              background-color: rgba(59, 76, 202, 0.2);
              border: 2px solid #3b4cca;
              transform: scale(1.05);
            }

            .avatar-name {
              margin-top: 8px;
              font-size: 0.9rem;
              text-align: center;
            }
          }
        }

        .actions {
          display: flex;
          justify-content: center;

          .confirm-btn {
            background-color: #3b4cca;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;

            &:hover:not(:disabled) {
              background-color: #2a3ba9;
              transform: translateY(-2px);
            }

            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          }
        }
      }
    `,
  ],
})
export class TrainerAvatarSelectorComponent {
  @Output() avatarSelected = new EventEmitter<string>();

  selectedAvatar: string | null = null;

  availableAvatars: TrainerAvatar[] = [
    { id: 'trainer-red', name: 'Red' },
    { id: 'trainer-blue', name: 'Blue' },
    { id: 'trainer-leaf', name: 'Leaf' },
    { id: 'trainer-gold', name: 'Gold' },
    { id: 'trainer-crystal', name: 'Crystal' },
    { id: 'trainer-may', name: 'May' },
    { id: 'trainer-brendan', name: 'Brendan' },
    { id: 'trainer-dawn', name: 'Dawn' },
  ];

  selectAvatar(id: string) {
    this.selectedAvatar = id;
  }

  confirmSelection() {
    if (this.selectedAvatar) {
      this.avatarSelected.emit(this.selectedAvatar);
    }
  }
}
