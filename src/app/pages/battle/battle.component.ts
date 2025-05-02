import { Component, signal, ViewChild } from '@angular/core';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { BattleReportComponent } from '../../components/battle-report/battle-report.component';
import { BattleHeaderComponent } from '../../components/battle-header/battle-header.component';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { ScoreboardComponent } from '../../components/scoreboard/scoreboard.component';

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
  }

  setTeamTwo(team: Pokemon[]) {
    this.teamTwo.set(team);
  }

  async startBattle() {
    if (this.teamOne().length === 0 || this.teamTwo().length === 0) {
      alert(
        'Ambas as equipes precisam estar completas para iniciar a batalha!'
      );
      return;
    }

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
    const baseDamage = attacker.stats.attack * 0.5;
    const defense = defender.stats.defense * 0.3;
    const randomFactor = Math.random() * 0.3 + 0.85;
    const typeMultiplier = isSuperEffective ? 1.5 : 1.0;

    return Math.max(
      1,
      Math.floor((baseDamage - defense) * randomFactor * typeMultiplier)
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

    this.battleInProgress.set(false);
    this.battleEnded.set(false);
    this.currentBattle.set({ p1: null, p2: null });

    // Restaurar HP de todos os Pokémon
    const resetTeamOne = this.teamOne().map((pokemon) => ({
      ...pokemon,
      stats: { ...pokemon.stats, hp: pokemon.stats.maxHp },
      isFainted: false,
    }));

    const resetTeamTwo = this.teamTwo().map((pokemon) => ({
      ...pokemon,
      stats: { ...pokemon.stats, hp: pokemon.stats.maxHp },
      isFainted: false,
    }));

    this.teamOne.set(resetTeamOne);
    this.teamTwo.set(resetTeamTwo);

    // Atualizar os times nos builders
    if (this.teamOneBuilder) {
      this.teamOneBuilder.team.set(resetTeamOne);
    }
    if (this.teamTwoBuilder) {
      this.teamTwoBuilder.team.set(resetTeamTwo);
    }

    this.battleLog.update((currentLog) => [
      ...currentLog,
      'Batalha cancelada pelo usuário.',
    ]);
  }

  getActiveTeamOneCount(): number {
    return this.teamOne().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }

  getActiveTeamTwoCount(): number {
    return this.teamTwo().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }
}
