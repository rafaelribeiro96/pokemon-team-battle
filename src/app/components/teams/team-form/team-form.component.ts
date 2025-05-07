import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  type FormGroup,
  type FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { PokemonService } from '../../../services/pokemon.service';
import { ImgFallbackDirective } from '../../../directives/fallback-image.directive';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ImgFallbackDirective,
  ],
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
  currentSearchIndex = -1;

  // Novo: Subject para controlar a pesquisa com debounce
  private searchTerms = new Subject<{ term: string; index: number }>();

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
    // Configurar o debounce para a pesquisa
    this.searchTerms
      .pipe(
        debounceTime(300), // Esperar 300ms após o último evento
        distinctUntilChanged(
          (prev, curr) => prev.term === curr.term && prev.index === curr.index
        )
      )
      .subscribe((search) => {
        this.performSearch(search.term, search.index);
      });

    // Verificar se estamos no modo de edição
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.teamId = +params['id'];
        this.isEditMode = true;
        this.loadTeamDetails(this.teamId);
      } else {
        // Iniciar com 6 slots vazios para Pokémon
        for (let i = 0; i < 6; i++) {
          this.addPokemonSlot();
        }
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
        console.log('Time recebido:', team); // Log para debug
        this.isLoading = false;

        // Atualizar os campos básicos do time
        this.teamForm.patchValue({
          name: team.name,
          description: team.description || '', // Garantir que não seja null
        });

        // Limpar o FormArray existente
        while (this.pokemonsFormArray.length) {
          this.pokemonsFormArray.removeAt(0);
        }

        // Adicionar cada Pokémon ao FormArray
        if (team.pokemons && team.pokemons.length > 0) {
          team.pokemons.forEach((pokemon: any) => {
            // Mapear corretamente os campos do Pokémon
            const pokemonData = {
              id: pokemon.id,
              name: pokemon.pokemon_name, // Usar pokemon_name em vez de name
              image: pokemon.pokemon_image,
              level: pokemon.level || 50, // Usar valor padrão se não existir
              pokemon_id: pokemon.pokemon_id,
              imageLoaded: true, // Marcar como carregado para imagens existentes
            };

            console.log('Adicionando Pokémon ao form:', pokemonData); // Log para debug
            const pokemonGroup = this.createPokemonFormGroup(pokemonData);
            this.pokemonsFormArray.push(pokemonGroup);
          });
        }

        // Se o time tiver menos de 6 Pokémon, adicionar slots vazios
        while (this.pokemonsFormArray.length < 6) {
          this.addPokemonSlot();
        }

        // Forçar detecção de mudanças
        this.teamForm.updateValueAndValidity();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao carregar time:', error);
        this.errorMessage =
          error.error?.message || 'Erro ao carregar detalhes do time';
      },
    });
  }

  onSearchInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.currentSearchIndex = index;

    // Enviar o termo para o Subject com debounce
    this.searchTerms.next({ term: this.searchTerm, index });
  }

  // Novo método para realizar a pesquisa após o debounce
  async performSearch(term: string, index: number): Promise<void> {
    if (!term || term.length < 3) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    try {
      // Buscar apenas os dados básicos dos Pokémon (sem imagens)
      const results = await this.pokemonService.searchPokemon(term);
      this.isSearching = false;
      this.searchResults = results;
    } catch (error) {
      this.isSearching = false;
      this.searchResults = [];
    }
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
      imageLoaded: [pokemon?.imageLoaded || false],
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

  selectPokemon(pokemon: any, index: number): void {
    const pokemonGroup = this.pokemonsFormArray.at(index);

    // Primeiro, atualizamos apenas o nome e ID do Pokémon
    pokemonGroup.patchValue({
      name: pokemon.name,
      pokemon_id: pokemon.id,
      imageLoaded: false, // Resetar o estado de carregamento da imagem
    });

    // Limpar os resultados da pesquisa
    this.searchResults = [];
    this.searchTerm = '';

    // Agora, carregamos a imagem separadamente
    this.loadPokemonImage(pokemon.id, index);
  }

  // Novo método para carregar a imagem do Pokémon
  async loadPokemonImage(pokemonId: number, index: number): Promise<void> {
    const pokemonGroup = this.pokemonsFormArray.at(index);

    try {
      // Usar o método getBestPokemonImageUrl para obter a melhor imagem disponível
      this.pokemonService
        .getBestPokemonImageUrl(pokemonId, '')
        .subscribe((imageUrl) => {
          if (imageUrl) {
            pokemonGroup.patchValue({
              image: imageUrl,
            });
          } else {
            // Se não encontrar imagem, usar o fallback
            pokemonGroup.patchValue({
              image: 'assets/images/imagemDefault.png',
              imageLoaded: true,
            });
          }
        });
    } catch (error) {
      console.error('Erro ao carregar imagem do Pokémon:', error);
      pokemonGroup.patchValue({
        image: 'assets/images/imagemDefault.png',
        imageLoaded: true,
      });
    }
  }

  // Método para marcar a imagem como carregada
  onPokemonImageLoad(index: number): void {
    const pokemonGroup = this.pokemonsFormArray.at(index);
    pokemonGroup.patchValue({
      imageLoaded: true,
    });
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      return;
    }

    // Filtrar slots vazios de Pokémon e garantir que todos os campos estejam definidos corretamente
    const formValue = { ...this.teamForm.value };
    formValue.pokemons = formValue.pokemons
      .filter((pokemon: any) => pokemon.name)
      .map((pokemon: any) => ({
        pokemon_id: pokemon.pokemon_id || 0, // Garantir que não seja undefined
        pokemon_name: pokemon.name,
        pokemon_image: pokemon.image || null, // Converter string vazia para null
        position: pokemon.position || null, // Deixar null para usar o índice no backend
      }));

    this.isSaving = true;
    this.errorMessage = null;

    console.log('Enviando dados para o servidor:', formValue);

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
        console.error('Erro detalhado:', error);
        this.errorMessage = error.error?.message || 'Erro ao salvar time';
      },
    });
  }
}
