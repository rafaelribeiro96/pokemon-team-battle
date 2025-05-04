/* trainer-avatar-selector.component.ts */
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface TrainerAvatar {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-trainer-avatar-selector',
  standalone: true,
  imports: [CommonModule, PokemonIconComponent],
  templateUrl: './trainer-avatar-selector.component.html',
  styleUrls: ['./trainer-avatar-selector.component.scss'],
})
export class TrainerAvatarSelectorComponent {
  @Output() avatarSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  selectedAvatar: string | null = null;

  availableAvatars: TrainerAvatar[] = [
    {
      id: 'trainer-red',
      name: 'Treinador Vermelho',
      description: 'Treinador da região de Kanto.',
    },
    {
      id: 'trainer-blue',
      name: 'Treinador Azul',
      description: 'Rival do Treinador Vermelho.',
    },
    {
      id: 'trainer-leaf',
      name: 'Treinadora Verde',
      description: 'Treinadora da região de Kanto.',
    },
    {
      id: 'trainer-gold',
      name: 'Treinador Dourado',
      description: 'Treinador da região de Johto.',
    },
    {
      id: 'trainer-silver',
      name: 'Treinador Prateado',
      description: 'Rival do Treinador Dourado.',
    },
    {
      id: 'trainer-crystal',
      name: 'Treinadora Cristal',
      description: 'Treinadora da região de Johto.',
    },
    {
      id: 'trainer-ruby',
      name: 'Treinador Rubi',
      description: 'Treinador da região de Hoenn.',
    },
    {
      id: 'trainer-sapphire',
      name: 'Treinadora Safira',
      description: 'Treinadora da região de Hoenn.',
    },
  ];

  selectAvatar(id: string) {
    this.selectedAvatar = id;
    this.avatarSelected.emit(id);
  }

  cancel() {
    this.cancelled.emit();
  }
}
