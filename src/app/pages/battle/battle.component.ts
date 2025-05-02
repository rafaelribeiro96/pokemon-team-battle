import { Component, signal } from '@angular/core';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { BattleReportComponent } from '../../components/battle-report/battle-report.component';
import { BattleHeaderComponent } from '../../components/battle-header/battle-header.component';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

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
  ],
})
export class BattleComponent {
  teamOne = signal<Pokemon[]>([]);
  teamTwo = signal<Pokemon[]>([]);
  battleLog = signal<string[]>([]);
  currentBattle = signal<{ p1: Pokemon | null; p2: Pokemon | null }>({
    p1: null,
    p2: null,
  });
  battleInProgress = signal(false);
  battleEnded = signal(false);
  turnNumber = signal(0);
  winner = signal<string | null>(null);

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
    const log: string[] = [];
    let teamOnePokemons = [...this.teamOne()];
    let teamTwoPokemons = [...this.teamTwo()];

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
      const p1Index = Math.floor(Math.random() * teamOnePokemons.length);
      const p2Index = Math.floor(Math.random() * teamTwoPokemons.length);

      const p1 = teamOnePokemons[p1Index];
      const p2 = teamTwoPokemons[p2Index];

      log.unshift(`Turno ${this.turnNumber()}: ${p1.name} enfrenta ${p2.name}`);
      this.currentBattle.set({ p1, p2 });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const winner = this.fight(p1, p2);
      log.unshift(`${winner.name} venceu o turno!`);

      if (winner === p1) {
        teamTwoPokemons.splice(p2Index, 1);
        p2.isFainted = true;
        p2.stats.hp = 0;
      } else {
        teamOnePokemons.splice(p1Index, 1);
        p1.isFainted = true;
        p1.stats.hp = 0;
      }

      this.turnNumber.set(this.turnNumber() + 1);
    }

    this.currentBattle.set({ p1: null, p2: null });
    this.battleInProgress.set(false);

    if (teamOnePokemons.length > 0) {
      this.winner.set('Time 1 venceu a batalha!');
    } else {
      this.winner.set('Time 2 venceu a batalha!');
    }

    log.unshift(this.winner() ?? '');
    this.battleLog.set(log);
    this.battleEnded.set(true);
  }

  fight(p1: Pokemon, p2: Pokemon): Pokemon {
    const p1Score = p1.stats.attack + p1.stats.speed - p2.stats.defense;
    const p2Score = p2.stats.attack + p2.stats.speed - p1.stats.defense;

    return p1Score > p2Score ? p1 : p2;
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
  }
}
