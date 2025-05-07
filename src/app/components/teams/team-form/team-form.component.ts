/* team-form.component.ts */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  teamId: number | null = null;
  isEditMode = false;
  pokemonList: any[] = [];
  searchResults: any[] = [];
  isSearching = false;
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      pokemons: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Verificar se estamos no modo de edição
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.teamId = +params['id'];
        this.isEditMode = true;
        this.loadTeamDetails(this.teamId);
      } else {
        // Adicionar pelo menos um slot vazio para Pokémon
        this.addPokemonSlot();
      }
    });
  }

  get pokemonsFormArray() {
    return this.teamForm.get('pokemons') as FormArray;
  }

  loadTeamDetails(teamId: number): void {
    this.isLoading = true;
    this.teamService.getTeamById(teamId).subscribe({
      next: (team) => {
        this.isLoading = false;
        this.teamForm.patchValue({
          name: team.name,
          description: team.description,
        });

        // Limpar o FormArray existente
        while (this.pokemonsFormArray.length) {
          this.pokemonsFormArray.removeAt(0);
        }

        // Adicionar cada Pokémon ao FormArray
        team.pokemons.forEach((pokemon: any) => {
          this.pokemonsFormArray.push(this.createPokemonFormGroup(pokemon));
        });

        // Se o time tiver menos de 6 Pokémon, adicionar slots vazios
        while (this.pokemonsFormArray.length < 6) {
          this.addPokemonSlot();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error.message || 'Erro ao carregar detalhes do time';
      },
    });
  }

  async onSearchInput(event: Event, index: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    await this.searchPokemon(input.value, index);
  }

  createPokemonFormGroup(pokemon: any = null) {
    return this.fb.group({
      id: [pokemon?.id || null],
      name: [pokemon?.name || '', Validators.required],
      image: [pokemon?.image || ''],
      level: [
        pokemon?.level || 50,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      pokemon_id: [pokemon?.pokemon_id || null],
    });
  }

  addPokemonSlot(): void {
    if (this.pokemonsFormArray.length < 6) {
      this.pokemonsFormArray.push(this.createPokemonFormGroup());
    }
  }

  removePokemonSlot(index: number): void {
    this.pokemonsFormArray.removeAt(index);
  }

  async searchPokemon(term: string, index: number): Promise<void> {
    this.searchTerm = term;
    if (!term || term.length < 3) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    try {
      const results = await this.pokemonService.searchPokemon(term);
      this.isSearching = false;
      this.searchResults = results;
    } catch (error) {
      this.isSearching = false;
      this.searchResults = [];
    }
  }

  selectPokemon(pokemon: any, index: number): void {
    const pokemonGroup = this.pokemonsFormArray.at(index);
    pokemonGroup.patchValue({
      name: pokemon.name,
      image: pokemon.image,
      pokemon_id: pokemon.id,
    });
    this.searchResults = [];
    this.searchTerm = '';
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      return;
    }

    // Filtrar slots vazios de Pokémon
    const formValue = { ...this.teamForm.value };
    formValue.pokemons = formValue.pokemons.filter(
      (pokemon: any) => pokemon.name
    );

    this.isSaving = true;
    this.errorMessage = null;

    const saveObservable = this.isEditMode
      ? this.teamService.updateTeam(this.teamId!, formValue)
      : this.teamService.createTeam(formValue);

    saveObservable.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/teams']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.error.message || 'Erro ao salvar time';
      },
    });
  }
}
