/* home.component.ts */
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { ImgFallbackDirective } from '../../directives/fallback-image.directive';

interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  features: string[];
  color: string;
  icon: string;
}

interface FeaturedPokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    CommonModule,
    ImgFallbackDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate(
          '0.6s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateX(-30px)' })),
      transition(':enter', [
        animate(
          '0.5s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      state('void', style({ opacity: 0, transform: 'translateX(30px)' })),
      transition(':enter', [
        animate(
          '0.5s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('scaleIn', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('bounce', [
      state('void', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        animate('1s ease-in-out', style({ transform: 'translateY(-10px)' })),
        animate('1s ease-in-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('heroAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '600ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '600ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  activeTab = 0;

  // Modos de jogo principais
  gameModes: GameMode[] = [
    {
      id: 'battle',
      title: 'Modo Batalha',
      subtitle: 'Estratégia e Ação',
      description:
        'Monte sua equipe de Pokémon e desafie outros treinadores em batalhas épicas. Utilize estratégias, aproveite vantagens de tipo e torne-se o campeão!',
      image: '/assets/images/battle-mode.jpg',
      buttonText: 'Iniciar Batalha',
      buttonLink: '/battle',
      features: [
        'Batalhas em tempo real',
        'Sistema de vantagens de tipo',
        'Estratégias de equipe',
        'Ranking de treinadores',
      ],
      color: '#e74c3c',
      icon: 'sports_esports',
    },
    {
      id: 'quiz',
      title: 'Modo Quiz',
      subtitle: 'Teste seus Conhecimentos',
      description:
        'Quanto você realmente sabe sobre o mundo Pokémon? Desafie-se com perguntas sobre tipos, evoluções, habilidades e muito mais!',
      image: '/assets/images/quiz-mode.jpg',
      buttonText: 'Iniciar Quiz',
      buttonLink: '/quiz',
      features: [
        'Perguntas de múltipla escolha',
        'Diferentes níveis de dificuldade',
        'Desafios cronometrados',
        'Recordes pessoais',
      ],
      color: '#3498db',
      icon: 'quiz',
    },
    {
      id: 'comparator',
      title: 'Comparador de Pokémon',
      subtitle: 'Análise e Comparação',
      description:
        'Compare estatísticas, habilidades e vantagens entre diferentes Pokémon. Descubra qual tem mais chances de vencer em uma batalha direta!',
      image: '/assets/images/comparator-mode.jpg',
      buttonText: 'Comparar Pokémon',
      buttonLink: '/comparator',
      features: [
        'Comparação visual de estatísticas',
        'Análise de vantagens de tipo',
        'Previsão de resultados de batalha',
        'Pokémon de todas as gerações',
      ],
      color: '#2ecc71',
      icon: 'compare',
    },
  ];

  // Slides do herói
  heroSlides = [
    {
      title: 'Batalhas Épicas',
      subtitle: 'Monte sua equipe e derrote seus oponentes',
      image: '/assets/images/hero-battle.jpg',
      buttonText: 'Iniciar Batalha',
      buttonLink: '/battle',
      color: '#e74c3c',
    },
    {
      title: 'Desafie seu Conhecimento',
      subtitle: 'Teste o quanto você sabe sobre Pokémon',
      image: '/assets/images/hero-quiz.jpg',
      buttonText: 'Iniciar Quiz',
      buttonLink: '/quiz',
      color: '#3498db',
    },
    {
      title: 'Compare e Analise',
      subtitle: 'Descubra qual Pokémon tem vantagem',
      image: '/assets/images/hero-comparator.jpg',
      buttonText: 'Comparar Pokémon',
      buttonLink: '/comparator',
      color: '#2ecc71',
    },
  ];

  // Pokémon em destaque
  featuredPokemon: FeaturedPokemon[] = [
    {
      id: 25,
      name: 'Pikachu',
      image: '/assets/images/pokemon-pikachu.png',
      types: ['Elétrico'],
    },
    {
      id: 6,
      name: 'Charizard',
      image: '/assets/images/pokemon-charizard.png',
      types: ['Fogo', 'Voador'],
    },
    {
      id: 150,
      name: 'Mewtwo',
      image: '/assets/images/pokemon-mewtwo.png',
      types: ['Psíquico'],
    },
    {
      id: 384,
      name: 'Rayquaza',
      image: '/assets/images/pokemon-rayquaza.png',
      types: ['Dragão', 'Voador'],
    },
  ];

  // Estatísticas do portal
  stats = [
    { value: '10,543', label: 'Treinadores', icon: 'person' },
    { value: '156,782', label: 'Batalhas', icon: 'bolt' },
    { value: '42,195', label: 'Quiz Completados', icon: 'psychology' },
    { value: '1,025', label: 'Pokémon', icon: 'catching_pokemon' },
  ];

  // Links rápidos
  quickLinks = [
    { icon: 'menu_book', text: 'Pokédex', route: '/pokedex' },
    { icon: 'leaderboard', text: 'Ranking', route: '/ranking' },
    { icon: 'videogame_asset', text: 'Jogos', route: '/games' },
    { icon: 'person', text: 'Perfil', route: '/profile' },
  ];

  ngOnInit() {
    // Iniciar o carrossel automático
    setInterval(() => {
      this.nextSlide();
    }, 6000);

    // Adicionar efeito de flutuação aos elementos
    this.setupFloatingElements();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }

  setupFloatingElements() {
    // Implementação de efeitos de flutuação para elementos decorativos
    // Seria implementado com JavaScript/DOM manipulation
  }
}
