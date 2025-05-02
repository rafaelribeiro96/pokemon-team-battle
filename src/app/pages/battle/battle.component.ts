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
  battleInProgress = signal(false); // Para controlar a animação da batalha

  setTeamOne(team: Pokemon[]) {
    this.teamOne.set(team); // Atualiza o time 1
  }

  setTeamTwo(team: Pokemon[]) {
    this.teamTwo.set(team); // Atualiza o time 2
  }

  async startBattle() {
    if (this.teamOne().length === 0 || this.teamTwo().length === 0) {
      alert(
        'Ambas as equipes precisam estar completas para iniciar a batalha!'
      );
      return;
    }

    const log: string[] = [];
    let teamOnePokemons = [...this.teamOne()];
    let teamTwoPokemons = [...this.teamTwo()];

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
      const p1Index = Math.floor(Math.random() * teamOnePokemons.length);
      const p2Index = Math.floor(Math.random() * teamTwoPokemons.length);

      const p1 = teamOnePokemons[p1Index];
      const p2 = teamTwoPokemons[p2Index];

      log.push(`Starting battle: ${p1.name} vs ${p2.name}`);
      this.currentBattle.set({ p1, p2 });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for animation

      const winner = this.fight(p1, p2);
      log.push(`Winner: ${winner.name}`);

      if (winner === p1) {
        teamTwoPokemons.splice(p2Index, 1);
      } else {
        teamOnePokemons.splice(p1Index, 1);
      }
    }

    // Limpa a batalha atual após o fim
    this.currentBattle.set({ p1: null, p2: null });

    log.push(
      teamOnePokemons.length > 0
        ? 'Time 1 venceu a batalha!'
        : 'Time 2 venceu a batalha!'
    );
    this.battleLog.set(log);
  }

  animateBattle(p1: Pokemon, p2: Pokemon) {
    p1.isAttacking = true;
    setTimeout(() => (p1.isAttacking = false), 1000);
    p2.isAttacking = true;
    setTimeout(() => (p2.isAttacking = false), 1000);
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
