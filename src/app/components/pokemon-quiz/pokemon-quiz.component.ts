import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonProgressBarComponent } from '../pokemon-progress-bar/pokemon-progress-bar.component';

interface QuizQuestion {
  type: 'image' | 'type' | 'evolution';
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  pokemonName?: string;
  pokemonId?: number;
}

interface QuizSettings {
  questionCount: number;
  difficulty: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
}

interface DifficultyOption {
  value: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
  label: string;
  description: string;
  stars: number[];
  maxPokemonId: number;
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
  templateUrl: './pokemon-quiz.component.html',
  styleUrls: ['./pokemon-quiz.component.scss'],
})
export class PokemonQuizComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: string = '';
  showAnswer: boolean = false;
  isCorrect: boolean = false;
  feedbackMessage: string = '';
  score: number = 0;
  loading: boolean = false;
  quizCompleted: boolean = false;
  errorMessage: string = '';
  showSettings: boolean = true;

  questionCountOptions: number[] = [10, 20, 30];

  difficultyOptions: DifficultyOption[] = [
    {
      value: 'very-easy',
      label: 'Muito Fácil',
      description: '1ª Geração (1-151)',
      stars: [1],
      maxPokemonId: 151,
    },
    {
      value: 'easy',
      label: 'Fácil',
      description: '1ª e 2ª Geração (1-251)',
      stars: [1, 2],
      maxPokemonId: 251,
    },
    {
      value: 'medium',
      label: 'Médio',
      description: 'Até 4ª Geração (1-493)',
      stars: [1, 2, 3],
      maxPokemonId: 493,
    },
    {
      value: 'hard',
      label: 'Difícil',
      description: 'Até 6ª Geração (1-721)',
      stars: [1, 2, 3, 4],
      maxPokemonId: 721,
    },
    {
      value: 'very-hard',
      label: 'Muito Difícil',
      description: 'Todas as Gerações (1-898+)',
      stars: [1, 2, 3, 4, 5],
      maxPokemonId: 898,
    },
  ];

  settings: QuizSettings = {
    questionCount: 10,
    difficulty: 'easy',
  };

  // Dados de evolução para Pokémon comuns
  evolutionChains: { [key: string]: string[] } = {
    bulbasaur: ['bulbasaur', 'ivysaur', 'venusaur'],
    charmander: ['charmander', 'charmeleon', 'charizard'],
    squirtle: ['squirtle', 'wartortle', 'blastoise'],
    caterpie: ['caterpie', 'metapod', 'butterfree'],
    weedle: ['weedle', 'kakuna', 'beedrill'],
    pidgey: ['pidgey', 'pidgeotto', 'pidgeot'],
    rattata: ['rattata', 'raticate'],
    pikachu: ['pichu', 'pikachu', 'raichu'],
    sandshrew: ['sandshrew', 'sandslash'],
    nidoran: ['nidoran', 'nidorina', 'nidoqueen'],
    vulpix: ['vulpix', 'ninetales'],
    jigglypuff: ['igglybuff', 'jigglypuff', 'wigglytuff'],
    zubat: ['zubat', 'golbat', 'crobat'],
    oddish: ['oddish', 'gloom', 'vileplume'],
    meowth: ['meowth', 'persian'],
    psyduck: ['psyduck', 'golduck'],
    growlithe: ['growlithe', 'arcanine'],
    poliwag: ['poliwag', 'poliwhirl', 'poliwrath'],
    abra: ['abra', 'kadabra', 'alakazam'],
    machop: ['machop', 'machoke', 'machamp'],
    geodude: ['geodude', 'graveler', 'golem'],
    magnemite: ['magnemite', 'magneton', 'magnezone'],
    gastly: ['gastly', 'haunter', 'gengar'],
    onix: ['onix', 'steelix'],
    drowzee: ['drowzee', 'hypno'],
    krabby: ['krabby', 'kingler'],
    voltorb: ['voltorb', 'electrode'],
    exeggcute: ['exeggcute', 'exeggutor'],
    cubone: ['cubone', 'marowak'],
    koffing: ['koffing', 'weezing'],
    rhyhorn: ['rhyhorn', 'rhydon', 'rhyperior'],
    chansey: ['chansey', 'blissey'],
    horsea: ['horsea', 'seadra', 'kingdra'],
    goldeen: ['goldeen', 'seaking'],
    staryu: ['staryu', 'starmie'],
    scyther: ['scyther', 'scizor'],
    magikarp: ['magikarp', 'gyarados'],
    eevee: [
      'eevee',
      'vaporeon',
      'jolteon',
      'flareon',
      'espeon',
      'umbreon',
      'leafeon',
      'glaceon',
      'sylveon',
    ],
    dratini: ['dratini', 'dragonair', 'dragonite'],
    chikorita: ['chikorita', 'bayleef', 'meganium'],
    cyndaquil: ['cyndaquil', 'quilava', 'typhlosion'],
    totodile: ['totodile', 'croconaw', 'feraligatr'],
    sentret: ['sentret', 'furret'],
    hoothoot: ['hoothoot', 'noctowl'],
    ledyba: ['ledyba', 'ledian'],
    spinarak: ['spinarak', 'ariados'],
    chinchou: ['chinchou', 'lanturn'],
    togepi: ['togepi', 'togetic', 'togekiss'],
    mareep: ['mareep', 'flaaffy', 'ampharos'],
    marill: ['azurill', 'marill', 'azumarill'],
    hoppip: ['hoppip', 'skiploom', 'jumpluff'],
    sunkern: ['sunkern', 'sunflora'],
    wooper: ['wooper', 'quagsire'],
    pineco: ['pineco', 'forretress'],
    snubbull: ['snubbull', 'granbull'],
    teddiursa: ['teddiursa', 'ursaring'],
    slugma: ['slugma', 'magcargo'],
    swinub: ['swinub', 'piloswine', 'mamoswine'],
    remoraid: ['remoraid', 'octillery'],
    houndour: ['houndour', 'houndoom'],
    larvitar: ['larvitar', 'pupitar', 'tyranitar'],
    // Terceira geração
    treecko: ['treecko', 'grovyle', 'sceptile'],
    torchic: ['torchic', 'combusken', 'blaziken'],
    mudkip: ['mudkip', 'marshtomp', 'swampert'],
    poochyena: ['poochyena', 'mightyena'],
    zigzagoon: ['zigzagoon', 'linoone'],
    wurmple: ['wurmple', 'silcoon', 'beautifly'],
    lotad: ['lotad', 'lombre', 'ludicolo'],
    seedot: ['seedot', 'nuzleaf', 'shiftry'],
    taillow: ['taillow', 'swellow'],
    wingull: ['wingull', 'pelipper'],
    ralts: ['ralts', 'kirlia', 'gardevoir'],
    shroomish: ['shroomish', 'breloom'],
    slakoth: ['slakoth', 'vigoroth', 'slaking'],
    nincada: ['nincada', 'ninjask', 'shedinja'],
    whismur: ['whismur', 'loudred', 'exploud'],
    makuhita: ['makuhita', 'hariyama'],
    aron: ['aron', 'lairon', 'aggron'],
    meditite: ['meditite', 'medicham'],
    electrike: ['electrike', 'manectric'],
    gulpin: ['gulpin', 'swalot'],
    carvanha: ['carvanha', 'sharpedo'],
    wailmer: ['wailmer', 'wailord'],
    numel: ['numel', 'camerupt'],
    spoink: ['spoink', 'grumpig'],
    trapinch: ['trapinch', 'vibrava', 'flygon'],
    cacnea: ['cacnea', 'cacturne'],
    swablu: ['swablu', 'altaria'],
    barboach: ['barboach', 'whiscash'],
    corphish: ['corphish', 'crawdaunt'],
    baltoy: ['baltoy', 'claydol'],
    lileep: ['lileep', 'cradily'],
    anorith: ['anorith', 'armaldo'],
    feebas: ['feebas', 'milotic'],
    shuppet: ['shuppet', 'banette'],
    duskull: ['duskull', 'dusclops', 'dusknoir'],
    snorunt: ['snorunt', 'glalie', 'froslass'],
    spheal: ['spheal', 'sealeo', 'walrein'],
    bagon: ['bagon', 'shelgon', 'salamence'],
    beldum: ['beldum', 'metang', 'metagross'],
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // Não iniciar o quiz automaticamente, mostrar configurações primeiro
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  startQuiz(): void {
    this.showSettings = false;
    this.generateQuiz();
  }

  async generateQuiz(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.questions = []; // Limpar perguntas anteriores

    try {
      console.log('Iniciando geração do quiz...');
      console.log(
        `Configurações: ${this.settings.questionCount} perguntas, dificuldade ${this.settings.difficulty}`
      );

      // Determinar o número máximo de Pokémon com base na dificuldade
      const difficultyOption = this.difficultyOptions.find(
        (d) => d.value === this.settings.difficulty
      );
      const maxPokemonId = difficultyOption?.maxPokemonId || 151;

      console.log(`Buscando Pokémon até o ID ${maxPokemonId}...`);
      const pokemons = await this.pokemonService.fetchPokemons(maxPokemonId);

      console.log(`Recebidos ${pokemons.length} Pokémon`);

      if (!pokemons || pokemons.length < 20) {
        throw new Error(
          'Não foi possível obter Pokémon suficientes para o quiz'
        );
      }

      // Embaralhar os Pokémon para ter uma seleção aleatória
      const shuffledPokemons = this.shuffleArray([...pokemons]);

      // Distribuição das perguntas: 60% quem é este Pokémon, 20% tipo, 20% evolução
      const imageQuestionCount = Math.floor(this.settings.questionCount * 0.6);
      const typeQuestionCount = Math.floor(this.settings.questionCount * 0.2);
      const evolutionQuestionCount =
        this.settings.questionCount - imageQuestionCount - typeQuestionCount;

      console.log(
        `Distribuição de perguntas: ${imageQuestionCount} de imagem, ${typeQuestionCount} de tipo, ${evolutionQuestionCount} de evolução`
      );

      // Criar perguntas de "Quem é este Pokémon?"
      const imageQuestions = shuffledPokemons
        .slice(0, imageQuestionCount)
        .map((pokemon) => {
          const options = this.generateRandomPokemonNames(
            pokemon.name,
            shuffledPokemons
          );

          return {
            type: 'image' as const,
            question: 'Quem é este Pokémon?',
            options,
            correctAnswer: this.capitalizeFirstLetter(pokemon.name),
            image: pokemon.image,
            pokemonName: pokemon.name,
            pokemonId: pokemon.id,
          };
        });

      // Perguntas de tipo
      const typeQuestions = shuffledPokemons
        .slice(imageQuestionCount, imageQuestionCount + typeQuestionCount)
        .map((pokemon) => {
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

      // Perguntas de evolução
      const evolutionQuestions = [];

      // Selecionar Pokémon que temos dados de evolução
      for (
        let i = imageQuestionCount + typeQuestionCount;
        i < shuffledPokemons.length &&
        evolutionQuestions.length < evolutionQuestionCount;
        i++
      ) {
        const pokemon = shuffledPokemons[i];
        if (!pokemon) continue;

        const pokemonName = pokemon.name.toLowerCase();

        // Verificar se temos dados de evolução para este Pokémon
        let evolutionChain = null;

        // Procurar em todas as cadeias de evolução
        for (const [basePokemon, chain] of Object.entries(
          this.evolutionChains
        )) {
          if (chain.includes(pokemonName)) {
            evolutionChain = chain;
            break;
          }
        }

        if (evolutionChain) {
          // Encontrar a posição do Pokémon na cadeia
          const pokemonIndex = evolutionChain.indexOf(pokemonName);

          // Verificar se este Pokémon evolui (não é o último da cadeia)
          if (pokemonIndex < evolutionChain.length - 1) {
            const correctEvolution = this.capitalizeFirstLetter(
              evolutionChain[pokemonIndex + 1]
            );

            // Gerar opções aleatórias
            const otherPokemons = shuffledPokemons
              .filter(
                (p) => p.name.toLowerCase() !== correctEvolution.toLowerCase()
              )
              .map((p) => this.capitalizeFirstLetter(p.name));

            const randomOptions = this.shuffleArray(otherPokemons).slice(0, 3);
            const options = this.shuffleArray([
              ...randomOptions,
              correctEvolution,
            ]);

            evolutionQuestions.push({
              type: 'evolution' as const,
              question: `Em qual Pokémon ${this.capitalizeFirstLetter(
                pokemon.name
              )} evolui?`,
              options,
              correctAnswer: correctEvolution,
              image: pokemon.image,
              pokemonName: pokemon.name,
              pokemonId: pokemon.id,
            });
          }
        }
      }

      // Combinar e embaralhar as perguntas
      console.log('Combinando e embaralhando perguntas...');
      const allQuestions = [
        ...imageQuestions,
        ...typeQuestions,
        ...evolutionQuestions,
      ];

      this.questions = this.shuffleArray(allQuestions).slice(
        0,
        this.settings.questionCount
      );

      console.log(`Quiz gerado com ${this.questions.length} perguntas`);

      if (this.questions.length === 0) {
        throw new Error('Não foi possível gerar perguntas para o quiz');
      }

      this.loading = false;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.selectedAnswer = '';
      this.showAnswer = false;
    } catch (error) {
      console.error('Erro ao gerar quiz:', error);
      this.loading = false;
      this.errorMessage =
        'Não foi possível carregar o quiz. Por favor, tente novamente.';
    }
  }

  generateRandomPokemonNames(
    correctName: string,
    allPokemons: any[]
  ): string[] {
    // Capitalizar o nome correto
    const capitalizedCorrectName = this.capitalizeFirstLetter(correctName);
    const options = [capitalizedCorrectName];

    // Adicionar nomes aleatórios de outros Pokémon
    while (options.length < 4) {
      const randomPokemon = this.capitalizeFirstLetter(
        allPokemons[Math.floor(Math.random() * allPokemons.length)].name
      );
      if (!options.includes(randomPokemon)) {
        options.push(randomPokemon);
      }
    }

    return this.shuffleArray(options);
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
    this.showAnswer = true;
    this.isCorrect =
      this.normalizeAnswer(answer) ===
      this.normalizeAnswer(this.currentQuestion.correctAnswer);

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

  // Normaliza a resposta para comparação (corrige o bug do Lanturn)
  normalizeAnswer(answer: string): string {
    if (!answer) return '';
    return answer.trim().toLowerCase();
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
  }

  restartQuiz(): void {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.quizCompleted = false;
    this.selectedAnswer = '';
    this.showAnswer = false;
    this.questions = [];
    this.showSettings = true;
  }

  retryQuiz(): void {
    this.errorMessage = '';
    this.showSettings = true;
  }

  getScoreMessage(): string {
    const percentage = this.getScorePercentage();

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

  getScorePercentage(): number {
    return Math.round((this.score / this.settings.questionCount) * 100);
  }

  getScoreCircleCircumference(): number {
    return 2 * Math.PI * 90;
  }

  getScoreCircleOffset(): number {
    const circumference = this.getScoreCircleCircumference();
    const percentage = this.getScorePercentage();
    return circumference - (circumference * percentage) / 100;
  }

  getBadgeClass(): string {
    const percentage = this.getScorePercentage();

    if (percentage >= 90) return 'master';
    if (percentage >= 80) return 'platinum';
    if (percentage >= 70) return 'gold';
    if (percentage >= 50) return 'silver';
    return 'bronze';
  }

  getBadgeIcon(): string {
    const percentage = this.getScorePercentage();

    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 70) return '🥇';
    if (percentage >= 50) return '🥈';
    return '🥉';
  }

  getBadgeTitle(): string {
    const percentage = this.getScorePercentage();

    if (percentage >= 90) return 'Mestre Pokémon';
    if (percentage >= 80) return 'Treinador Elite';
    if (percentage >= 70) return 'Treinador Avançado';
    if (percentage >= 50) return 'Treinador Intermediário';
    return 'Treinador Iniciante';
  }

  getDifficultyLabel(): string {
    const difficultyOption = this.difficultyOptions.find(
      (d) => d.value === this.settings.difficulty
    );
    return difficultyOption?.label || '';
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
