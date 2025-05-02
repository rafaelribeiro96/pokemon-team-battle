import { Component, signal } from '@angular/core';
import { TeamBuilderComponent } from '../../components/team-builder/team-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  imports: [TeamBuilderComponent, MatButtonModule, CommonModule],
})
export class BattleComponent {
  teamOne = signal<Pokemon[]>([]);
  teamTwo = signal<Pokemon[]>([]);
  battleLog = signal<string[]>([]);

  startBattle() {
    const log: string[] = [];
    let teamOnePokemons = [...this.teamOne()];
    let teamTwoPokemons = [...this.teamTwo()];

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
      const p1 = teamOnePokemons.pop();
      const p2 = teamTwoPokemons.pop();

      if (p1 && p2) {
        const winner = this.fight(p1, p2);
        log.push(`${p1.name} vs ${p2.name} -> Winner: ${winner.name}`);
      }
    }

    this.battleLog.set(log);
  }

  fight(p1: Pokemon, p2: Pokemon): Pokemon {
    const p1Score = p1.stats.attack + p1.stats.speed - p2.stats.defense;
    const p2Score = p2.stats.attack + p2.stats.speed - p1.stats.defense;

    return p1Score > p2Score ? p1 : p2;
  }
}
