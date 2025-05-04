import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface Gym {
  id: string;
  name: string;
  type: string;
  leader: string;
  description?: string;
}

@Component({
  selector: 'app-gym-selector',
  standalone: true,
  imports: [CommonModule, PokemonIconComponent],
  templateUrl: './gym-selector.component.html',
  styleUrls: ['./gym-selector.component.scss'],
})
export class GymSelectorComponent {
  @Input() selectedGymId: string | null = null;
  @Output() gymSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  selectedGym: string | null = null;

  availableGyms: Gym[] = [
    {
      id: 'fire-gym',
      name: 'Ginásio de Cinnabar',
      type: 'fire',
      leader: 'Blaine',
      description: 'Especializado em Pokémon do tipo Fogo.',
    },
    {
      id: 'water-gym',
      name: 'Ginásio de Cerulean',
      type: 'water',
      leader: 'Misty',
      description: 'Especializado em Pokémon do tipo Água.',
    },
    {
      id: 'electric-gym',
      name: 'Ginásio de Vermilion',
      type: 'electric',
      leader: 'Lt. Surge',
      description: 'Especializado em Pokémon do tipo Elétrico.',
    },
    {
      id: 'grass-gym',
      name: 'Ginásio de Celadon',
      type: 'grass',
      leader: 'Erika',
      description: 'Especializado em Pokémon do tipo Planta.',
    },
    {
      id: 'psychic-gym',
      name: 'Ginásio de Saffron',
      type: 'psychic',
      leader: 'Sabrina',
      description: 'Especializado em Pokémon do tipo Psíquico.',
    },
    {
      id: 'rock-gym',
      name: 'Ginásio de Pewter',
      type: 'rock',
      leader: 'Brock',
      description: 'Especializado em Pokémon do tipo Pedra.',
    },
    {
      id: 'poison-gym',
      name: 'Ginásio de Fuchsia',
      type: 'poison',
      leader: 'Koga',
      description: 'Especializado em Pokémon do tipo Venenoso.',
    },
    {
      id: 'ground-gym',
      name: 'Ginásio de Viridian',
      type: 'ground',
      leader: 'Giovanni',
      description: 'Especializado em Pokémon do tipo Terra.',
    },
  ];

  ngOnInit() {
    if (this.selectedGymId) {
      this.selectedGym = this.selectedGymId;
    }
  }

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

  getGymById(id: string): Gym | undefined {
    return this.availableGyms.find((gym) => gym.id === id);
  }
}
