/* battle.component.ts */
import {
  Component,
  ViewChild,
  signal,
  type OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
import type { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { ScoreboardComponent } from '../../components/scoreboard/scoreboard.component';
import { PokemonIconComponent } from '../../components/pokemon-icon/pokemon-icon.component';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { BattleReportComponent } from '../../components/battle-report/battle-report.component';
import type { Pokemon } from '../../models/pokemon.model';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { BattlePokemon } from '../../models/battle.model';

interface CurrentBattle {
  p1: Pokemon | null;
  p2: Pokemon | null;
  p1IsAttacking?: boolean;
  p2IsAttacking?: boolean;
  p1IsDefending?: boolean;
  p2IsDefending?: boolean;
  p1IsSuperEffective?: boolean;
  p2IsSuperEffective?: boolean;
}

interface AnimationPosition {
  x: number;
  y: number;
}

interface NewPokemonAnimation {
  show: boolean;
  position: AnimationPosition;
  player: number;
}

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    PokemonCardComponent,
    ScoreboardComponent,
    PokemonIconComponent,
    TeamBuilderComponent,
    BattleReportComponent,
    PokemonIconsModule,
  ],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
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
export class BattleComponent implements OnInit {
  @ViewChild('teamOneBuilder') teamOneBuilder!: TeamBuilderComponent;
  @ViewChild('teamTwoBuilder') teamTwoBuilder!: TeamBuilderComponent;

  teamOne = signal<Pokemon[]>([]);
  teamTwo = signal<Pokemon[]>([]);
  battleLog = signal<string[]>([]);
  currentBattle = signal<CurrentBattle>({
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

  // Propriedades para armazenar informações dos times
  teamOneName = signal<string>('Time 1');
  teamTwoName = signal<string>('Time 2');
  teamOneTrainer = signal<string>('trainer-red');
  teamTwoTrainer = signal<string>('trainer-blue');
  teamOneGym = signal<string>('');
  teamTwoGym = signal<string>('');

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Inicializar o componente
  }

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

  // Método para obter o ginásio atual com base no turno
  currentGym(): string | null {
    // Inicialmente, não mostrar nenhum ícone de ginásio
    if (!this.battleInProgress()) {
      return null;
    }

    // Durante a batalha, mostrar o ginásio do time que está atacando
    const currentBattle = this.currentBattle();

    if (currentBattle.p1IsAttacking) {
      return this.teamOneGym() || null;
    } else if (currentBattle.p2IsAttacking) {
      return this.teamTwoGym() || null;
    }

    return null; // Nenhum time está atacando no momento
  }

  // Método para obter a classe CSS do ginásio
  getGymClass(gymId: string): string {
    if (!gymId) return '';

    const gymType = gymId.split('-')[0]; // Extrai 'fire', 'water', etc.
    return `gym-${gymType}`;
  }

  // Atualizar o método setTeamOne para capturar informações do time
  setTeamOne(team: Pokemon[]) {
    this.teamOne.set(team);

    // Capturar informações do time do componente team-builder
    if (this.teamOneBuilder) {
      this.teamOneName.set(this.teamOneBuilder.teamName() || 'Time 1');
      this.teamOneTrainer.set(
        this.teamOneBuilder.trainerAvatar() || 'trainer-red'
      );
      this.teamOneGym.set(this.teamOneBuilder.selectedGym() || '');
    }
  }

  // Adicione estes novos métodos após os métodos setTeamOne e setTeamTwo existentes
  setTeamOneTrainer(trainer: string) {
    this.teamOneTrainer.set(trainer);
  }

  setTeamTwoTrainer(trainer: string) {
    this.teamTwoTrainer.set(trainer);
  }

  setTeamOneName(name: string) {
    this.teamOneName.set(name);
  }

  setTeamTwoName(name: string) {
    this.teamTwoName.set(name);
  }

  setTeamOneGym(gym: string) {
    this.teamOneGym.set(gym);
  }

  setTeamTwoGym(gym: string) {
    this.teamTwoGym.set(gym);
  }

  // Atualizar o método setTeamTwo para capturar informações do time
  setTeamTwo(team: Pokemon[]) {
    this.teamTwo.set(team);

    // Capturar informações do time do componente team-builder
    if (this.teamTwoBuilder) {
      this.teamTwoName.set(this.teamTwoBuilder.teamName() || 'Time 2');
      this.teamTwoTrainer.set(
        this.teamTwoBuilder.trainerAvatar() || 'trainer-blue'
      );
      this.teamTwoGym.set(this.teamTwoBuilder.selectedGym() || '');
    }
  }

  // Método para atualizar os times
  updateTeams() {
    // Atualiza os sinais para forçar a renderização
    this.teamOne.set([...this.teamOne()]);
    this.teamTwo.set([...this.teamTwo()]);

    // Força a detecção de mudanças
    this.cdr.detectChanges();
  }

  // Modificação no método startBattle para preservar a ordem dos Pokémon
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

    // Preservar a ordem original dos Pokémon e adicionar propriedades de batalha
    const teamOnePokemons = [...this.teamOne()].map((p, index) => ({
      ...p,
      stats: { ...p.stats },
      isFainted: false,
      isAttacking: false,
      originalPosition: index,
      battlesFought: 0,
      consecutiveBattles: 0,
    })) as BattlePokemon[];

    const teamTwoPokemons = [...this.teamTwo()].map((p, index) => ({
      ...p,
      stats: { ...p.stats },
      isFainted: false,
      isAttacking: false,
      originalPosition: index,
      battlesFought: 0,
      consecutiveBattles: 0,
    })) as BattlePokemon[];

    // Atualizar o Pokémon mais forte da batalha
    this.updateStrongestPokemon([...teamOnePokemons, ...teamTwoPokemons]);

    // Atualizar os times no início da batalha
    this.teamOne.set(teamOnePokemons);
    this.teamTwo.set(teamTwoPokemons);
    this.updateTeams();

    // Loop principal da batalha com verificação de cancelamento
    while (
      teamOnePokemons.length > 0 &&
      teamTwoPokemons.length > 0 &&
      !this.battleCancelled
    ) {
      // Selecionar Pokémon estrategicamente em vez de aleatoriamente
      const p1 = this.selectNextPokemon(teamOnePokemons, teamTwoPokemons, 1);
      const p2 = this.selectNextPokemon(teamTwoPokemons, teamOnePokemons, 2);

      // Incrementar contadores de batalha
      p1.battlesFought = (p1.battlesFought || 0) + 1;
      p1.consecutiveBattles = (p1.consecutiveBattles || 0) + 1;
      p2.battlesFought = (p2.battlesFought || 0) + 1;
      p2.consecutiveBattles = (p2.consecutiveBattles || 0) + 1;

      // Resetar contadores de batalhas consecutivas para outros Pokémon
      teamOnePokemons.forEach((pokemon) => {
        if (pokemon !== p1) pokemon.consecutiveBattles = 0;
      });
      teamTwoPokemons.forEach((pokemon) => {
        if (pokemon !== p2) pokemon.consecutiveBattles = 0;
      });

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

      // Atualiza os times para refletir as mudanças
      this.updateTeamPokemon(secondAttacker);
      this.updateTeams();

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

        // Atualiza os times para refletir as mudanças
        this.updateTeamPokemon(secondAttacker);
        this.updateTeams();

        if (secondAttacker === p1) {
          // Remover o Pokémon desmaiado do time
          const index = teamOnePokemons.findIndex(
            (p) => p.id === secondAttacker.id
          );
          if (index !== -1) {
            teamOnePokemons.splice(index, 1);
          }
          this.teamTwoScore.update((val) => val + 1);
        } else {
          // Remover o Pokémon desmaiado do time
          const index = teamTwoPokemons.findIndex(
            (p) => p.id === secondAttacker.id
          );
          if (index !== -1) {
            teamTwoPokemons.splice(index, 1);
          }
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

        // Atualiza os times para refletir as mudanças
        this.updateTeamPokemon(firstAttacker);
        this.updateTeams();

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

          // Atualiza os times para refletir as mudanças
          this.updateTeamPokemon(firstAttacker);
          this.updateTeams();

          if (firstAttacker === p1) {
            // Remover o Pokémon desmaiado do time
            const index = teamOnePokemons.findIndex(
              (p) => p.id === firstAttacker.id
            );
            if (index !== -1) {
              teamOnePokemons.splice(index, 1);
            }
            this.teamTwoScore.update((val) => val + 1);
          } else {
            // Remover o Pokémon desmaiado do time
            const index = teamTwoPokemons.findIndex(
              (p) => p.id === firstAttacker.id
            );
            if (index !== -1) {
              teamTwoPokemons.splice(index, 1);
            }
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

      // Atualiza os times uma última vez para garantir que todos os estados estejam corretos
      this.updateTeams();
    }
  }

  // Novo método para selecionar o próximo Pokémon estrategicamente
  selectNextPokemon(
    team: Pokemon[],
    opposingTeam: Pokemon[],
    teamNumber: number
  ): Pokemon {
    if (team.length === 0) {
      throw new Error(`Time ${teamNumber} não tem Pokémon disponíveis`);
    }

    if (team.length === 1) {
      // Se só tiver um Pokémon, não há escolha
      return team[0];
    }

    // Estratégia 1: Usar a ordem original nos primeiros turnos
    if (this.turnNumber() <= 2) {
      // Nos primeiros turnos, usar a ordem original de seleção
      team.sort(
        (a, b) => (a.originalPosition || 0) - (b.originalPosition || 0)
      );
      return team[0];
    }

    // Estratégia 2: Evitar usar o mesmo Pokémon por muitos turnos consecutivos
    const overusedPokemon = team.find((p) => (p.consecutiveBattles || 0) >= 3);
    if (overusedPokemon) {
      // Se algum Pokémon foi usado por 3+ turnos consecutivos, trocar
      const freshPokemon = team.find((p) => p !== overusedPokemon);
      if (freshPokemon) {
        this.battleLog.update((log) => [
          ...log,
          `${overusedPokemon.name} está cansado após ${overusedPokemon.consecutiveBattles} batalhas consecutivas. ${freshPokemon.name} entra em seu lugar!`,
        ]);
        return freshPokemon;
      }
    }

    // Estratégia 3: Vantagem de tipo contra o oponente atual
    if (opposingTeam.length > 0) {
      const currentOpponent = opposingTeam[0];

      // Encontrar Pokémon com vantagem de tipo
      for (const pokemon of team) {
        if (this.isAttackSuperEffective(pokemon, currentOpponent)) {
          this.battleLog.update((log) => [
            ...log,
            `${pokemon.name} foi escolhido estrategicamente por ter vantagem contra ${currentOpponent.name}!`,
          ]);
          return pokemon;
        }
      }
    }

    // Estratégia 4: Balancear o uso dos Pokémon (usar os menos utilizados)
    team.sort((a, b) => (a.battlesFought || 0) - (b.battlesFought || 0));

    // Estratégia 5: Priorizar Pokémon com mais HP percentual
    const healthyPokemon = team.filter((p) => p.stats.hp / p.stats.maxHp > 0.5);

    if (healthyPokemon.length > 0) {
      // Entre os Pokémon saudáveis, escolher o menos utilizado
      healthyPokemon.sort(
        (a, b) => (a.battlesFought || 0) - (b.battlesFought || 0)
      );
      return healthyPokemon[0];
    }

    // Se nenhuma estratégia específica se aplicar, usar o Pokémon menos utilizado
    return team[0];
  }

  // Método para atualizar um Pokémon específico no time
  updateTeamPokemon(pokemon: Pokemon) {
    // Verifica se o Pokémon está no time 1
    const teamOneIndex = this.teamOne().findIndex((p) => p.id === pokemon.id);
    if (teamOneIndex !== -1) {
      const updatedTeam = [...this.teamOne()];
      updatedTeam[teamOneIndex] = { ...pokemon };
      this.teamOne.set(updatedTeam);
    }

    // Verifica se o Pokémon está no time 2
    const teamTwoIndex = this.teamTwo().findIndex((p) => p.id === pokemon.id);
    if (teamTwoIndex !== -1) {
      const updatedTeam = [...this.teamTwo()];
      updatedTeam[teamTwoIndex] = { ...pokemon };
      this.teamTwo.set(updatedTeam);
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
    isSuperEffective = false
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
      iconElement.setAttribute('appPokemonIcon', this.currentGym() || '');
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
      if (type === 'fire') attackIconId = 'fire-type';
      else if (type === 'water') attackIconId = 'water-type';
      else if (type === 'grass') attackIconId = 'grass-type';
      else if (type === 'electric') attackIconId = 'electric-type';
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
