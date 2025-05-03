import { Injectable } from '@angular/core';

export interface GameReception {
  score: number;
  review: string;
}

export interface PokemonGame {
  id: number;
  title: string;
  releaseYear: number;
  platforms: string[];
  category: string;
  generation: number;
  description: string;
  coverImage: string;
  screenshots?: string[];
  trailer?: string;
  features: string[];
  reception: GameReception;
  sales?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonGamesService {
  private games: PokemonGame[] = [
    {
      id: 1,
      title: 'Pokémon Red & Blue',
      releaseYear: 1996,
      platforms: ['Game Boy'],
      category: 'main-series',
      generation: 1,
      description:
        'Os jogos originais que iniciaram a franquia Pokémon. Red e Blue introduziram os 151 Pokémon originais e o conceito básico de capturar, treinar e batalhar com Pokémon.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Red+Blue',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Red+Blue+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Red+Blue+Screenshot+2',
      ],
      features: [
        '151 Pokémon',
        'Sistema de batalha por turnos',
        'Ginásios Pokémon',
        'Elite Four',
      ],
      reception: {
        score: 9.5,
        review:
          'Revolucionário para sua época, Pokémon Red e Blue estabeleceram as bases para uma das franquias mais bem-sucedidas de todos os tempos.',
      },
      sales: 31.38,
    },
    {
      id: 2,
      title: 'Pokémon Yellow',
      releaseYear: 1998,
      platforms: ['Game Boy'],
      category: 'main-series',
      generation: 1,
      description:
        'Uma versão aprimorada de Red e Blue, inspirada no anime Pokémon. O jogador começa com Pikachu como seu Pokémon inicial, que segue o treinador fora da Pokébola.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Yellow',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Yellow+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Yellow+Screenshot+2',
      ],
      features: [
        'Pikachu como companheiro',
        'Elementos do anime',
        'Compatibilidade com Pokémon Stadium',
      ],
      reception: {
        score: 9.0,
        review:
          'Pokémon Yellow aprimorou a experiência dos jogos originais com elementos do anime, tornando-o mais acessível para novos fãs.',
      },
      sales: 14.64,
    },
    {
      id: 3,
      title: 'Pokémon Gold & Silver',
      releaseYear: 1999,
      platforms: ['Game Boy Color'],
      category: 'main-series',
      generation: 2,
      description:
        'A segunda geração de jogos Pokémon introduziu 100 novos Pokémon, um novo sistema de dia e noite, criação de Pokémon, e duas novas regiões para explorar: Johto e Kanto.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Gold+Silver',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Gold+Silver+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Gold+Silver+Screenshot+2',
      ],
      features: [
        '100 novos Pokémon',
        'Sistema de dia e noite',
        'Criação de Pokémon',
        'Duas regiões jogáveis',
      ],
      reception: {
        score: 9.8,
        review:
          'Considerados por muitos como os melhores jogos da série, Gold e Silver aperfeiçoaram a fórmula original com adições significativas.',
      },
      sales: 23.1,
    },
    {
      id: 4,
      title: 'Pokémon Crystal',
      releaseYear: 2000,
      platforms: ['Game Boy Color'],
      category: 'main-series',
      generation: 2,
      description:
        'Uma versão aprimorada de Gold e Silver, Crystal foi o primeiro jogo Pokémon a permitir que os jogadores escolhessem o gênero do personagem.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Crystal',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Crystal+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Crystal+Screenshot+2',
      ],
      features: [
        'Escolha de gênero do personagem',
        'Animações de batalha',
        'Battle Tower',
        'História expandida com Suicune',
      ],
      reception: {
        score: 9.0,
        review:
          'Crystal refinou ainda mais a experiência de Gold e Silver, adicionando recursos como animações de batalha e a opção de jogar como personagem feminino.',
      },
      sales: 6.39,
    },
    {
      id: 5,
      title: 'Pokémon Ruby & Sapphire',
      releaseYear: 2002,
      platforms: ['Game Boy Advance'],
      category: 'main-series',
      generation: 3,
      description:
        'A terceira geração de jogos Pokémon introduziu 135 novos Pokémon e uma nova região chamada Hoenn. Estes jogos apresentaram gráficos significativamente melhorados.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Ruby+Sapphire',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Ruby+Sapphire+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Ruby+Sapphire+Screenshot+2',
      ],
      features: [
        '135 novos Pokémon',
        'Habilidades Pokémon',
        'Naturezas',
        'Competições Pokémon',
        'Bases Secretas',
      ],
      reception: {
        score: 9.5,
        review:
          'Ruby e Sapphire revitalizaram a série com gráficos coloridos, uma nova região e mecânicas inovadoras como habilidades e naturezas.',
      },
      sales: 16.22,
    },
    {
      id: 6,
      title: 'Pokémon FireRed & LeafGreen',
      releaseYear: 2004,
      platforms: ['Game Boy Advance'],
      category: 'remake',
      generation: 3,
      description:
        'Remakes dos jogos originais Red e Blue para o Game Boy Advance, com gráficos atualizados e recursos adicionais como as Sevii Islands.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+FireRed+LeafGreen',
      screenshots: [
        'https://via.placeholder.com/640x480?text=FireRed+LeafGreen+Screenshot+1',
        'https://via.placeholder.com/640x480?text=FireRed+LeafGreen+Screenshot+2',
      ],
      features: [
        'Gráficos atualizados',
        'Sevii Islands',
        'Compatibilidade com Ruby/Sapphire/Emerald',
        'Wireless Adapter',
      ],
      reception: {
        score: 9.0,
        review:
          'FireRed e LeafGreen trouxeram os clássicos originais para uma nova geração de jogadores, mantendo a essência dos jogos.',
      },
      sales: 12.0,
    },
    {
      id: 7,
      title: 'Pokémon Emerald',
      releaseYear: 2004,
      platforms: ['Game Boy Advance'],
      category: 'main-series',
      generation: 3,
      description:
        'Uma versão aprimorada de Ruby e Sapphire, Emerald expandiu a história para incluir tanto a Team Magma quanto a Team Aqua como antagonistas.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Emerald',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Emerald+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Emerald+Screenshot+2',
      ],
      features: [
        'Battle Frontier',
        'Animações de batalha aprimoradas',
        'História expandida',
        'Rayquaza como Pokémon lendário principal',
      ],
      reception: {
        score: 9.2,
        review:
          'Emerald aperfeiçoou a experiência de Hoenn com uma história mais rica e a adição da Battle Frontier.',
      },
      sales: 6.32,
    },
    {
      id: 8,
      title: 'Pokémon Diamond & Pearl',
      releaseYear: 2006,
      platforms: ['Nintendo DS'],
      category: 'main-series',
      generation: 4,
      description:
        'A quarta geração de jogos Pokémon introduziu 107 novos Pokémon e a região de Sinnoh. Estes jogos aproveitaram as capacidades do Nintendo DS.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Diamond+Pearl',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Diamond+Pearl+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Diamond+Pearl+Screenshot+2',
      ],
      features: [
        '107 novos Pokémon',
        'Divisão física/especial',
        'Conectividade online',
        'Pokétch (relógio Pokémon)',
      ],
      reception: {
        score: 8.5,
        review:
          'Diamond e Pearl trouxeram Pokémon para o Nintendo DS com gráficos 3D aprimorados e a importante divisão física/especial dos movimentos.',
      },
      sales: 17.67,
    },
    {
      id: 9,
      title: 'Pokémon Platinum',
      releaseYear: 2008,
      platforms: ['Nintendo DS'],
      category: 'main-series',
      generation: 4,
      description:
        'Uma versão aprimorada de Diamond e Pearl, Platinum apresentou uma história expandida focada em Giratina e o Distortion World.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Platinum',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Platinum+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Platinum+Screenshot+2',
      ],
      features: [
        'Distortion World',
        'Battle Frontier',
        'Wi-Fi Plaza',
        'Giratina como Pokémon lendário principal',
      ],
      reception: {
        score: 8.8,
        review:
          'Platinum refinou a experiência de Sinnoh com uma história mais envolvente, o fascinante Distortion World e uma variedade de melhorias.',
      },
      sales: 7.06,
    },
    {
      id: 10,
      title: 'Pokémon HeartGold & SoulSilver',
      releaseYear: 2009,
      platforms: ['Nintendo DS'],
      category: 'remake',
      generation: 4,
      description:
        'Remakes de Gold e Silver para o Nintendo DS, estes jogos incluíram todos os recursos dos jogos originais mais adições de Crystal e novos elementos.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+HeartGold+SoulSilver',
      screenshots: [
        'https://via.placeholder.com/640x480?text=HeartGold+SoulSilver+Screenshot+1',
        'https://via.placeholder.com/640x480?text=HeartGold+SoulSilver+Screenshot+2',
      ],
      features: [
        'Pokémon seguindo o jogador',
        'Pokéwalker',
        'Gráficos atualizados',
        'Safari Zone personalizada',
      ],
      reception: {
        score: 9.4,
        review:
          'HeartGold e SoulSilver são considerados exemplos perfeitos de como fazer remakes, mantendo a essência dos originais enquanto adicionam melhorias significativas.',
      },
      sales: 12.72,
    },
    {
      id: 11,
      title: 'Pokémon Black & White',
      releaseYear: 2010,
      platforms: ['Nintendo DS'],
      category: 'main-series',
      generation: 5,
      description:
        'A quinta geração de jogos Pokémon introduziu 156 novos Pokémon e a região de Unova. Estes jogos apresentaram uma história mais madura e complexa.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Black+White',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Black+White+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Black+White+Screenshot+2',
      ],
      features: [
        '156 novos Pokémon',
        'Gráficos com elementos 3D',
        'Batalhas em movimento',
        'C-Gear para conectividade',
      ],
      reception: {
        score: 9.0,
        review:
          'Black e White renovaram a série com uma narrativa mais profunda e uma abordagem ousada de apresentar apenas novos Pokémon durante a história principal.',
      },
      sales: 15.64,
    },
    {
      id: 12,
      title: 'Pokémon Black 2 & White 2',
      releaseYear: 2012,
      platforms: ['Nintendo DS'],
      category: 'main-series',
      generation: 5,
      description:
        'Sequências diretas de Black e White, estes jogos continuam a história dois anos depois, com novas áreas para explorar e uma seleção expandida de Pokémon.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Black+2+White+2',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Black+2+White+2+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Black+2+White+2+Screenshot+2',
      ],
      features: [
        'Pokémon World Tournament',
        'PokéStar Studios',
        'Modo Desafio',
        'Medalhas',
      ],
      reception: {
        score: 8.5,
        review:
          'Black 2 e White 2 foram as primeiras sequências diretas na série principal, oferecendo uma nova perspectiva sobre a região de Unova com conteúdo substancial.',
      },
      sales: 8.52,
    },
    {
      id: 13,
      title: 'Pokémon X & Y',
      releaseYear: 2013,
      platforms: ['Nintendo 3DS'],
      category: 'main-series',
      generation: 6,
      description:
        'A sexta geração de jogos Pokémon introduziu 72 novos Pokémon e a região de Kalos. Estes jogos marcaram a transição da série para gráficos totalmente 3D.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+X+Y',
      screenshots: [
        'https://via.placeholder.com/640x480?text=X+Y+Screenshot+1',
        'https://via.placeholder.com/640x480?text=X+Y+Screenshot+2',
      ],
      features: [
        'Mega Evolução',
        'Tipo Fada',
        'Personalização de personagem',
        'Pokémon-Amie',
      ],
      reception: {
        score: 8.7,
        review:
          'X e Y revolucionaram visualmente a série com gráficos 3D completos e introduziram a Mega Evolução, revitalizando o interesse na franquia.',
      },
      sales: 16.58,
    },
    {
      id: 14,
      title: 'Pokémon Omega Ruby & Alpha Sapphire',
      releaseYear: 2014,
      platforms: ['Nintendo 3DS'],
      category: 'remake',
      generation: 6,
      description:
        'Remakes de Ruby e Sapphire para o Nintendo 3DS, com gráficos 3D e recursos adicionais como o Delta Episode e a capacidade de voar livremente pela região.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+ORAS',
      screenshots: [
        'https://via.placeholder.com/640x480?text=ORAS+Screenshot+1',
        'https://via.placeholder.com/640x480?text=ORAS+Screenshot+2',
      ],
      features: [
        'Mega Evolução expandida',
        'Delta Episode',
        'Super-Secret Bases',
        'DexNav',
      ],
      reception: {
        score: 8.4,
        review:
          'Omega Ruby e Alpha Sapphire trouxeram Hoenn para uma nova geração com visuais impressionantes e adições significativas à história original.',
      },
      sales: 14.46,
    },
    {
      id: 15,
      title: 'Pokémon Sun & Moon',
      releaseYear: 2016,
      platforms: ['Nintendo 3DS'],
      category: 'main-series',
      generation: 7,
      description:
        'A sétima geração de jogos Pokémon introduziu 81 novos Pokémon e a região de Alola, inspirada no Havaí. Estes jogos abandonaram o sistema tradicional de ginásios em favor das Island Trials.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Sun+Moon',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Sun+Moon+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Sun+Moon+Screenshot+2',
      ],
      features: ['Formas Alola', 'Z-Moves', 'Island Trials', 'Ultra Beasts'],
      reception: {
        score: 8.7,
        review:
          'Sun e Moon renovaram a fórmula da série com a remoção dos ginásios tradicionais e uma narrativa mais focada em personagens e cultura regional.',
      },
      sales: 16.2,
    },
    // Adicionando jogos de Nintendo Switch
    {
      id: 16,
      title: "Pokémon Let's Go, Pikachu! & Let's Go, Eevee!",
      releaseYear: 2018,
      platforms: ['Nintendo Switch'],
      category: 'remake',
      generation: 7,
      description:
        'Remakes de Pokémon Yellow para o Nintendo Switch, com mecânicas inspiradas em Pokémon GO e gráficos HD. Os jogadores podem transferir Pokémon do Pokémon GO para estes jogos.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Lets+Go',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Lets+Go+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Lets+Go+Screenshot+2',
      ],
      features: [
        'Captura estilo Pokémon GO',
        'Pokémon seguindo o jogador',
        'Compatibilidade com Pokémon GO',
        'Modo cooperativo local',
      ],
      reception: {
        score: 8.0,
        review:
          "Let's Go, Pikachu! e Let's Go, Eevee! são remakes acessíveis que combinam elementos nostálgicos com mecânicas modernas, servindo como uma ponte entre Pokémon GO e os jogos principais.",
      },
      sales: 14.33,
    },
    {
      id: 17,
      title: 'Pokémon Sword & Shield',
      releaseYear: 2019,
      platforms: ['Nintendo Switch'],
      category: 'main-series',
      generation: 8,
      description:
        'A oitava geração de jogos Pokémon introduziu a região de Galar, inspirada no Reino Unido, e o fenômeno Dynamax que permite que os Pokémon cresçam para tamanhos gigantescos durante as batalhas.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Sword+Shield',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Sword+Shield+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Sword+Shield+Screenshot+2',
      ],
      features: [
        'Wild Area',
        'Dynamax e Gigantamax',
        'Raids de Max',
        'Pokémon Camp',
      ],
      reception: {
        score: 8.0,
        review:
          'Sword e Shield trouxeram Pokémon para o Nintendo Switch com áreas abertas expansivas e o espetacular fenômeno Dynamax, embora tenham recebido críticas pela ausência do Pokédex Nacional completo.',
      },
      sales: 24.27,
    },
    {
      id: 18,
      title: 'Pokémon Brilliant Diamond & Shining Pearl',
      releaseYear: 2021,
      platforms: ['Nintendo Switch'],
      category: 'remake',
      generation: 8,
      description:
        'Remakes fiéis de Diamond e Pearl para o Nintendo Switch, mantendo o estilo artístico chibi para os personagens enquanto moderniza a jogabilidade e os visuais.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+BDSP',
      screenshots: [
        'https://via.placeholder.com/640x480?text=BDSP+Screenshot+1',
        'https://via.placeholder.com/640x480?text=BDSP+Screenshot+2',
      ],
      features: [
        'Grand Underground expandido',
        'Super Contest Shows',
        'Hideaways com Pokémon raros',
        'Customização de personagem',
      ],
      reception: {
        score: 7.3,
        review:
          'Brilliant Diamond e Shining Pearl são remakes fiéis que mantêm a essência dos jogos originais, mas foram criticados por não incorporarem algumas das melhorias da série moderna.',
      },
      sales: 14.92,
    },
    {
      id: 19,
      title: 'Pokémon Legends: Arceus',
      releaseYear: 2022,
      platforms: ['Nintendo Switch'],
      category: 'spin-off',
      generation: 8,
      description:
        'Um jogo de ação e RPG ambientado no passado da região de Sinnoh, então conhecida como Hisui. O jogo apresenta uma abordagem de mundo semi-aberto e mecânicas de captura em tempo real.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Legends+Arceus',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Legends+Arceus+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Legends+Arceus+Screenshot+2',
      ],
      features: [
        'Mundo semi-aberto',
        'Captura em tempo real',
        'Formas Hisuian',
        'Sistema de pesquisa Pokédex',
      ],
      reception: {
        score: 8.4,
        review:
          'Legends: Arceus foi elogiado por sua abordagem inovadora à fórmula Pokémon, oferecendo um mundo mais aberto e dinâmico, embora com algumas limitações técnicas.',
      },
      sales: 13.91,
    },
    {
      id: 20,
      title: 'Pokémon Scarlet & Violet',
      releaseYear: 2022,
      platforms: ['Nintendo Switch'],
      category: 'main-series',
      generation: 9,
      description:
        'A nona geração de jogos Pokémon introduziu a região de Paldea, inspirada na Península Ibérica, e o primeiro mundo verdadeiramente aberto da série principal.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Scarlet+Violet',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Scarlet+Violet+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Scarlet+Violet+Screenshot+2',
      ],
      features: [
        'Mundo aberto',
        'Teracristalização',
        'Três histórias principais',
        'Exploração cooperativa online',
      ],
      reception: {
        score: 7.2,
        review:
          'Scarlet e Violet trouxeram uma experiência de mundo aberto inovadora para a série, mas foram prejudicados por problemas técnicos significativos no lançamento.',
      },
      sales: 22.1,
    },
    // Jogos Mobile
    {
      id: 21,
      title: 'Pokémon GO',
      releaseYear: 2016,
      platforms: ['Mobile'],
      category: 'mobile',
      generation: 7,
      description:
        'Um jogo de realidade aumentada para dispositivos móveis que permite aos jogadores capturar, batalhar e treinar Pokémon no mundo real usando GPS.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+GO',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Pokemon+GO+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Pokemon+GO+Screenshot+2',
      ],
      features: [
        'Realidade aumentada',
        'Exploração baseada em GPS',
        'Raids',
        'Eventos sazonais',
      ],
      reception: {
        score: 8.0,
        review:
          'Pokémon GO revolucionou os jogos móveis com sua mistura única de realidade aumentada e exploração do mundo real, tornando-se um fenômeno cultural global.',
      },
      sales: undefined, // Jogo gratuito com compras no aplicativo
    },
    {
      id: 22,
      title: 'Pokémon Masters EX',
      releaseYear: 2019,
      platforms: ['Mobile'],
      category: 'mobile',
      generation: 8,
      description:
        'Um jogo de RPG para dispositivos móveis focado em batalhas 3v3 com treinadores famosos da série Pokémon.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Masters+EX',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Masters+EX+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Masters+EX+Screenshot+2',
      ],
      features: [
        'Batalhas 3v3',
        'Sync Pairs',
        'Modo história',
        'Eventos especiais',
      ],
      reception: {
        score: 7.5,
        review:
          'Pokémon Masters EX oferece uma experiência de batalha única com foco nos treinadores icônicos da série, embora seja limitado em termos de variedade de conteúdo.',
      },
      sales: undefined,
    },
    {
      id: 23,
      title: 'Pokémon Unite',
      releaseYear: 2021,
      platforms: ['Nintendo Switch', 'Mobile'],
      category: 'mobile',
      generation: 8,
      description:
        'Um jogo de batalha de arena online multijogador (MOBA) onde duas equipes de cinco jogadores competem para marcar pontos e derrotar a equipe adversária.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Unite',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Unite+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Unite+Screenshot+2',
      ],
      features: [
        'Batalhas 5v5',
        'Diferentes arenas',
        'Itens e habilidades únicas',
        'Eventos sazonais',
      ],
      reception: {
        score: 7.0,
        review:
          'Pokémon Unite oferece uma entrada acessível no gênero MOBA com personagens familiares, embora tenha sido criticado por seu modelo de monetização.',
      },
      sales: undefined,
    },
    {
      id: 24,
      title: 'Pokémon Café ReMix',
      releaseYear: 2020,
      platforms: ['Nintendo Switch', 'Mobile'],
      category: 'mobile',
      generation: 8,
      description:
        'Um jogo de quebra-cabeça onde os jogadores gerenciam um café para Pokémon, resolvendo puzzles para preparar bebidas e pratos.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Cafe+ReMix',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Cafe+ReMix+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Cafe+ReMix+Screenshot+2',
      ],
      features: [
        'Puzzles de conexão',
        'Recrutamento de Pokémon',
        'Decoração do café',
        'Eventos temáticos',
      ],
      reception: {
        score: 7.2,
        review:
          'Pokémon Café ReMix é um jogo de quebra-cabeça charmoso e relaxante com um estilo artístico adorável, embora possa se tornar repetitivo com o tempo.',
      },
      sales: undefined,
    },
    // Spin-offs clássicos
    {
      id: 25,
      title: 'Pokémon Stadium',
      releaseYear: 1999,
      platforms: ['Nintendo 64'],
      category: 'spin-off',
      generation: 1,
      description:
        'Um jogo de batalha 3D para Nintendo 64 que permite aos jogadores lutar com Pokémon em arenas tridimensionais. Também inclui minigames e compatibilidade com os jogos de Game Boy.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Stadium',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Stadium+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Stadium+Screenshot+2',
      ],
      features: [
        'Batalhas 3D',
        'Minigames',
        'Compatibilidade com Game Boy',
        'Modo Ginásio',
      ],
      reception: {
        score: 8.2,
        review:
          'Pokémon Stadium trouxe as batalhas Pokémon para o 3D pela primeira vez, com visuais impressionantes para a época e minigames divertidos.',
      },
      sales: 5.46,
    },
    {
      id: 26,
      title: 'Pokémon Snap',
      releaseYear: 1999,
      platforms: ['Nintendo 64'],
      category: 'spin-off',
      generation: 1,
      description:
        'Um jogo de simulação de fotografia onde os jogadores tiram fotos de Pokémon em seus habitats naturais enquanto são transportados em um veículo sobre trilhos.',
      coverImage: 'https://via.placeholder.com/300x200?text=Pokemon+Snap',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Snap+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Snap+Screenshot+2',
      ],
      features: [
        'Fotografia Pokémon',
        'Ambientes interativos',
        'Sistema de pontuação',
        'Pokémon raros',
      ],
      reception: {
        score: 7.8,
        review:
          'Pokémon Snap ofereceu uma experiência única e relaxante, permitindo aos jogadores observar Pokémon em seus habitats naturais pela primeira vez.',
      },
      sales: 3.63,
    },
    {
      id: 27,
      title: 'Pokémon Mystery Dungeon: Red/Blue Rescue Team',
      releaseYear: 2005,
      platforms: ['Game Boy Advance', 'Nintendo DS'],
      category: 'spin-off',
      generation: 3,
      description:
        'Um RPG roguelike onde o jogador é transformado em um Pokémon e deve formar equipes de resgate para ajudar outros Pokémon em apuros em masmorras geradas aleatoriamente.',
      coverImage:
        'https://via.placeholder.com/300x200?text=Pokemon+Mystery+Dungeon',
      screenshots: [
        'https://via.placeholder.com/640x480?text=Mystery+Dungeon+Screenshot+1',
        'https://via.placeholder.com/640x480?text=Mystery+Dungeon+Screenshot+2',
      ],
      features: [
        'Masmorras aleatórias',
        'Jogador como Pokémon',
        'Equipes de resgate',
        'História emocional',
      ],
      reception: {
        score: 7.9,
        review:
          'Pokémon Mystery Dungeon surpreendeu os fãs com sua narrativa emocional e profunda, oferecendo uma perspectiva única do mundo Pokémon.',
      },
      sales: 5.92,
    },
    {
      id: 28,
      title: 'New Pokémon Snap',
      releaseYear: 2021,
      platforms: ['Nintendo Switch'],
      category: 'spin-off',
      generation: 8,
      description:
        'Uma sequência do clássico Pokémon Snap, onde os jogadores fotografam Pokémon em diversos ambientes na região de Lental, com gráficos modernos e mecânicas expandidas.',
      coverImage: 'https://via.placeholder.com/300x200?text=New+Pokemon+Snap',
      screenshots: [
        'https://via.placeholder.com/640x480?text=New+Snap+Screenshot+1',
        'https://via.placeholder.com/640x480?text=New+Snap+Screenshot+2',
      ],
      features: [
        'Fotografia em HD',
        'Fenômeno Illumina',
        'Compartilhamento online',
        'Rotas alternativas',
      ],
      reception: {
        score: 8.1,
        review:
          'New Pokémon Snap reviveu o conceito do original com visuais deslumbrantes e mecânicas aprimoradas, satisfazendo tanto fãs nostálgicos quanto novos jogadores.',
      },
      sales: 2.4,
    },
  ];

  getGames(): PokemonGame[] {
    return this.games;
  }
}
