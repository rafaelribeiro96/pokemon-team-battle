import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';

interface QuizQuestion {
  type: 'silhouette' | 'type' | 'ability' | 'evolution';
  pokemon: Pokemon;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

@Component({
  selector: 'app-pokemon-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quiz-container">
      <div class="quiz-header">
        <h2>Quiz Pokémon</h2>
        <div class="quiz-stats">
          <span class="score">Pontuação: {{ score }}/{{ totalQuestions }}</span>
          <span class="question-counter"
            >Questão {{ currentQuestionIndex + 1 }} de
            {{ totalQuestions }}</span
          >
        </div>
      </div>

      <div class="quiz-content" *ngIf="!quizCompleted && currentQuestion">
        <div class="question-container" [ngClass]="currentQuestion.type">
          <div class="question-prompt">
            <ng-container [ngSwitch]="currentQuestion.type">
              <ng-container *ngSwitchCase="'silhouette'">
                <h3>Quem é esse Pokémon?</h3>
                <div class="silhouette-container">
                  <img
                    [src]="currentQuestion.pokemon.image"
                    class="pokemon-silhouette"
                    alt="Silhueta de Pokémon"
                  />
                </div>
              </ng-container>

              <ng-container *ngSwitchCase="'type'">
                <h3>
                  Qual é o tipo principal do {{ currentQuestion.pokemon.name }}?
                </h3>
                <img
                  [src]="currentQuestion.pokemon.image"
                  class="pokemon-image"
                  [alt]="currentQuestion.pokemon.name"
                />
              </ng-container>

              <ng-container *ngSwitchCase="'ability'">
                <h3>
                  Qual dessas é uma habilidade do
                  {{ currentQuestion.pokemon.name }}?
                </h3>
                <img
                  [src]="currentQuestion.pokemon.image"
                  class="pokemon-image"
                  [alt]="currentQuestion.pokemon.name"
                />
              </ng-container>

              <ng-container *ngSwitchCase="'evolution'">
                <h3>
                  {{ currentQuestion.pokemon.name }} evolui para qual Pokémon?
                </h3>
                <img
                  [src]="currentQuestion.pokemon.image"
                  class="pokemon-image"
                  [alt]="currentQuestion.pokemon.name"
                />
              </ng-container>
            </ng-container>
          </div>

          <div class="options-container">
            <button
              *ngFor="let option of currentQuestion.options"
              class="option-button"
              [class.selected]="currentQuestion.userAnswer === option"
              [class.correct]="
                showAnswers && option === currentQuestion.correctAnswer
              "
              [class.incorrect]="
                showAnswers &&
                currentQuestion.userAnswer === option &&
                option !== currentQuestion.correctAnswer
              "
              [disabled]="showAnswers"
              (click)="selectAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="quiz-actions">
          <button
            *ngIf="!showAnswers"
            class="submit-button"
            [disabled]="!currentQuestion.userAnswer"
            (click)="submitAnswer()"
          >
            Confirmar Resposta
          </button>

          <div *ngIf="showAnswers" class="answer-feedback">
            <div
              class="feedback-message"
              [class.correct]="
                currentQuestion.userAnswer === currentQuestion.correctAnswer
              "
              [class.incorrect]="
                currentQuestion.userAnswer !== currentQuestion.correctAnswer
              "
            >
              <span
                *ngIf="
                  currentQuestion.userAnswer === currentQuestion.correctAnswer
                "
              >
                Correto! 🎉
              </span>
              <span
                *ngIf="
                  currentQuestion.userAnswer !== currentQuestion.correctAnswer
                "
              >
                Incorreto! A resposta correta é:
                {{ currentQuestion.correctAnswer }}
              </span>
            </div>

            <button class="next-button" (click)="nextQuestion()">
              Próxima Questão
            </button>
          </div>
        </div>
      </div>

      <div class="quiz-results" *ngIf="quizCompleted">
        <h3>Quiz Completo!</h3>

        <div class="results-summary">
          <div class="final-score">
            <span class="score-value">{{ score }}</span>
            <span class="score-total">/ {{ totalQuestions }}</span>
          </div>

          <div class="score-percentage">
            {{ (score / totalQuestions) * 100 }}% de acertos
          </div>

          <div class="score-message">
            <ng-container *ngIf="score / totalQuestions >= 0.8">
              Parabéns! Você é um verdadeiro Mestre Pokémon! 🏆
            </ng-container>
            <ng-container
              *ngIf="
                score / totalQuestions >= 0.6 && score / totalQuestions < 0.8
              "
            >
              Muito bom! Você conhece bastante sobre Pokémon! 🌟
            </ng-container>
            <ng-container
              *ngIf="
                score / totalQuestions >= 0.4 && score / totalQuestions < 0.6
              "
            >
              Bom trabalho! Continue treinando seus conhecimentos! 📚
            </ng-container>
            <ng-container *ngIf="score / totalQuestions < 0.4">
              Continue tentando! Todo treinador começa em algum lugar! 🌱
            </ng-container>
          </div>
        </div>

        <button class="restart-button" (click)="restartQuiz()">
          Jogar Novamente
        </button>
      </div>

      <div class="loading-message" *ngIf="loading">
        <p>Carregando quiz...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .quiz-container {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 20px 0;
      }

      .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 10px;

        h2 {
          color: #e3350d;
          margin: 0;
        }
      }

      .quiz-stats {
        display: flex;
        gap: 15px;

        .score {
          font-weight: bold;
          color: #3d7dca;
        }

        .question-counter {
          color: #666;
        }
      }

      .question-container {
        background-color: #f9f9f9;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;

        &.silhouette {
          background-color: #3d7dca;

          h3 {
            color: white;
          }
        }

        &.type {
          background-color: #78c850;

          h3 {
            color: white;
          }
        }

        &.ability {
          background-color: #f08030;

          h3 {
            color: white;
          }
        }

        &.evolution {
          background-color: #a040a0;

          h3 {
            color: white;
          }
        }
      }

      .question-prompt {
        text-align: center;
        margin-bottom: 20px;

        h3 {
          margin-bottom: 15px;
        }
      }

      .silhouette-container {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        position: relative;

        .pokemon-silhouette {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0);
        }
      }

      .pokemon-image {
        width: 150px;
        height: 150px;
        object-fit: contain;
      }

      .options-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
      }

      .option-button {
        padding: 12px;
        border-radius: 8px;
        border: 2px solid #ddd;
        background-color: white;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: capitalize;

        &:hover:not(:disabled) {
          border-color: #3d7dca;
          transform: translateY(-2px);
        }

        &.selected {
          border-color: #3d7dca;
          background-color: #e8f0f8;
        }

        &.correct {
          border-color: #78c850;
          background-color: #e8f8e8;
        }

        &.incorrect {
          border-color: #e3350d;
          background-color: #f8e8e8;
        }

        &:disabled {
          cursor: default;
        }
      }

      .quiz-actions {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }

      .submit-button,
      .next-button,
      .restart-button {
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        background-color: #e3350d;
        color: white;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background-color: darken(#e3350d, 10%);
          transform: translateY(-2px);
        }

        &:disabled {
          background-color: #ccc;
          cursor: default;
        }
      }

      .answer-feedback {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
      }

      .feedback-message {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;

        &.correct {
          background-color: #e8f8e8;
          color: #2e7d32;
        }

        &.incorrect {
          background-color: #f8e8e8;
          color: #c62828;
        }
      }

      .quiz-results {
        text-align: center;
        padding: 20px;

        h3 {
          color: #e3350d;
          font-size: 1.8rem;
          margin-bottom: 20px;
        }
      }

      .results-summary {
        margin-bottom: 30px;
      }

      .final-score {
        font-size: 3rem;
        margin-bottom: 10px;

        .score-value {
          color: #3d7dca;
          font-weight: bold;
        }

        .score-total {
          color: #666;
        }
      }

      .score-percentage {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 15px;
      }

      .score-message {
        font-size: 1.2rem;
        color: #e3350d;
        font-weight: 500;
      }

      .loading-message {
        text-align: center;
        padding: 30px;
        color: #666;
      }
    `,
  ],
})
export class PokemonQuizComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: QuizQuestion | null = null;
  score: number = 0;
  totalQuestions: number = 10;
  showAnswers: boolean = false;
  quizCompleted: boolean = false;
  loading: boolean = true;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.initializeQuiz();
  }

  async initializeQuiz(): Promise<void> {
    this.loading = true;

    try {
      // Carregar Pokémon para o quiz
      const pokemonList = await this.pokemonService.fetchPokemonList(0, 151);

      // Criar perguntas do quiz
      await this.generateQuestions(pokemonList);

      // Iniciar com a primeira pergunta
      this.currentQuestion = this.questions[0];
      this.loading = false;
    } catch (error) {
      console.error('Erro ao inicializar quiz:', error);
      this.loading = false;
    }
  }

  async generateQuestions(pokemonList: Pokemon[]): Promise<void> {
    this.questions = [];

    // Embaralhar a lista de Pokémon
    const shuffledPokemon = [...pokemonList].sort(() => Math.random() - 0.5);

    // Criar perguntas de diferentes tipos
    for (let i = 0; i < this.totalQuestions; i++) {
      const questionType = this.getRandomQuestionType();
      const pokemon = shuffledPokemon[i];

      let question: QuizQuestion;

      switch (questionType) {
        case 'silhouette':
          question = await this.createSilhouetteQuestion(
            pokemon,
            shuffledPokemon
          );
          break;
        case 'type':
          question = this.createTypeQuestion(pokemon);
          break;
        case 'ability':
          question = await this.createAbilityQuestion(pokemon, shuffledPokemon);
          break;
        case 'evolution':
          question = await this.createEvolutionQuestion(
            pokemon,
            shuffledPokemon
          );
          break;
        default:
          question = await this.createSilhouetteQuestion(
            pokemon,
            shuffledPokemon
          );
      }

      this.questions.push(question);
    }
  }

  getRandomQuestionType(): 'silhouette' | 'type' | 'ability' | 'evolution' {
    const types: ('silhouette' | 'type' | 'ability' | 'evolution')[] = [
      'silhouette',
      'type',
      'ability',
      'evolution',
    ];

    return types[Math.floor(Math.random() * types.length)];
  }

  async createSilhouetteQuestion(
    pokemon: Pokemon,
    allPokemon: Pokemon[]
  ): Promise<QuizQuestion> {
    // Criar opções (nomes de Pokémon)
    const correctAnswer = pokemon.name;
    const options = this.getRandomOptions(
      correctAnswer,
      allPokemon.map((p) => p.name)
    );

    return {
      type: 'silhouette',
      pokemon,
      options,
      correctAnswer,
    };
  }

  createTypeQuestion(pokemon: Pokemon): QuizQuestion {
    const allTypes = [
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
      'ice',
      'fighting',
      'poison',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy',
    ];

    const correctAnswer = pokemon.type[0]; // Tipo principal
    const options = this.getRandomOptions(correctAnswer, allTypes);

    return {
      type: 'type',
      pokemon,
      options,
      correctAnswer,
    };
  }

  async createAbilityQuestion(
    pokemon: Pokemon,
    allPokemon: Pokemon[]
  ): Promise<QuizQuestion> {
    // Buscar detalhes do Pokémon para obter habilidades
    const pokemonDetail = await this.pokemonService.fetchPokemonById(
      pokemon.id
    );

    // Se não tiver habilidades, criar uma pergunta de silhueta
    if (!pokemonDetail.abilities || pokemonDetail.abilities.length === 0) {
      return this.createSilhouetteQuestion(pokemon, allPokemon);
    }

    const correctAnswer = pokemonDetail.abilities[0];

    // Criar lista de todas as habilidades possíveis
    const allAbilities: string[] = [];
    for (const p of allPokemon.slice(0, 20)) {
      try {
        const detail = await this.pokemonService.fetchPokemonById(p.id);
        if (detail.abilities) {
          allAbilities.push(...detail.abilities);
        }
      } catch (error) {
        console.error(`Erro ao buscar habilidades do Pokémon ${p.id}:`, error);
      }
    }

    // Remover duplicatas
    const uniqueAbilities = [...new Set(allAbilities)];

    const options = this.getRandomOptions(correctAnswer, uniqueAbilities);

    return {
      type: 'ability',
      pokemon,
      options,
      correctAnswer,
    };
  }

  async createEvolutionQuestion(
    pokemon: Pokemon,
    allPokemon: Pokemon[]
  ): Promise<QuizQuestion> {
    try {
      // Buscar cadeia de evolução
      const evolutionChain = await this.pokemonService.fetchEvolutionChain(
        pokemon.id
      );

      // Se não tiver evolução ou for o último da cadeia, criar uma pergunta de silhueta
      const pokemonIndex = evolutionChain.findIndex((p) => p.id === pokemon.id);
      if (pokemonIndex === -1 || pokemonIndex === evolutionChain.length - 1) {
        return this.createSilhouetteQuestion(pokemon, allPokemon);
      }

      const correctAnswer = evolutionChain[pokemonIndex + 1].name;
      const options = this.getRandomOptions(
        correctAnswer,
        allPokemon.map((p) => p.name)
      );

      return {
        type: 'evolution',
        pokemon,
        options,
        correctAnswer,
      };
    } catch (error) {
      console.error(`Erro ao buscar evolução do Pokémon ${pokemon.id}:`, error);
      return this.createSilhouetteQuestion(pokemon, allPokemon);
    }
  }

  getRandomOptions(correctAnswer: string, allOptions: string[]): string[] {
    // Filtrar opções para remover a resposta correta
    const filteredOptions = allOptions.filter(
      (option) => option !== correctAnswer
    );

    // Embaralhar e pegar 3 opções aleatórias
    const randomOptions = filteredOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Adicionar a resposta correta e embaralhar novamente
    return [...randomOptions, correctAnswer].sort(() => Math.random() - 0.5);
  }

  selectAnswer(option: string): void {
    if (this.currentQuestion && !this.showAnswers) {
      this.currentQuestion.userAnswer = option;
    }
  }

  submitAnswer(): void {
    if (!this.currentQuestion || !this.currentQuestion.userAnswer) return;

    this.showAnswers = true;

    // Verificar se a resposta está correta
    if (
      this.currentQuestion.userAnswer === this.currentQuestion.correctAnswer
    ) {
      this.score++;
    }
  }

  nextQuestion(): void {
    this.showAnswers = false;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    } else {
      this.quizCompleted = true;
    }
  }

  restartQuiz(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.showAnswers = false;
    this.quizCompleted = false;
    this.initializeQuiz();
  }
}
