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

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
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
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const firstAttacker = p1.stats.speed >= p2.stats.speed ? p1 : p2;
      const secondAttacker = firstAttacker === p1 ? p2 : p1;

      if (firstAttacker === p1) {
        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: true,
          p2IsAttacking: false,
          p1IsDefending: false,
          p2IsDefending: true,
        });
      } else {
        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: false,
          p2IsAttacking: true,
          p1IsDefending: true,
          p2IsDefending: false,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const damage1 = this.calculateDamage(firstAttacker, secondAttacker);
      secondAttacker.stats.hp = Math.max(0, secondAttacker.stats.hp - damage1);

      this.battleLog.update((currentLog) => [
        ...currentLog,
        `${firstAttacker.name} ataca ${secondAttacker.name} e causa ${damage1} de dano!`,
      ]);

      this.currentBattle.set({
        p1,
        p2,
        p1IsAttacking: false,
        p2IsAttacking: false,
        p1IsDefending: false,
        p2IsDefending: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        if (secondAttacker === p1) {
          this.currentBattle.set({
            p1,
            p2,
            p1IsAttacking: true,
            p2IsAttacking: false,
            p1IsDefending: false,
            p2IsDefending: true,
          });
        } else {
          this.currentBattle.set({
            p1,
            p2,
            p1IsAttacking: false,
            p2IsAttacking: true,
            p1IsDefending: true,
            p2IsDefending: false,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const damage2 = this.calculateDamage(secondAttacker, firstAttacker);
        firstAttacker.stats.hp = Math.max(0, firstAttacker.stats.hp - damage2);

        this.battleLog.update((currentLog) => [
          ...currentLog,
          `${secondAttacker.name} ataca ${firstAttacker.name} e causa ${damage2} de dano!`,
        ]);

        this.currentBattle.set({
          p1,
          p2,
          p1IsAttacking: false,
          p2IsAttacking: false,
          p1IsDefending: false,
          p2IsDefending: false,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

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
    }

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

  calculateDamage(attacker: Pokemon, defender: Pokemon): number {
    const baseDamage = attacker.stats.attack * 0.5;
    const defense = defender.stats.defense * 0.3;
    const randomFactor = Math.random() * 0.3 + 0.85;

    return Math.max(1, Math.floor((baseDamage - defense) * randomFactor));
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

  getActiveTeamOneCount(): number {
    return this.teamOne().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }

  getActiveTeamTwoCount(): number {
    return this.teamTwo().filter((pokemon) => pokemon.isFainted !== true)
      .length;
  }
}
