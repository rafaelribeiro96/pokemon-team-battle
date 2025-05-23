/* pokemon-icons.service.ts */
import { Injectable } from '@angular/core';

export interface PokemonIcon {
  id: string;
  name: string;
  path: string;
  category: 'pokemon' | 'item' | 'interface' | 'type' | 'other';
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PokemonIconsService {
  private icons: PokemonIcon[] = [
    // Pokémon
    {
      id: 'bulbasaur',
      name: 'Bulbasaur',
      path: 'assets/icons/bulbasaur_icon-icons.com_67580.svg',
      category: 'pokemon',
      tags: ['grass', 'poison', 'starter'],
    },
    {
      id: 'charmander',
      name: 'Charmander',
      path: 'assets/icons/charmander_icon-icons.com_67576.svg',
      category: 'pokemon',
      tags: ['fire', 'starter'],
    },
    {
      id: 'squirtle',
      name: 'Squirtle',
      path: 'assets/icons/squirtle_icon-icons.com_67504.svg',
      category: 'pokemon',
      tags: ['water', 'starter'],
    },
    {
      id: 'pikachu',
      name: 'Pikachu',
      path: 'assets/icons/pikachu_icon-icons.com_67535.svg',
      category: 'pokemon',
      tags: ['electric', 'mascot'],
    },
    {
      id: 'eevee',
      name: 'Eevee',
      path: 'assets/icons/eevee_icon-icons.com_67563.svg',
      category: 'pokemon',
      tags: ['normal', 'evolution'],
    },
    {
      id: 'jigglypuff',
      name: 'Jigglypuff',
      path: 'assets/icons/jigglypuff_icon-icons.com_67550.svg',
      category: 'pokemon',
      tags: ['normal', 'fairy'],
    },
    {
      id: 'meowth',
      name: 'Meowth',
      path: 'assets/icons/meowth_icon-icons.com_67543.svg',
      category: 'pokemon',
      tags: ['normal'],
    },
    {
      id: 'mew',
      name: 'Mew',
      path: 'assets/icons/mew_icon-icons.com_67542.svg',
      category: 'pokemon',
      tags: ['psychic', 'legendary'],
    },
    {
      id: 'pidgey',
      name: 'Pidgey',
      path: 'assets/icons/pidgey_icon-icons.com_67536.svg',
      category: 'pokemon',
      tags: ['normal', 'flying'],
    },
    {
      id: 'psyduck',
      name: 'Psyduck',
      path: 'assets/icons/psyduck_icon-icons.com_67509.svg',
      category: 'pokemon',
      tags: ['water', 'psychic'],
    },

    // Itens
    {
      id: 'pokeball',
      name: 'Pokeball',
      path: 'assets/icons-svg/pokebola.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'open-pokeball',
      name: 'Open Pokeball',
      path: 'assets/icons-svg/pokebola2.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'great-ball',
      name: 'Great Ball',
      path: 'assets/icons/Great_Ball_icon-icons.com_67552.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'ultra-ball',
      name: 'Ultra Ball',
      path: 'assets/icons/Ultra_Ball_icon-icons.com_67500.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'master-ball',
      name: 'Master Ball',
      path: 'assets/icons/Master_Ball_icon-icons.com_67545.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'pokeballs',
      name: 'Pokeballs',
      path: 'assets/icons/Pokeballs_icon-icons.com_67532.svg',
      category: 'item',
      tags: ['ball', 'capture', 'collection'],
    },
    {
      id: 'potion',
      name: 'Potion',
      path: 'assets/icons/Potion_icon-icons.com_67510.svg',
      category: 'item',
      tags: ['healing', 'medicine'],
    },
    {
      id: 'poison-heal',
      name: 'Poison Heal',
      path: 'assets/icons/Poison_Heal_icon-icons.com_67534.svg',
      category: 'item',
      tags: ['healing', 'medicine', 'status'],
    },
    {
      id: 'egg',
      name: 'Pokémon Egg',
      path: 'assets/icons/Pokemon_Egg_icon-icons.com_67525.svg',
      category: 'item',
      tags: ['breeding', 'hatching'],
    },
    {
      id: 'egg-canister',
      name: 'Egg Canister',
      path: 'assets/icons/Egg_Canister_icon-icons.com_67561.svg',
      category: 'item',
      tags: ['breeding', 'hatching'],
    },
    {
      id: 'hatching-egg',
      name: 'Hatching Egg',
      path: 'assets/icons/hatching_egg_icon-icons.com_67551.svg',
      category: 'item',
      tags: ['breeding', 'hatching'],
    },
    {
      id: 'coin',
      name: 'Coin',
      path: 'assets/icons/Coin_icon-icons.com_67575.svg',
      category: 'item',
      tags: ['currency', 'money'],
    },
    {
      id: 'coin-bag',
      name: 'Coin Bag',
      path: 'assets/icons/Coin_Bag_icon-icons.com_67574.svg',
      category: 'item',
      tags: ['currency', 'money'],
    },
    {
      id: 'crown',
      name: 'Crown',
      path: 'assets/icons-svg/coroa.svg',
      category: 'item',
      tags: ['achievement', 'reward'],
    },
    {
      id: 'crystal',
      name: 'Crystal',
      path: 'assets/icons/Crystal_icon-icons.com_67566.svg',
      category: 'item',
      tags: ['special', 'evolution'],
    },
    {
      id: 'badge',
      name: 'Badge',
      path: 'assets/icons-svg/estrela.svg',
      category: 'item',
      tags: ['achievement', 'gym'],
    },
    {
      id: 'fainted-pokeball',
      name: 'Fainted Pokeball',
      path: 'assets/icons-svg/pokebolaDesmaiada.svg',
      category: 'item',
      tags: ['ball', 'fainted'],
    },
    {
      id: 'damage',
      name: 'Damage',
      path: 'assets/icons-svg/xlosangosvermelhos.svg',
      category: 'item',
      tags: ['battle', 'damage'],
    },

    // Interface
    {
      id: 'bag',
      name: 'Bag',
      path: 'assets/icons/Bag_icon-icons.com_67588.svg',
      category: 'interface',
      tags: ['inventory', 'items'],
    },
    {
      id: 'battle',
      name: 'Battle',
      path: 'assets/icons/Battle_icon-icons.com_67586.svg',
      category: 'interface',
      tags: ['fight', 'versus'],
    },
    {
      id: 'berries',
      name: 'Berries',
      path: 'assets/icons/Berries_icon-icons.com_67584.svg',
      category: 'interface',
      tags: ['item', 'food'],
    },
    {
      id: 'fight',
      name: 'Fight',
      path: 'assets/icons/fight_icon-icons.com_67557.svg',
      category: 'interface',
      tags: ['battle', 'versus'],
    },
    {
      id: 'mobile-phone',
      name: 'Mobile Phone',
      path: 'assets/icons/Mobile_Phone_icon-icons.com_67541.svg',
      category: 'interface',
      tags: ['device', 'communication'],
    },
    {
      id: 'pokedex',
      name: 'Pokedex',
      path: 'assets/icons/Pokedex_tool_icon-icons.com_67529.svg',
      category: 'interface',
      tags: ['device', 'information'],
    },
    {
      id: 'pokemon-location',
      name: 'Pokémon Location',
      path: 'assets/icons/Pokemon_Location_icon-icons.com_67519.svg',
      category: 'interface',
      tags: ['map', 'navigation'],
    },
    {
      id: 'pokemon-go-locator',
      name: 'Pokémon Go Locator',
      path: 'assets/icons/Pokemon_Go_Locator_icon-icons.com_67521.svg',
      category: 'interface',
      tags: ['map', 'navigation'],
    },
    {
      id: 'settings',
      name: 'Settings',
      path: 'assets/icons/Settings_icon-icons.com_67507.svg',
      category: 'interface',
      tags: ['configuration', 'options'],
    },
    {
      id: 'cancel',
      name: 'Cancel',
      path: 'assets/icons-svg/cancel.svg',
      category: 'interface',
      tags: ['cancel', 'close'],
    },
    {
      id: 'reset',
      name: 'Reset',
      path: 'assets/icons-svg/restart.svg',
      category: 'interface',
      tags: ['reset', 'restart'],
    },
    {
      id: 'question',
      name: 'Question Mark',
      path: 'assets/icons-svg/interrogação.svg',
      category: 'interface',
      tags: ['unknown', 'placeholder'],
    },

    // Ginásios
    {
      id: 'fire-gym',
      name: 'Ginásio de Fogo',
      path: 'assets/icons-svg/ginasiofogo.svg',
      category: 'interface',
      tags: ['gym', 'fire', 'red'],
    },
    {
      id: 'water-gym',
      name: 'Ginásio de Água',
      path: 'assets/icons-svg/ginasioagua.svg',
      category: 'interface',
      tags: ['gym', 'water', 'blue'],
    },
    {
      id: 'electric-gym',
      name: 'Ginásio Elétrico',
      path: 'assets/icons-svg/ginasioeletrico.svg',
      category: 'interface',
      tags: ['gym', 'electric', 'yellow'],
    },
    {
      id: 'grass-gym',
      name: 'Ginásio de Planta',
      path: 'assets/icons-svg/ginasioplanta.svg',
      category: 'interface',
      tags: ['gym', 'grass', 'green'],
    },
    {
      id: 'psychic-gym',
      name: 'Ginásio Psíquico',
      path: 'assets/icons-svg/ginasiopsiquico.svg',
      category: 'interface',
      tags: ['gym', 'psychic', 'purple'],
    },
    {
      id: 'rock-gym',
      name: 'Ginásio de Pedra',
      path: 'assets/icons-svg/ginasiopedra.svg',
      category: 'interface',
      tags: ['gym', 'rock', 'brown'],
    },
    {
      id: 'poison-gym',
      name: 'Ginásio Venenoso',
      path: 'assets/icons-svg/ginasioveneno.svg',
      category: 'interface',
      tags: ['gym', 'poison', 'purple'],
    },
    {
      id: 'ground-gym',
      name: 'Ginásio de Terra',
      path: 'assets/icons-svg/ginasioterra.svg',
      category: 'interface',
      tags: ['gym', 'ground', 'brown'],
    },

    // Treinadores
    {
      id: 'trainer-red',
      name: 'Treinador Vermelho',
      path: 'assets/icons-svg/treinadorred.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'red'],
    },
    {
      id: 'trainer-blue',
      name: 'Treinador Azul',
      path: 'assets/icons-svg/treinadorblue.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'blue'],
    },
    {
      id: 'trainer-leaf',
      name: 'Treinadora Verde',
      path: 'assets/icons-svg/treinadorgreen.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'green', 'female'],
    },
    {
      id: 'trainer-gold',
      name: 'Treinador Dourado',
      path: 'assets/icons-svg/treinadoryellow.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'gold'],
    },
    {
      id: 'trainer-silver',
      name: 'Treinador Prateado',
      path: 'assets/icons-svg/treinadorgray.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'silver'],
    },
    {
      id: 'trainer-crystal',
      name: 'Treinadora Cristal',
      path: 'assets/icons-svg/treinadorblue2.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'crystal', 'female'],
    },
    {
      id: 'trainer-ruby',
      name: 'Treinador Rubi',
      path: 'assets/icons-svg/treinadorred2.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'ruby'],
    },
    {
      id: 'trainer-sapphire',
      name: 'Treinadora Safira',
      path: 'assets/icons-svg/treinadorblue3.svg',
      category: 'interface',
      tags: ['trainer', 'character', 'sapphire', 'female'],
    },

    // Tipos - usando os ícones de ginásio para os tipos que não têm ícones específicos
    {
      id: 'normal-type',
      name: 'Tipo Normal',
      path: 'assets/icons-svg/pokemontiponormal.svg',
      category: 'type',
      tags: ['element', 'normal'],
    },
    {
      id: 'fire-type',
      name: 'Tipo Fogo',
      path: 'assets/icons-svg/ginasiofogo.svg',
      category: 'type',
      tags: ['element', 'fire'],
    },
    {
      id: 'water-type',
      name: 'Tipo Água',
      path: 'assets/icons-svg/ginasioagua.svg',
      category: 'type',
      tags: ['element', 'water'],
    },
    {
      id: 'grass-type',
      name: 'Tipo Planta',
      path: 'assets/icons-svg/ginasioplanta.svg',
      category: 'type',
      tags: ['element', 'grass'],
    },
    {
      id: 'electric-type',
      name: 'Tipo Elétrico',
      path: 'assets/icons-svg/ginasioeletrico.svg',
      category: 'type',
      tags: ['element', 'electric'],
    },
    {
      id: 'ice-type',
      name: 'Tipo Gelo',
      path: 'assets/icons-svg/ginasioagua.svg', // Usando água como substituto para gelo
      category: 'type',
      tags: ['element', 'ice'],
    },
    {
      id: 'fighting-type',
      name: 'Tipo Lutador',
      path: 'assets/icons-svg/ginasiofogo.svg', // Usando fogo como substituto para lutador
      category: 'type',
      tags: ['element', 'fighting'],
    },
    {
      id: 'poison-type',
      name: 'Tipo Venenoso',
      path: 'assets/icons-svg/ginasioveneno.svg',
      category: 'type',
      tags: ['element', 'poison'],
    },
    {
      id: 'ground-type',
      name: 'Tipo Terra',
      path: 'assets/icons-svg/ginasioterra.svg',
      category: 'type',
      tags: ['element', 'ground'],
    },
    {
      id: 'flying-type',
      name: 'Tipo Voador',
      path: 'assets/icons-svg/ginasioeletrico.svg', // Usando elétrico como substituto para voador
      category: 'type',
      tags: ['element', 'flying'],
    },
    {
      id: 'psychic-type',
      name: 'Tipo Psíquico',
      path: 'assets/icons-svg/ginasiopsiquico.svg',
      category: 'type',
      tags: ['element', 'psychic'],
    },
    {
      id: 'bug-type',
      name: 'Tipo Inseto',
      path: 'assets/icons-svg/ginasioplanta.svg', // Usando planta como substituto para inseto
      category: 'type',
      tags: ['element', 'bug'],
    },
    {
      id: 'rock-type',
      name: 'Tipo Pedra',
      path: 'assets/icons-svg/ginasiopedra.svg',
      category: 'type',
      tags: ['element', 'rock'],
    },
    {
      id: 'ghost-type',
      name: 'Tipo Fantasma',
      path: 'assets/icons-svg/ginasiopsiquico.svg', // Usando psíquico como substituto para fantasma
      category: 'type',
      tags: ['element', 'ghost'],
    },
    {
      id: 'dragon-type',
      name: 'Tipo Dragão',
      path: 'assets/icons-svg/ginasiofogo.svg', // Usando fogo como substituto para dragão
      category: 'type',
      tags: ['element', 'dragon'],
    },
    {
      id: 'dark-type',
      name: 'Tipo Sombrio',
      path: 'assets/icons-svg/ginasioveneno.svg', // Usando veneno como substituto para sombrio
      category: 'type',
      tags: ['element', 'dark'],
    },
    {
      id: 'steel-type',
      name: 'Tipo Metálico',
      path: 'assets/icons-svg/ginasiopedra.svg', // Usando pedra como substituto para metálico
      category: 'type',
      tags: ['element', 'steel'],
    },
    {
      id: 'fairy-type',
      name: 'Tipo Fada',
      path: 'assets/icons-svg/ginasiopsiquico.svg', // Usando psíquico como substituto para fada
      category: 'type',
      tags: ['element', 'fairy'],
    },
  ];

  constructor() {}

  /**
   * Retorna todos os ícones disponíveis
   */
  getAllIcons(): PokemonIcon[] {
    return [...this.icons];
  }

  /**
   * Retorna um ícone pelo seu ID
   */
  getIconById(id: string): PokemonIcon | undefined {
    return this.icons.find((icon) => icon.id === id);
  }

  /**
   * Retorna ícones por categoria
   */
  getIconsByCategory(
    category: 'pokemon' | 'item' | 'interface' | 'type' | 'other'
  ): PokemonIcon[] {
    return this.icons.filter((icon) => icon.category === category);
  }

  /**
   * Retorna ícones que contenham a tag especificada
   */
  getIconsByTag(tag: string): PokemonIcon[] {
    return this.icons.filter((icon) =>
      icon.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Busca ícones por nome, categoria ou tags
   */
  searchIcons(query: string): PokemonIcon[] {
    const lowerQuery = query.toLowerCase();
    return this.icons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(lowerQuery) ||
        icon.id.toLowerCase().includes(lowerQuery) ||
        icon.category.toLowerCase().includes(lowerQuery) ||
        icon.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
