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
    {
      id: 'articuno',
      name: 'Articuno',
      path: 'assets/icons/pokemon_articuro_icon-icons.com_67526.svg',
      category: 'pokemon',
      tags: ['ice', 'flying', 'legendary'],
    },
    {
      id: 'moltres',
      name: 'Moltres',
      path: 'assets/icons/pokemon_moltres_icon-icons.com_67518.svg',
      category: 'pokemon',
      tags: ['fire', 'flying', 'legendary'],
    },
    {
      id: 'zapdos',
      name: 'Zapdos',
      path: 'assets/icons/pokemon_zapdos_icon-icons.com_67513.svg',
      category: 'pokemon',
      tags: ['electric', 'flying', 'legendary'],
    },

    // Itens
    {
      id: 'pokeball',
      name: 'Pokeball',
      path: 'assets/icons/Pokeball_icon-icons.com_67533.svg',
      category: 'item',
      tags: ['ball', 'capture'],
    },
    {
      id: 'open-pokeball',
      name: 'Open Pokeball',
      path: 'assets/icons/Open_Pokeball_icon-icons.com_67538.svg',
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
      path: 'assets/icons/Crown_icon-icons.com_67567.svg',
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

    // Tipos
    {
      id: 'water-type',
      name: 'Water Type',
      path: 'assets/icons/Pokemon_Go-04_icon-agua.com_67620.svg',
      category: 'type',
      tags: ['element', 'water'],
    },
    {
      id: 'fire-type',
      name: 'Fire Type',
      path: 'assets/icons/Pokemon_Go-19_icon-fogo.com_67638.svg',
      category: 'type',
      tags: ['element', 'fire'],
    },
    {
      id: 'type-1',
      name: 'Type Icon 1',
      path: 'assets/icons/Pokemon_Go-11_icon-icons.com_67644.svg',
      category: 'type',
      tags: ['element'],
    },
    {
      id: 'type-2',
      name: 'Type Icon 2',
      path: 'assets/icons/Pokemon_Go-15_icon-icons.com_67646.svg',
      category: 'type',
      tags: ['element'],
    },
    {
      id: 'type-3',
      name: 'Type Icon 3',
      path: 'assets/icons/Pokemon_Go-16_icon-icons.com_67643.svg',
      category: 'type',
      tags: ['element'],
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
