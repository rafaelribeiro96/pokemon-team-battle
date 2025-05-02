/* battle.component.ts */
import { Component, signal, ViewChild } from '@angular/core';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { BattleReportComponent } from '../../components/battle-report/battle-report.component';
import { BattleHeaderComponent } from '../../components/battle-header/battle-header.component';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { ScoreboardComponent } from '../../components/scoreboard/scoreboard.component';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../../components/pokemon-icon/pokemon-icon.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  imports: [
    TeamBuilderComponent,
    MatButtonModule,
    CommonModule,
    BattleReportComponent,
    BattleHeaderComponent,
    PokemonCardComponent,
    ScoreboardComponent,
    PokemonIconsModule,
    PokemonIconComponent,
  ],
  animations: [
    trigger('battleStart', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'scale(0.5)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition('hidden => visible', [animate('0.5s ease-out')]),
    ]),
    trigger('vsAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'scale(0.2) rotate(-20deg)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'scale(1) rotate(0)',
        })
      ),
      transition('hidden => visible', [
        animate('0.7s 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'),
      ]),
    ]),
    trigger('iconAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.5)' })),
      ]),
    ]),
  ],
})
export class BattleComponent {
  @ViewChild('teamOneBuilder') teamOneBuilder!: TeamBuilderComponent;
  @ViewChild('teamTwoBuilder') teamTwoBuilder!: TeamBuilderComponent;

  teamOne = signal<Pokemon[]>([]);
  teamTwo = signal<Pokemon[]>([]);
  battleLog = signal<string[]>([]);
  currentBattle = signal<{
    p1: Pokemon | null;
    p2: Pokemon | null;
    p1IsAttacking?: boolean;
    p2IsAttacking?: boolean;
    p1IsDefending?: boolean;
    p2IsDefending?: boolean;
    p1IsSuperEffective?: boolean;
    p2IsSuperEffective?: boolean;
  }>({
    p1: null,
    p2: null,
  });
  battleInProgress = signal(false);
  battleEnded = signal(false);
  turnNumber = signal(0);
  winner = signal<string | null>(null);
  teamOneScore = signal(0);
  teamTwoScore = signal(0);
  battleStartState = 'hidden';
  vsState = 'hidden';
  selectedGym = 'fire-gym'; // Pode ser 'fire-gym', 'water-gym', ou 'electric-gym'

  // Novas propriedades para animações de ícones
  showAttackIcon = false;
  attackIconPosition = { x: 0, y: 0 };
  attackIconType = '';

  // Propriedade para o Pokémon mais forte da batalha
  strongestPokemon: Pokemon | null = null;

  // Propriedade para animação de novo Pokémon
  newPokemonAnimation = {
    show: false,
    position: { x: 0, y: 0 },
    player: 1, // 1 ou 2
  };

  // Flag para controlar o cancelamento da batalha
  private battleCancelled = false;

  // Mapeamento de tipos e suas fraquezas
  typeWeaknesses: { [key: string]: string[] } = {
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    electric: ['ground'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    fairy: ['poison', 'steel'],
    normal: ['fighting'],
  };

  setTeamOne(team: Pokemon[]) {
    this.teamOne.set(team);
    this.updateStrongestPokemon([...team, ...this.teamTwo()]);
  }

  setTeamTwo(team: Pokemon[]) {
    this.teamTwo.set(team);
    this.updateStrongestPokemon([...this.teamOne(), ...team]);
  }

  async startBattle() {
    if (this.teamOne().length === 0 || this.teamTwo().length === 0) {
      alert(
        'Ambas as equipes precisam estar completas para iniciar a batalha!'
      );
      return;
    }

    // Mostrar animação de início de batalha com o ícone do ginásio selecionado
    this.showBattleStartAnimation();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Resetar a flag de cancelamento
    this.battleCancelled = false;
    this.battleInProgress.set(true);
    this.battleEnded.set(false);
    this.turnNumber.set(1);
    this.winner.set(null);
    this.teamOneScore.set(0);
    this.teamTwoScore.set(0);
    this.battleLog.set([]);

    let teamOnePokemons = [...this.teamOne()].map((p) => ({
      ...p,
      stats: { ...p.stats },
      isFainted: false,
      isAttacking: false,
    }));
    let teamTwoPokemons = [...this.teamTwo()].map((p) => ({
      ...p,
      stats: { ...p.stats },
      isFainted: false,
      isAttacking: false,
    }));

    // Atualizar o Pokémon mais forte da batalha
    this.updateStrongestPokemon([...teamOnePokemons, ...teamTwoPokemons]);

    // Loop principal da batalha com verificação de cancelamento
    while (
      teamOnePokemons.length > 0 &&
      teamTwoPokemons.length > 0 &&
      !this.battleCancelled
    ) {
      const p1Index = Math.floor(Math.random() * teamOnePokemons.length);
      const p2Index = Math.floor(Math.random() * teamTwoPokemons.length);

      const p1 = teamOnePokemons[p1Index];
      const p2 = teamTwoPokemons[p2Index];

      // Mostrar animação de novo Pokémon selecionado
      this.showNewPokemonAnimation(p1, 1);
      await new Promise((resolve) => setTimeout(resolve, 800));
      this.showNewPokemonAnimation(p2, 2);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const logEntry = `Turno ${this.turnNumber()}: ${p1.name} enfrenta ${
        p2.name
      }`;
      this.battleLog.update((currentLog) => [...currentLog, logEntry]);

      this.currentBattle.set({
        p1,
        p2,
        p1IsAttacking: false,
        p2IsAttacking: false,
        p1IsDefending: false,
        p2IsDefending: false,
        p1IsSuperEffective: false,
        p2IsSuperEffective: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (this.battleCancelled) break;

      const firstAttacker = p1.stats.speed >= p2.stats.speed ? p1 : p2;
      const secondAttacker = firstAttacker === p1 ? p2 : p1;

      // Primeiro ataque
      const isSuperEffective1 = this.isAttackSuperEffective(
        firstAttacker,
        secondAttacker
      );

      if (firstAttacker === p1) {
        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: true,
          p2IsAttacking: false,
          p1IsDefending: false,
          p2IsDefending: true,
          p1IsSuperEffective: false,
          p2IsSuperEffective: isSuperEffective1,
        });

        // Mostrar animação de ataque com ícone
        this.showAttackAnimation(p1, p2, isSuperEffective1);
      } else {
        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: false,
          p2IsAttacking: true,
          p1IsDefending: true,
          p2IsDefending: false,
          p1IsSuperEffective: isSuperEffective1,
          p2IsSuperEffective: false,
        });

        // Mostrar animação de ataque com ícone
        this.showAttackAnimation(p2, p1, isSuperEffective1);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (this.battleCancelled) break;

      const damage1 = this.calculateDamage(
        firstAttacker,
        secondAttacker,
        isSuperEffective1
      );

      // Atualiza o HP diretamente no objeto do Pokémon
      secondAttacker.stats.hp = Math.max(0, secondAttacker.stats.hp - damage1);

      // Atualiza o objeto currentBattle para refletir a mudança de HP
      this.currentBattle.update((current) => ({
        ...current,
        p1: current.p1 === secondAttacker ? { ...secondAttacker } : current.p1,
        p2: current.p2 === secondAttacker ? { ...secondAttacker } : current.p2,
      }));

      const effectivenessText = isSuperEffective1 ? ' (SUPER EFETIVO!)' : '';
      this.battleLog.update((currentLog) => [
        ...currentLog,
        `${firstAttacker.name} ataca ${secondAttacker.name} e causa ${damage1} de dano!${effectivenessText}`,
      ]);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (this.battleCancelled) break;

      this.currentBattle.set({
        p1,
        p2,
        p1IsAttacking: false,
        p2IsAttacking: false,
        p1IsDefending: false,
        p2IsDefending: false,
        p1IsSuperEffective: false,
        p2IsSuperEffective: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (this.battleCancelled) break;

      if (secondAttacker === p1) {
        this.teamOneBuilder.updateTeamPokemon(secondAttacker);
      } else {
        this.teamTwoBuilder.updateTeamPokemon(secondAttacker);
      }

      if (secondAttacker.stats.hp <= 0) {
        secondAttacker.isFainted = true;
        this.battleLog.update((currentLog) => [
          ...currentLog,
          `${secondAttacker.name} desmaiou!`,
        ]);

        // Atualiza o objeto currentBattle para refletir o desmaio
        this.currentBattle.update((current) => ({
          ...current,
          p1:
            current.p1 === secondAttacker ? { ...secondAttacker } : current.p1,
          p2:
            current.p2 === secondAttacker ? { ...secondAttacker } : current.p2,
        }));

        if (secondAttacker === p1) {
          this.teamOneBuilder.updateTeamPokemon(secondAttacker);
          teamOnePokemons.splice(p1Index, 1);
          this.teamTwoScore.update((val) => val + 1);
        } else {
          this.teamTwoBuilder.updateTeamPokemon(secondAttacker);
          teamTwoPokemons.splice(p2Index, 1);
          this.teamOneScore.update((val) => val + 1);
        }
      } else {
        // Segundo ataque (se o segundo atacante ainda estiver consciente)
        const isSuperEffective2 = this.isAttackSuperEffective(
          secondAttacker,
          firstAttacker
        );

        if (secondAttacker === p1) {
          this.currentBattle.set({
            p1,
            p2,
            p1IsAttacking: true,
            p2IsAttacking: false,
            p1IsDefending: false,
            p2IsDefending: true,
            p1IsSuperEffective: false,
            p2IsSuperEffective: isSuperEffective2,
          });

          // Mostrar animação de ataque com ícone
          this.showAttackAnimation(p1, p2, isSuperEffective2);
        } else {
          this.currentBattle.set({
            p1,
            p2,
            p1IsAttacking: false,
            p2IsAttacking: true,
            p1IsDefending: true,
            p2IsDefending: false,
            p1IsSuperEffective: isSuperEffective2,
            p2IsSuperEffective: false,
          });

          // Mostrar animação de ataque com ícone
          this.showAttackAnimation(p2, p1, isSuperEffective2);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (this.battleCancelled) break;

        const damage2 = this.calculateDamage(
          secondAttacker,
          firstAttacker,
          isSuperEffective2
        );

        // Atualiza o HP diretamente no objeto do Pokémon
        firstAttacker.stats.hp = Math.max(0, firstAttacker.stats.hp - damage2);

        // Atualiza o objeto currentBattle para refletir a mudança de HP
        this.currentBattle.update((current) => ({
          ...current,
          p1: current.p1 === firstAttacker ? { ...firstAttacker } : current.p1,
          p2: current.p2 === firstAttacker ? { ...firstAttacker } : current.p2,
        }));

        const effectivenessText2 = isSuperEffective2 ? ' (SUPER EFETIVO!)' : '';
        this.battleLog.update((currentLog) => [
          ...currentLog,
          `${secondAttacker.name} ataca ${firstAttacker.name} e causa ${damage2} de dano!${effectivenessText2}`,
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (this.battleCancelled) break;

        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: false,
          p2IsAttacking: false,
          p1IsDefending: false,
          p2IsDefending: false,
          p1IsSuperEffective: false,
          p2IsSuperEffective: false,
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        if (this.battleCancelled) break;

        if (firstAttacker === p1) {
          this.teamOneBuilder.updateTeamPokemon(firstAttacker);
        } else {
          this.teamTwoBuilder.updateTeamPokemon(firstAttacker);
        }

        if (firstAttacker.stats.hp <= 0) {
          firstAttacker.isFainted = true;
          this.battleLog.update((currentLog) => [
            ...currentLog,
            `${firstAttacker.name} desmaiou!`,
          ]);

          // Atualiza o objeto currentBattle para refletir o desmaio
          this.currentBattle.update((current) => ({
            ...current,
            p1:
              current.p1 === firstAttacker ? { ...firstAttacker } : current.p1,
            p2:
              current.p2 === firstAttacker ? { ...firstAttacker } : current.p2,
          }));

          if (firstAttacker === p1) {
            this.teamOneBuilder.updateTeamPokemon(firstAttacker);
            teamOnePokemons.splice(p1Index, 1);
            this.teamTwoScore.update((val) => val + 1);
          } else {
            this.teamTwoBuilder.updateTeamPokemon(firstAttacker);
            teamTwoPokemons.splice(p2Index, 1);
            this.teamOneScore.update((val) => val + 1);
          }
        }
      }

      // Atualizar o Pokémon mais forte da batalha
      this.updateStrongestPokemon([...teamOnePokemons, ...teamTwoPokemons]);

      this.turnNumber.set(this.turnNumber() + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (this.battleCancelled) break;
    }

    // Se a batalha não foi cancelada, definir o vencedor
    if (!this.battleCancelled) {
      this.currentBattle.set({ p1: null, p2: null });
      this.battleInProgress.set(false);

      if (teamOnePokemons.length > 0) {
        this.winner.set('Time 1');
        this.battleLog.update((currentLog) => [
          ...currentLog,
          'Time 1 venceu a batalha!',
        ]);
      } else {
        this.winner.set('Time 2');
        this.battleLog.update((currentLog) => [
          ...currentLog,
          'Time 2 venceu a batalha!',
        ]);
      }

      this.battleEnded.set(true);
    }
  }

  isAttackSuperEffective(attacker: Pokemon, defender: Pokemon): boolean {
    if (
      !attacker.type ||
      !defender.type ||
      attacker.type.length === 0 ||
      defender.type.length === 0
    ) {
      return false;
    }

    const attackerType = attacker.type[0].toLowerCase();

    for (const defenderType of defender.type) {
      const weaknesses = this.typeWeaknesses[defenderType.toLowerCase()] || [];
      if (weaknesses.includes(attackerType)) {
        return true;
      }
    }

    return false;
  }

  calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    isSuperEffective: boolean = false
  ): number {
    const baseDamage = attacker.stats.attack * 0.8;

    const defenseFactor = 1 - defender.stats.defense * 0.006;

    const randomFactor = Math.random() * 0.3 + 0.75;

    const typeMultiplier = isSuperEffective ? 1.5 : 1.0;

    const calculatedDamage = Math.floor(
      baseDamage * defenseFactor * randomFactor * typeMultiplier
    );

    return Math.max(
      3,
      Math.min(calculatedDamage, Math.floor(defender.stats.maxHp * 0.6))
    );
  }

  resetBattle() {
    this.teamOne.set([]);
    this.teamTwo.set([]);
    this.battleLog.set([]);
    this.currentBattle.set({ p1: null, p2: null });
    this.turnNumber.set(0);
    this.battleEnded.set(false);
    this.battleInProgress.set(false);
    this.winner.set(null);
    this.teamOneScore.set(0);
    this.teamTwoScore.set(0);
    this.strongestPokemon = null;

    if (this.teamOneBuilder) {
      this.teamOneBuilder.team.set([]);
    }
    if (this.teamTwoBuilder) {
      this.teamTwoBuilder.team.set([]);
    }
  }

  cancelBattle() {
    // Definir a flag para interromper o loop de batalha
    this.battleCancelled = true;

    // Limpar todos os estados, igual ao resetBattle()
    this.teamOne.set([]);
    this.teamTwo.set([]);
    this.battleLog.set([]); // Limpar o relatório de batalha
    this.currentBattle.set({ p1: null, p2: null });
    this.turnNumber.set(0);
    this.battleEnded.set(false);
    this.battleInProgress.set(false);
    this.winner.set(null);
    this.teamOneScore.set(0);
    this.teamTwoScore.set(0);
    this.strongestPokemon = null;

    // Limpar os times nos builders
    if (this.teamOneBuilder) {
      this.teamOneBuilder.team.set([]);
    }
    if (this.teamTwoBuilder) {
      this.teamTwoBuilder.team.set([]);
    }
  }

  getActiveTeamOneCount(): number {
    return this.teamOne().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }

  getActiveTeamTwoCount(): number {
    return this.teamTwo().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }

  // Novos métodos para animações com ícones

  showBattleStartAnimation() {
    // Implementação da animação de início de batalha com o ícone do ginásio
    const battleArena = document.querySelector('.battle-arena');
    if (battleArena) {
      const rect = battleArena.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Criar elemento de animação
      const animationElement = document.createElement('div');
      animationElement.className = 'battle-start-animation';
      animationElement.style.position = 'absolute';
      animationElement.style.left = `${centerX}px`;
      animationElement.style.top = `${centerY}px`;
      animationElement.style.transform = 'translate(-50%, -50%)';
      animationElement.style.zIndex = '1000';

      // Adicionar ícone do ginásio
      const iconElement = document.createElement('div');
      iconElement.setAttribute('appPokemonIcon', this.selectedGym);
      iconElement.setAttribute('size', 'xl');

      animationElement.appendChild(iconElement);
      document.body.appendChild(animationElement);

      // Animar e remover após a animação
      setTimeout(() => {
        document.body.removeChild(animationElement);
      }, 2000);
    }
  }

  showAttackAnimation(
    attacker: Pokemon,
    defender: Pokemon,
    isSuperEffective: boolean
  ) {
    // Determinar o tipo de ícone de ataque com base no tipo do Pokémon
    let attackIconId = 'fight';
    if (attacker.type && attacker.type.length > 0) {
      const type = attacker.type[0].toLowerCase();
      if (type === 'fire') attackIconId = 'fire-attack';
      else if (type === 'water') attackIconId = 'water-attack';
      else if (type === 'grass') attackIconId = 'grass-attack';
      else if (type === 'electric') attackIconId = 'electric-attack';
    }

    // Configurar a animação
    this.showAttackIcon = true;
    this.attackIconType = attackIconId;

    // Obter posição do defensor para animar o ícone
    const defenderElement = document.getElementById(`pokemon-${defender.id}`);
    if (defenderElement) {
      const rect = defenderElement.getBoundingClientRect();
      this.attackIconPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    // Esconder o ícone após a animação
    setTimeout(() => {
      this.showAttackIcon = false;
    }, 800);
  }

  showNewPokemonAnimation(pokemon: Pokemon, player: number) {
    const pokemonElement = document.getElementById(`pokemon-${pokemon.id}`);

    if (pokemonElement) {
      const rect = pokemonElement.getBoundingClientRect();

      this.newPokemonAnimation = {
        show: true,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
        player: player,
      };

      // Esconder a animação após um tempo
      setTimeout(() => {
        this.newPokemonAnimation.show = false;
      }, 1500);
    }
  }

  updateStrongestPokemon(pokemons: Pokemon[]) {
    if (!pokemons || pokemons.length === 0) {
      this.strongestPokemon = null;
      return;
    }

    // Encontrar o Pokémon com maior ataque
    let strongest = pokemons[0];
    for (const pokemon of pokemons) {
      if (pokemon.stats.attack > strongest.stats.attack) {
        strongest = pokemon;
      }
    }

    this.strongestPokemon = strongest;
  }

  isPokemonStrongest(pokemon: Pokemon): boolean {
    return this.strongestPokemon?.id === pokemon.id;
  }
}
