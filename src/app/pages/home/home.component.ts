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

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
}

interface FeaturedGame {
  id: number;
  title: string;
  image: string;
  platforms: string[];
  releaseYear: number;
  description: string;
}

interface FeaturedPokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  description: string;
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
    trigger('heroAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('0.8s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  activeTab = 0;

  heroSlides = [
    {
      title: 'Monte sua Equipe Pokémon',
      subtitle:
        'Escolha seus Pokémon favoritos e prepare-se para batalhas épicas',
      image: '/assets/images/hero-team-battle.jpg',
      buttonText: 'Iniciar Batalha',
      buttonLink: '/battle',
    },
    {
      title: 'Explore a Pokédex Completa',
      subtitle:
        'Informações detalhadas sobre todos os Pokémon de todas as gerações',
      image: '/assets/images/hero-pokedex.jpg',
      buttonText: 'Acessar Pokédex',
      buttonLink: '/pokedex',
    },
    {
      title: 'Teste seus Conhecimentos',
      subtitle:
        'Desafie-se com nosso quiz Pokémon e torne-se um verdadeiro Mestre',
      image: '/assets/images/hero-quiz.jpg',
      buttonText: 'Iniciar Quiz',
      buttonLink: '/quiz',
    },
  ];

  newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Nova Atualização do Team Battle',
      summary:
        'Adicionamos novos Pokémon da região de Paldea e melhoramos o sistema de batalha.',
      image: '/assets/images/news-update.jpg',
      date: '02/05/2023',
      category: 'Atualizações',
    },
    {
      id: 2,
      title: 'Evento de Batalha Especial',
      summary:
        'Participe do evento especial de fim de semana com regras exclusivas e prêmios.',
      image: '/assets/images/news-event.jpg',
      date: '28/04/2023',
      category: 'Eventos',
    },
    {
      id: 3,
      title: 'Guia de Estratégia: Tipos Água',
      summary:
        'Confira nosso guia completo sobre como montar times eficientes com Pokémon do tipo Água.',
      image: '/assets/images/news-water.jpg',
      date: '25/04/2023',
      category: 'Guias',
    },
    {
      id: 4,
      title: 'Pokémon Legends: Arceus - Análise',
      summary:
        'Nossa análise completa do mais recente jogo da franquia Pokémon.',
      image: '/assets/images/news-arceus.jpg',
      date: '20/04/2023',
      category: 'Jogos',
    },
  ];

  featuredGames: FeaturedGame[] = [
    {
      id: 1,
      title: 'Pokémon Scarlet & Violet',
      image: '/assets/images/game-scarlet-violet.jpg',
      platforms: ['Nintendo Switch'],
      releaseYear: 2022,
      description:
        'Explore a região de Paldea em um mundo aberto cheio de novos Pokémon e desafios.',
    },
    {
      id: 2,
      title: 'Pokémon Legends: Arceus',
      image: '/assets/images/game-legends-arceus.jpg',
      platforms: ['Nintendo Switch'],
      releaseYear: 2022,
      description:
        'Viaje para o passado da região de Sinnoh e descubra os segredos dos Pokémon lendários.',
    },
    {
      id: 3,
      title: 'Pokémon Brilliant Diamond & Shining Pearl',
      image: '/assets/images/game-bdsp.jpg',
      platforms: ['Nintendo Switch'],
      releaseYear: 2021,
      description:
        'Reviva a aventura clássica da região de Sinnoh com gráficos e mecânicas modernizadas.',
    },
  ];

  featuredPokemon: FeaturedPokemon[] = [
    {
      id: 25,
      name: 'Pikachu',
      image: '/assets/images/pokemon-pikachu.png',
      types: ['Elétrico'],
      description:
        'O Pokémon mascote da franquia, conhecido por sua velocidade e ataques elétricos poderosos.',
    },
    {
      id: 6,
      name: 'Charizard',
      image: '/assets/images/pokemon-charizard.png',
      types: ['Fogo', 'Voador'],
      description:
        'Um dos Pokémon mais populares, capaz de lançar chamas intensas que podem derreter qualquer coisa.',
    },
    {
      id: 150,
      name: 'Mewtwo',
      image: '/assets/images/pokemon-mewtwo.png',
      types: ['Psíquico'],
      description:
        'Um Pokémon lendário criado geneticamente, com imensos poderes psíquicos.',
    },
    {
      id: 384,
      name: 'Rayquaza',
      image: '/assets/images/pokemon-rayquaza.png',
      types: ['Dragão', 'Voador'],
      description:
        'Um Pokémon lendário que vive na camada de ozônio e tem o poder de acalmar outros Pokémon lendários.',
    },
  ];

  quickLinks = [
    { icon: 'sports_esports', text: 'Batalha', route: '/battle' },
    { icon: 'menu_book', text: 'Pokédex', route: '/pokedex' },
    { icon: 'quiz', text: 'Quiz', route: '/quiz' },
    { icon: 'videogame_asset', text: 'Jogos', route: '/games' },
    { icon: 'leaderboard', text: 'Ranking', route: '/ranking' },
    { icon: 'person', text: 'Perfil', route: '/profile' },
  ];

  upcomingEvents = [
    {
      title: 'Torneio Regional',
      date: '15/05/2023',
      description:
        'Participe do torneio regional e mostre suas habilidades como treinador.',
    },
    {
      title: 'Evento de Tipos Fantasma',
      date: '31/10/2023',
      description:
        'Evento especial de Halloween com foco em Pokémon do tipo Fantasma.',
    },
    {
      title: 'Atualização de Primavera',
      date: '20/09/2023',
      description:
        'Nova atualização com Pokémon sazonais e mecânicas de jogo inéditas.',
    },
  ];

  ngOnInit() {
    // Iniciar o carrossel automático
    setInterval(() => {
      this.nextSlide();
    }, 6000);
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

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
}
