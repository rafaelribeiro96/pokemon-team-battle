import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import type { Pokemon } from '../../models/pokemon.model';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';
import { CustomIconComponent } from '../custom-icon/custom-icon.component';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';
import { GymSelectorComponent } from '../gym-selector/gym-selector.component';
import { TrainerAvatarSelectorComponent } from '../trainer-avatar-selector/trainer-avatar-selector.component';

@Component({
  standalone: true,
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss'],
  imports: [
    PokemonListComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    PokemonIconComponent,
    CustomIconComponent,
    GymSelectorComponent,
    TrainerAvatarSelectorComponent,
  ],
  animations: [
    trigger('pokemonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'scale(0.5)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(50, [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class TeamBuilderComponent {
  availablePokemons = signal<Pokemon[]>([]);
  team = signal<Pokemon[]>([]);
  @Output() teamChange = new EventEmitter<Pokemon[]>();
  @Output() trainerChange = new EventEmitter<string>();
  @Output() teamNameChange = new EventEmitter<string>();
  @Output() gymChange = new EventEmitter<string>();
  @Input() battleInProgress = false;

  // Novo campo para nome da equipe
  teamName = signal<string>('Minha Equipe');

  // Novo campo para avatar do treinador
  trainerAvatar = signal<string>('trainer-red');

  // Filtro por tipo
  selectedType = signal<string>('all');

  // Tipos de Pokémon disponíveis
  pokemonTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'normal', label: 'Normal' },
    { value: 'fire', label: 'Fogo' },
    { value: 'water', label: 'Água' },
    { value: 'grass', label: 'Planta' },
    { value: 'electric', label: 'Elétrico' },
    { value: 'ice', label: 'Gelo' },
    { value: 'fighting', label: 'Lutador' },
    { value: 'poison', label: 'Venenoso' },
    { value: 'ground', label: 'Terra' },
    { value: 'flying', label: 'Voador' },
    { value: 'psychic', label: 'Psíquico' },
    { value: 'bug', label: 'Inseto' },
    { value: 'rock', label: 'Pedra' },
    { value: 'ghost', label: 'Fantasma' },
    { value: 'dragon', label: 'Dragão' },
    { value: 'dark', label: 'Sombrio' },
    { value: 'steel', label: 'Metálico' },
    { value: 'fairy', label: 'Fada' },
  ];

  // Controle de modais
  showGymSelector = signal<boolean>(false);
  showTrainerSelector = signal<boolean>(false);
  showTeamNameInput = signal<boolean>(false);

  // Ginásio selecionado
  selectedGym = signal<string>('');

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) {
    this.pokemonService.fetchPokemons().then(() => {
      const pokemons = this.pokemonService.pokemons().map((pokemon) => ({
        ...pokemon,
        stats: { ...pokemon.stats, maxHp: pokemon.stats.hp },
      }));
      this.availablePokemons.set(pokemons);
    });
  }

  // Método para obter a classe de tipo para o background do time
  getTeamBackgroundClass(): string {
    const team = this.team();
    if (team.length === 0) return '';

    // Se o time tiver apenas um Pokémon, use o tipo dele
    if (team.length === 1) {
      return `type-${team[0].type[0]}`;
    }

    // Se o time tiver vários Pokémon com tipos diferentes, use 'mixed'
    const types = new Set<string>();
    team.forEach((pokemon) => {
      if (pokemon.type && pokemon.type.length > 0) {
        types.add(pokemon.type[0]);
      }
    });

    return types.size > 1 ? 'type-mixed' : `type-${Array.from(types)[0]}`;
  }

  // Método para obter a classe de tipo para um Pokémon específico
  getPokemonTypeClass(pokemon: Pokemon): string {
    if (!pokemon.type || pokemon.type.length === 0) return '';
    return `type-${pokemon.type[0]}`;
  }

  // Método para calcular a força total do time
  getTeamStrength(): number {
    const team = this.team();
    if (team.length === 0) return 0;

    let totalStats = 0;
    team.forEach((pokemon) => {
      totalStats +=
        pokemon.stats.hp +
        pokemon.stats.attack +
        pokemon.stats.defense +
        pokemon.stats.speed +
        (pokemon.stats.specialAttack || 0) +
        (pokemon.stats.specialDefense || 0);
    });

    return Math.floor(totalStats / team.length);
  }

  // Método para obter a classe de força do time
  getTeamStrengthClass(): string {
    const strength = this.getTeamStrength();

    if (strength >= 500) return 'strength-excellent';
    if (strength >= 400) return 'strength-great';
    if (strength >= 300) return 'strength-good';
    if (strength >= 200) return 'strength-average';
    return 'strength-weak';
  }

  // Método para obter o texto de força do time
  getTeamStrengthText(): string {
    const strength = this.getTeamStrength();

    if (strength >= 500) return 'Excelente';
    if (strength >= 400) return 'Ótimo';
    if (strength >= 300) return 'Bom';
    if (strength >= 200) return 'Médio';
    return 'Fraco';
  }

  // Método para filtrar Pokémon por tipo
  getFilteredPokemons(): Pokemon[] {
    const type = this.selectedType();
    if (type === 'all') {
      return this.availablePokemons();
    }

    return this.availablePokemons().filter(
      (pokemon) => pokemon.type && pokemon.type.includes(type)
    );
  }

  addPokemonToTeam(pokemon: Pokemon) {
    if (this.team().length < 6 && !this.team().includes(pokemon)) {
      // Criar uma cópia do Pokémon para evitar referências compartilhadas
      const pokemonCopy = { ...pokemon };

      // Adicionar ao time
      const updatedTeam = [...this.team(), pokemonCopy];
      this.team.set(updatedTeam);

      // Emitir a mudança
      this.emitTeamChange();

      // Atualizar a lista de disponíveis
      this.availablePokemons.set(
        this.availablePokemons().filter((p) => p.id !== pokemon.id)
      );

      // Forçar detecção de mudanças
      this.cdr.detectChanges();
    }
  }

  removePokemonFromTeam(pokemon: Pokemon) {
    this.team.set(this.team().filter((p) => p.id !== pokemon.id));
    this.emitTeamChange();

    // Adicionar o Pokémon de volta à lista de disponíveis
    const pokemonToAdd = { ...pokemon };
    this.availablePokemons.set([...this.availablePokemons(), pokemonToAdd]);

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  addRandomToTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

    if (availablePokemons.length === 0) return;

    const randomPokemons: Pokemon[] = [];
    for (let i = 0; i < remainingSlots && availablePokemons.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      const randomPokemon = { ...availablePokemons[randomIndex] };
      randomPokemons.push(randomPokemon);
      availablePokemons.splice(randomIndex, 1);
    }

    this.team.set([...this.team(), ...randomPokemons]);
    this.emitTeamChange();

    // Atualizar a lista de disponíveis
    this.availablePokemons.set(
      this.availablePokemons().filter(
        (p) => !randomPokemons.some((rp) => rp.id === p.id)
      )
    );

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  autoCompleteTeam() {
    const remainingSlots = 6 - this.team().length;
    const availablePokemons = this.getAvailablePokemonsForTeam();

    const randomPokemons: Pokemon[] = [];

    while (
      randomPokemons.length < remainingSlots &&
      availablePokemons.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      const randomPokemon = availablePokemons.splice(randomIndex, 1)[0];
      randomPokemons.push({ ...randomPokemon });
    }

    this.team.set([...this.team(), ...randomPokemons]);
    this.emitTeamChange();

    // Atualizar a lista de disponíveis
    this.availablePokemons.set(
      this.availablePokemons().filter(
        (p) => !randomPokemons.some((rp) => rp.id === p.id)
      )
    );

    // Forçar detecção de mudanças
    this.cdr.detectChanges();
  }

  // Métodos para controle de modais
  openGymSelector() {
    this.showGymSelector.set(true);
  }

  closeGymSelector() {
    this.showGymSelector.set(false);
  }

  selectGym(gymId: string) {
    this.selectedGym.set(gymId);
    this.gymChange.emit(gymId);
    this.showGymSelector.set(false);
  }

  openTrainerSelector() {
    this.showTrainerSelector.set(true);
  }

  closeTrainerSelector() {
    this.showTrainerSelector.set(false);
  }

  selectTrainer(avatarId: string) {
    this.trainerAvatar.set(avatarId);
    this.trainerChange.emit(avatarId);
    this.showTrainerSelector.set(false);
  }

  openTeamNameInput() {
    this.showTeamNameInput.set(true);
  }

  closeTeamNameInput() {
    this.showTeamNameInput.set(false);
  }

  saveTeamName(name: string) {
    if (name.trim()) {
      this.teamName.set(name);
      this.teamNameChange.emit(name);
    }
    this.showTeamNameInput.set(false);
  }

  private getAvailablePokemonsForTeam(): Pokemon[] {
    return this.availablePokemons().filter(
      (pokemon) => !this.team().includes(pokemon)
    );
  }

  private emitTeamChange() {
    this.teamChange.emit(this.team());
  }

  updateTeamPokemon(updatedPokemon: Pokemon) {
    const index = this.team().findIndex((p) => p.id === updatedPokemon.id);
    if (index !== -1) {
      const updatedTeam = [...this.team()];
      updatedTeam[index] = { ...updatedPokemon };
      this.team.set(updatedTeam);
      this.cdr.detectChanges();
    }
  }
}
