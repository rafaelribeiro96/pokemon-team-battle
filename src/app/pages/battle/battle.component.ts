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
  turnNumber = signal(0); // Tracks the current turn
  battleEnded = signal(false); // Tracks if the battle has ended

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
    const log: string[] = [];
    let teamOnePokemons = [...this.teamOne()];
    let teamTwoPokemons = [...this.teamTwo()];

    while (teamOnePokemons.length > 0 && teamTwoPokemons.length > 0) {
      const p1Index = Math.floor(Math.random() * teamOnePokemons.length);
      const p2Index = Math.floor(Math.random() * teamTwoPokemons.length);

      const p1 = teamOnePokemons[p1Index];
      const p2 = teamTwoPokemons[p2Index];

      log.push(`Time 1 lançou ${p1.name}!`);
      log.push(`Time 2 lançou ${p2.name}!`);
      this.currentBattle.set({ p1, p2 });

      const damage = this.attack(p1, p2);
      log.push(`${p1.name} causou ${damage} de dano em ${p2.name}`);

      if (p2.stats.hp <= 0) {
        p2.isFainted = true;
        log.push(`${p2.name} foi derrotado!`);
        teamTwoPokemons.splice(p2Index, 1);
      }

      // Troca de times se necessário
      if (teamTwoPokemons.length > 0) {
        log.push(`Time 2 recuou e lançou um novo Pokémon!`);
      }

      this.battleLog.set(log);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera a animação
    }

    this.battleEnded.set(true);
    this.battleInProgress.set(false);
  }

  attack(attacker: Pokemon, defender: Pokemon): number {
    const damage = Math.max(
      5,
      attacker.stats.attack - defender.stats.defense / 2
    );
    defender.stats.hp -= damage;
    return damage;
  }

  resetBattle() {
    this.teamOne.set([]);
    this.teamTwo.set([]);
    this.battleLog.set([]);
    this.currentBattle.set({ p1: null, p2: null });
    this.turnNumber.set(0);
    this.battleEnded.set(false);
    this.battleInProgress.set(false);
  }
}
