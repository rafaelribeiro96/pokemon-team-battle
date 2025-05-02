import { Component, signal } from '@angular/core';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { BattleReportComponent } from '../../components/battle-report/battle-report.component';

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
  ],
})
export class BattleComponent {
  teamOne = signal<Pokemon[]>([]);
  teamTwo = signal<Pokemon[]>([]);
  battleLog = signal<string[]>([]);

  startBattle() {
    const log: string[] = [];
    let teamOnePokemons = [...this.teamOne()];
    let teamTwoPokemons = [...this.teamTwo()];
    let teamOneWins = 0;
    let teamTwoWins = 0;

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
      const p1Index = Math.floor(Math.random() * teamOnePokemons.length);
      const p2Index = Math.floor(Math.random() * teamTwoPokemons.length);

      const p1 = teamOnePokemons.splice(p1Index, 1)[0];
      const p2 = teamTwoPokemons.splice(p2Index, 1)[0];

      if (p1 && p2) {
        const winner = this.fight(p1, p2);
        log.push(`${p1.name} vs ${p2.name} -> Winner: ${winner.name}`);

        if (winner === p1) {
          teamOneWins++;
        } else {
          teamTwoWins++;
        }
      }
    }

    log.push(`Team One Wins: ${teamOneWins}`);
    log.push(`Team Two Wins: ${teamTwoWins}`);

    this.battleLog.set(log);
  }

  fight(p1: Pokemon, p2: Pokemon): Pokemon {
    const p1Score = p1.stats.attack + p1.stats.speed - p2.stats.defense;
    const p2Score = p2.stats.attack + p2.stats.speed - p1.stats.defense;

    const winner = p1Score > p2Score ? p1 : p2;
    const loser = winner === p1 ? p2 : p1;

    loser.isDefeated = true; // Marca o derrotado
    return winner;
  }
}
