import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonProgressBarComponent } from '../pokemon-progress-bar/pokemon-progress-bar.component';

interface QuizQuestion {
  type: 'image' | 'stats' | 'type' | 'ability';
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  pokemonName?: string;
  pokemonId?: number;
  stats?: any;
}

@Component({
  selector: 'app-pokemon-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PokemonProgressBarComponent,
  ],
  template: `
    <div class="quiz-container">
      <div class="quiz-header">
        <h1>Quiz Pokémon</h1>
        <div class="quiz-stats" *ngIf="!loading && !quizCompleted">
          <span class="score">Pontuação: {{ score }}/{{ totalQuestions }}</span>
          <span class="progress"
            >Questão {{ currentQuestionIndex + 1 }} de
            {{ questions.length }}</span
          >
        </div>
      </div>

      <div
        class="quiz-content"
        *ngIf="!loading && !quizCompleted && questions.length > 0"
      >
        <div class="question-container">
          <h2 class="question">{{ currentQuestion.question }}</h2>

          <!-- Questão com imagem -->
          <div class="image-container" *ngIf="currentQuestion.type === 'image'">
            <img
              [src]="currentQuestion.image"
              [alt]="currentQuestion.pokemonName"
              class="pokemon-image"
            />
          </div>

          <!-- Questão com estatísticas -->
          <div class="stats-container" *ngIf="currentQuestion.type === 'stats'">
            <div class="stat-bars">
              <div
                class="stat-item"
                *ngFor="let stat of getStatsArray(currentQuestion.stats)"
              >
                <div class="stat-label">{{ translateStat(stat.name) }}</div>
                <div class="stat-bar-container">
                  <div
                    class="stat-bar"
                    [style.width.%]="getStatPercentage(stat.value)"
                    [ngClass]="stat.name"
                  ></div>
                  <span class="stat-value">{{ stat.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Opções de resposta -->
          <div class="options-container">
            <button
              *ngFor="let option of currentQuestion.options"
              class="option-button"
              [class.selected]="selectedAnswer === option"
              [class.correct]="
                showAnswer && option === currentQuestion.correctAnswer
              "
              [class.incorrect]="
                showAnswer &&
                selectedAnswer === option &&
                option !== currentQuestion.correctAnswer
              "
              [disabled]="showAnswer"
              (click)="selectAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="feedback-container" *ngIf="showAnswer">
          <div
            class="feedback"
            [class.correct]="isCorrect"
            [class.incorrect]="!isCorrect"
          >
            <h3>{{ isCorrect ? 'Correto!' : 'Incorreto!' }}</h3>
            <p>{{ feedbackMessage }}</p>
          </div>
          <button class="next-button" (click)="nextQuestion()">
            {{
              currentQuestionIndex < questions.length - 1
                ? 'Próxima Questão'
                : 'Ver Resultados'
            }}
          </button>
        </div>
      </div>

      <!-- Tela de carregamento -->
      <div class="loading-container" *ngIf="loading">
        <img
          src="/assets/images/pikachu-loading.gif"
          alt="Carregando..."
          class="loading-gif"
        />
        <p>Preparando o quiz...</p>
      </div>

      <!-- Mensagem de erro -->
      <div class="error-container" *ngIf="errorMessage">
        <div class="error-message">
          <h3>Ops! Ocorreu um erro</h3>
          <p>{{ errorMessage }}</p>
          <button class="retry-button" (click)="retryQuiz()">
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Resultados finais -->
      <div class="results-container" *ngIf="quizCompleted">
        <h2>Quiz Completo!</h2>
        <div class="final-score">
          <div class="score-circle">
            <span class="score-number">{{ score }}</span>
            <span class="score-total">/ {{ totalQuestions }}</span>
          </div>
          <p class="score-text">{{ getScoreMessage() }}</p>
        </div>

        <div class="action-buttons">
          <button class="restart-button" (click)="restartQuiz()">
            Jogar Novamente
          </button>
          <button class="home-button" routerLink="/pokedex">
            Voltar para Pokédex
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .quiz-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      .quiz-header {
        text-align: center;
        margin-bottom: 30px;

        h1 {
          color: #e3350d;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
      }

      .quiz-stats {
        display: flex;
        justify-content: space-between;
        background-color: var(--card-background);
        padding: 10px 20px;
        border-radius: 30px;
        box-shadow: 0 4px 12px var(--shadow-color);

        .score {
          font-weight: 600;
          color: #e3350d;
        }

        .progress {
          color: #666;
        }
      }

      .quiz-content {
        background-color: var(--card-background);
        border-radius: 16px;
        box-shadow: 0 4px 20px var(--shadow-color);
        overflow: hidden;
        margin-bottom: 30px;
      }

      .question-container {
        padding: 30px;
      }

      .question {
        font-size: 1.5rem;
        margin-top: 0;
        margin-bottom: 20px;
        text-align: center;
      }

      .image-container {
        display: flex;
        justify-content: center;
        margin: 20px 0;

        .pokemon-image {
          width: 200px;
          height: 200px;
          object-fit: contain;
          filter: brightness(0);
          transition: filter 0.5s ease;

          &.revealed {
            filter: brightness(1);
          }
        }
      }

      .stats-container {
        margin: 20px 0;
      }

      .stat-bars {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .stat-item {
        display: flex;
        align-items: center;
      }

      .stat-label {
        width: 100px;
        font-size: 14px;
      }

      .stat-bar-container {
        flex: 1;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
      }

      .stat-bar {
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease;

        &.hp {
          background-color: #ff5959;
        }
        &.attack {
          background-color: #f5ac78;
        }
        &.defense {
          background-color: #fae078;
        }
        &.specialAttack {
          background-color: #9db7f5;
        }
        &.specialDefense {
          background-color: #a7db8d;
        }
        &.speed {
          background-color: #fa92b2;
        }
      }

      .stat-value {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        font-size: 12px;
        font-weight: 500;
        color: #333;
      }

      .options-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 30px;
      }

      .option-button {
        padding: 15px;
        border-radius: 10px;
        background-color: #f5f5f5;
        border: 2px solid transparent;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;

        &:hover:not(:disabled) {
          background-color: #e0e0e0;
          transform: translateY(-2px);
        }

        &.selected {
          border-color: #3d7dca;
          background-color: rgba(61, 125, 202, 0.1);
        }

        &.correct {
          border-color: #78c850;
          background-color: rgba(120, 200, 80, 0.2);
        }

        &.incorrect {
          border-color: #e3350d;
          background-color: rgba(227, 53, 13, 0.2);
        }

        &:disabled {
          cursor: default;
        }
      }

      .feedback-container {
        padding: 20px 30px 30px;
        background-color: #f9f9f9;
        border-top: 1px solid #eee;
      }

      .feedback {
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;

        h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        p {
          margin: 0;
        }

        &.correct {
          background-color: rgba(120, 200, 80, 0.2);
          border: 1px solid #78c850;

          h3 {
            color: #2e8b57;
          }
        }

        &.incorrect {
          background-color: rgba(227, 53, 13, 0.2);
          border: 1px solid #e3350d;

          h3 {
            color: #e3350d;
          }
        }
      }

      .next-button {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        background-color: #3d7dca;
        color: white;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: #2a5a9c;
          transform: translateY(-2px);
        }
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;

        .loading-gif {
          width: 100px;
          height: 100px;
        }

        p {
          margin-top: 20px;
          font-size: 18px;
          color: #666;
        }
      }

      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
      }

      .error-message {
        background-color: var(--card-background);
        border-radius: 16px;
        box-shadow: 0 4px 20px var(--shadow-color);
        padding: 30px;
        text-align: center;
        max-width: 500px;

        h3 {
          color: #e3350d;
          margin-top: 0;
          margin-bottom: 15px;
        }

        p {
          margin-bottom: 20px;
        }
      }

      .retry-button {
        padding: 12px 24px;
        border-radius: 8px;
        background-color: #3d7dca;
        color: white;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: #2a5a9c;
          transform: translateY(-2px);
        }
      }

      .results-container {
        background-color: var(--card-background);
        border-radius: 16px;
        box-shadow: 0 4px 20px var(--shadow-color);
        padding: 30px;
        text-align: center;

        h2 {
          color: #e3350d;
          font-size: 2rem;
          margin-top: 0;
          margin-bottom: 30px;
        }
      }

      .final-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }

      .score-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px var(--shadow-color);

        .score-number {
          font-size: 3rem;
          font-weight: 700;
          color: #e3350d;
        }

        .score-total {
          font-size: 1.5rem;
          color: #666;
        }
      }

      .score-text {
        font-size: 1.2rem;
        color: #333;
        max-width: 400px;
        margin: 0 auto;
      }

      .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;

        @media (max-width: 576px) {
          flex-direction: column;
        }

        button {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .restart-button {
          background-color: #e3350d;
          color: white;

          &:hover {
            background-color: darken(#e3350d, 10%);
          }
        }

        .home-button {
          background-color: #f0f0f0;
          color: #333;

          &:hover {
            background-color: #e0e0e0;
          }
        }
      }
    `,
  ],
})
export class PokemonQuizComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: string = '';
  showAnswer: boolean = false;
  isCorrect: boolean = false;
  feedbackMessage: string = '';
  score: number = 0;
  totalQuestions: number = 10;
  loading: boolean = true;
  quizCompleted: boolean = false;
  errorMessage: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.generateQuiz();
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  async generateQuiz(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('Iniciando geração do quiz...');

      // Obter Pokémon para o quiz - usando fetchPokemons
      console.log('Buscando Pokémon...');
      const pokemons = await this.pokemonService.fetchPokemons(50);

      console.log(`Recebidos ${pokemons.length} Pokémon`);

      if (!pokemons || pokemons.length < 10) {
        throw new Error(
          'Não foi possível obter Pokémon suficientes para o quiz'
        );
      }

      // Criar perguntas manualmente para garantir que funcionem
      console.log('Criando perguntas do quiz...');

      // Perguntas de "Quem é este Pokémon?"
      const imageQuestions = pokemons.slice(0, 3).map((pokemon) => {
        const options = [pokemon.name];

        // Adicionar 3 nomes aleatórios de outros Pokémon
        while (options.length < 4) {
          const randomPokemon =
            pokemons[Math.floor(Math.random() * pokemons.length)].name;
          if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
          }
        }

        // Embaralhar opções
        const shuffledOptions = this.shuffleArray([...options]);

        return {
          type: 'image' as const,
          question: 'Quem é este Pokémon?',
          options: shuffledOptions,
          correctAnswer: pokemon.name,
          image: pokemon.image,
          pokemonName: pokemon.name,
          pokemonId: pokemon.id,
        };
      });

      // Perguntas de tipo
      const typeQuestions = pokemons.slice(3, 6).map((pokemon) => {
        const correctType = this.translateType(pokemon.type[0]);

        // Lista de tipos possíveis
        const allTypes = [
          'Normal',
          'Fogo',
          'Água',
          'Elétrico',
          'Planta',
          'Gelo',
          'Lutador',
          'Venenoso',
          'Terra',
          'Voador',
          'Psíquico',
          'Inseto',
          'Pedra',
          'Fantasma',
          'Dragão',
          'Sombrio',
          'Metálico',
          'Fada',
        ];

        // Remover o tipo correto da lista
        const otherTypes = allTypes.filter((type) => type !== correctType);

        // Selecionar 3 tipos aleatórios
        const randomTypes = this.shuffleArray(otherTypes).slice(0, 3);

        // Adicionar o tipo correto e embaralhar
        const options = this.shuffleArray([...randomTypes, correctType]);

        return {
          type: 'type' as const,
          question: `Qual é o tipo principal de ${this.capitalizeFirstLetter(
            pokemon.name
          )}?`,
          options,
          correctAnswer: correctType,
          image: pokemon.image,
          pokemonName: pokemon.name,
          pokemonId: pokemon.id,
        };
      });

      // Perguntas de estatísticas
      const statsQuestions = pokemons.slice(6, 9).map((pokemon) => {
        const options = [pokemon.name];

        // Adicionar 3 nomes aleatórios de outros Pokémon
        while (options.length < 4) {
          const randomPokemon =
            pokemons[Math.floor(Math.random() * pokemons.length)].name;
          if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
          }
        }

        // Embaralhar opções
        const shuffledOptions = this.shuffleArray([...options]);

        return {
          type: 'stats' as const,
          question: 'A qual Pokémon pertencem estas estatísticas?',
          options: shuffledOptions,
          correctAnswer: pokemon.name,
          stats: pokemon.stats,
          pokemonName: pokemon.name,
          pokemonId: pokemon.id,
        };
      });

      // Perguntas de habilidade (simplificadas)
      const abilityQuestions = pokemons.slice(9, 12).map((pokemon) => {
        const options = [pokemon.name];

        // Adicionar 3 nomes aleatórios de outros Pokémon
        while (options.length < 4) {
          const randomPokemon =
            pokemons[Math.floor(Math.random() * pokemons.length)].name;
          if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
          }
        }

        // Embaralhar opções
        const shuffledOptions = this.shuffleArray([...options]);

        return {
          type: 'ability' as const,
          question: `Qual Pokémon é conhecido por ter habilidades especiais relacionadas a "${this.capitalizeFirstLetter(
            pokemon.name
          )}"?`,
          options: shuffledOptions,
          correctAnswer: pokemon.name,
          pokemonName: pokemon.name,
          pokemonId: pokemon.id,
        };
      });

      // Combinar e embaralhar as perguntas
      console.log('Combinando e embaralhando perguntas...');
      const allQuestions = [
        ...imageQuestions,
        ...typeQuestions,
        ...statsQuestions,
        ...abilityQuestions,
      ];

      this.questions = this.shuffleArray(allQuestions).slice(
        0,
        this.totalQuestions
      );

      console.log(`Quiz gerado com ${this.questions.length} perguntas`);

      if (this.questions.length === 0) {
        throw new Error('Não foi possível gerar perguntas para o quiz');
      }

      this.loading = false;
    } catch (error) {
      console.error('Erro ao gerar quiz:', error);
      this.loading = false;
      this.errorMessage =
        'Não foi possível carregar o quiz. Por favor, tente novamente.';
    }
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
    this.showAnswer = true;
    this.isCorrect = answer === this.currentQuestion.correctAnswer;

    if (this.isCorrect) {
      this.score++;
      this.feedbackMessage = 'Parabéns! Você acertou.';

      // Revelar imagem se for uma questão de "Quem é este Pokémon?"
      if (this.currentQuestion.type === 'image') {
        const imageElement = document.querySelector(
          '.pokemon-image'
        ) as HTMLElement;
        if (imageElement) {
          imageElement.classList.add('revealed');
        }
      }
    } else {
      this.feedbackMessage = `A resposta correta é: ${this.currentQuestion.correctAnswer}`;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetQuestion();
    } else {
      this.quizCompleted = true;
    }
  }

  resetQuestion(): void {
    this.selectedAnswer = '';
    this.showAnswer = false;
    this.isCorrect = false;
    this.feedbackMessage = '';

    // Resetar imagem para silhueta se for uma questão de imagem
    setTimeout(() => {
      if (this.currentQuestion.type === 'image') {
        const imageElement = document.querySelector(
          '.pokemon-image'
        ) as HTMLElement;
        if (imageElement) {
          imageElement.classList.remove('revealed');
        }
      }
    }, 0);
  }

  restartQuiz(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.quizCompleted = false;
    this.generateQuiz();
  }

  retryQuiz(): void {
    this.errorMessage = '';
    this.generateQuiz();
  }

  getScoreMessage(): string {
    const percentage = (this.score / this.totalQuestions) * 100;

    if (percentage >= 90) {
      return 'Incrível! Você é um verdadeiro Mestre Pokémon!';
    } else if (percentage >= 70) {
      return 'Muito bom! Você conhece bastante sobre Pokémon!';
    } else if (percentage >= 50) {
      return 'Bom trabalho! Continue treinando seus conhecimentos!';
    } else if (percentage >= 30) {
      return 'Continue tentando! Você está no caminho certo.';
    } else {
      return 'Não desista! Tente novamente para melhorar seu conhecimento Pokémon.';
    }
  }

  getStatsArray(stats: any): { name: string; value: number }[] {
    if (!stats) return [];

    return [
      { name: 'hp', value: stats.hp || 0 },
      { name: 'attack', value: stats.attack || 0 },
      { name: 'defense', value: stats.defense || 0 },
      { name: 'specialAttack', value: stats.specialAttack || 0 },
      { name: 'specialDefense', value: stats.specialDefense || 0 },
      { name: 'speed', value: stats.speed || 0 },
    ];
  }

  translateStat(stat: string): string {
    const translations: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      specialAttack: 'Atq. Esp.',
      specialDefense: 'Def. Esp.',
      speed: 'Velocidade',
    };

    return translations[stat] || stat;
  }

  translateType(type: string): string {
    const translations: { [key: string]: string } = {
      normal: 'Normal',
      fire: 'Fogo',
      water: 'Água',
      electric: 'Elétrico',
      grass: 'Planta',
      ice: 'Gelo',
      fighting: 'Lutador',
      poison: 'Venenoso',
      ground: 'Terra',
      flying: 'Voador',
      psychic: 'Psíquico',
      bug: 'Inseto',
      rock: 'Pedra',
      ghost: 'Fantasma',
      dragon: 'Dragão',
      dark: 'Sombrio',
      steel: 'Metálico',
      fairy: 'Fada',
    };

    return translations[type.toLowerCase()] || this.capitalizeFirstLetter(type);
  }

  getStatPercentage(value: number): number {
    // Base stat max is typically 255
    return Math.min(100, (value / 255) * 100);
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Função para embaralhar array
  shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}
