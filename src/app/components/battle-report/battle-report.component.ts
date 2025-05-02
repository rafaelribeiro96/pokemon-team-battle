/* battle-report.component.ts */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface TeamStats {
  name: string;
  totalAttacks: number;
  totalDamage: number;
  knockouts: number;
  pokemonUsed: number;
  strongestPokemon: {
    name: string;
    attack: number;
  } | null;
}

interface LogEntry {
  type: 'attack' | 'faint' | 'switch' | 'info';
  message: string;
  team?: number; // 1 ou 2
}

@Component({
  selector: 'app-battle-report',
  standalone: true,
  imports: [CommonModule, PokemonIconsModule, PokemonIconComponent],
  template: `
    <div class="battle-report">
      <div class="report-header">
        <app-pokemon-icon iconId="crown" size="md"></app-pokemon-icon>
        <h3>Relatório de Batalha</h3>
      </div>

      <div class="report-content">
        <div class="winner-section" *ngIf="winner">
          <h4>Vencedor</h4>
          <div class="winner-info">
            <app-pokemon-icon
              [iconId]="winner.avatar || 'pikachu'"
              size="lg"
            ></app-pokemon-icon>
            <div class="winner-name">{{ winner.name }}</div>
          </div>
        </div>

        <div class="teams-stats">
          <div class="team-stats team-one">
            <h4>
              <app-pokemon-icon
                iconId="trainer-red"
                size="sm"
              ></app-pokemon-icon>
              Time 1
            </h4>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon iconId="fight" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Ataques:</div>
              <div class="stat-value">{{ teamOneStats.totalAttacks }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon iconId="damage" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Dano Total:</div>
              <div class="stat-value">{{ teamOneStats.totalDamage }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon
                  iconId="fainted-pokeball"
                  size="sm"
                ></app-pokemon-icon>
              </div>
              <div class="stat-label">Knockouts:</div>
              <div class="stat-value">{{ teamOneStats.knockouts }}</div>
            </div>
            <div class="stat-item" *ngIf="teamOneStats.strongestPokemon">
              <div class="stat-icon">
                <app-pokemon-icon iconId="crown" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Pokémon Mais Forte:</div>
              <div class="stat-value">
                {{ teamOneStats.strongestPokemon.name }}
              </div>
            </div>
          </div>

          <div class="team-stats team-two">
            <h4>
              <app-pokemon-icon
                iconId="trainer-blue"
                size="sm"
              ></app-pokemon-icon>
              Time 2
            </h4>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon iconId="fight" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Ataques:</div>
              <div class="stat-value">{{ teamTwoStats.totalAttacks }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon iconId="damage" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Dano Total:</div>
              <div class="stat-value">{{ teamTwoStats.totalDamage }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <app-pokemon-icon
                  iconId="fainted-pokeball"
                  size="sm"
                ></app-pokemon-icon>
              </div>
              <div class="stat-label">Knockouts:</div>
              <div class="stat-value">{{ teamTwoStats.knockouts }}</div>
            </div>
            <div class="stat-item" *ngIf="teamTwoStats.strongestPokemon">
              <div class="stat-icon">
                <app-pokemon-icon iconId="crown" size="sm"></app-pokemon-icon>
              </div>
              <div class="stat-label">Pokémon Mais Forte:</div>
              <div class="stat-value">
                {{ teamTwoStats.strongestPokemon.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="battle-summary">
          <h4>Resumo da Batalha</h4>
          <div class="stat-item">
            <div class="stat-icon">
              <app-pokemon-icon iconId="pokeball" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Total de Pokémon:</div>
            <div class="stat-value">
              {{ teamOneStats.pokemonUsed + teamTwoStats.pokemonUsed }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <app-pokemon-icon iconId="coin" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Pontos Ganhos:</div>
            <div class="stat-value">{{ calculateTotalPoints() }}</div>
          </div>
        </div>

        <div class="battle-log">
          <h4>Log da Batalha</h4>
          <div class="log-entries">
            <div
              *ngFor="let entry of reversedLogEntries"
              class="log-entry"
              [ngClass]="{
                'team-one': entry.team === 1,
                'team-two': entry.team === 2
              }"
            >
              <div class="log-icon" [ngSwitch]="entry.type">
                <app-pokemon-icon
                  *ngSwitchCase="'attack'"
                  iconId="fight"
                  size="xs"
                ></app-pokemon-icon>
                <app-pokemon-icon
                  *ngSwitchCase="'faint'"
                  iconId="fainted-pokeball"
                  size="xs"
                ></app-pokemon-icon>
                <app-pokemon-icon
                  *ngSwitchCase="'switch'"
                  iconId="pokeball"
                  size="xs"
                ></app-pokemon-icon>
                <app-pokemon-icon
                  *ngSwitchDefault
                  iconId="pokedex"
                  size="xs"
                ></app-pokemon-icon>
              </div>
              <div class="log-message">{{ entry.message }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-actions">
        <button class="action-btn" (click)="closeReport()">Fechar</button>
        <button class="action-btn primary" (click)="newBattle()">
          Nova Batalha
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./battle-report.component.scss'],
})
export class BattleReportComponent {
  @Input() log: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();

  winner: { name: string; avatar?: string } | null = null;

  teamOneStats: TeamStats = {
    name: 'Time 1',
    totalAttacks: 0,
    totalDamage: 0,
    knockouts: 0,
    pokemonUsed: 0,
    strongestPokemon: null,
  };

  teamTwoStats: TeamStats = {
    name: 'Time 2',
    totalAttacks: 0,
    totalDamage: 0,
    knockouts: 0,
    pokemonUsed: 0,
    strongestPokemon: null,
  };

  logEntries: LogEntry[] = [];

  get reversedLogEntries(): LogEntry[] {
    return [...this.logEntries].reverse();
  }

  ngOnInit() {
    this.processLog();
  }

  ngOnChanges() {
    this.processLog();
  }

  processLog() {
    // Resetar estatísticas
    this.teamOneStats = {
      name: 'Time 1',
      totalAttacks: 0,
      totalDamage: 0,
      knockouts: 0,
      pokemonUsed: 0,
      strongestPokemon: null,
    };

    this.teamTwoStats = {
      name: 'Time 2',
      totalAttacks: 0,
      totalDamage: 0,
      knockouts: 0,
      pokemonUsed: 0,
      strongestPokemon: null,
    };

    this.logEntries = [];

    // Mapas para rastrear Pokémon por equipe
    const team1Pokemon = new Map<string, { attack: number }>();
    const team2Pokemon = new Map<string, { attack: number }>();

    // Processar cada entrada do log
    for (const entry of this.log) {
      let logEntry: LogEntry = { type: 'info', message: entry };

      if (entry.includes('ataca')) {
        logEntry.type = 'attack';

        // Extrair informações do ataque
        const parts = entry.split(' ataca ');
        const attacker = parts[0];
        const defenderParts = parts[1].split(' e causa ');
        const defender = defenderParts[0];
        const damageParts = defenderParts[1].split(' de dano');
        const damage = parseInt(damageParts[0], 10);
        const isSuperEffective = entry.includes('SUPER EFETIVO');

        // Determinar a equipe do atacante
        if (this.isTeamOnePokemon(attacker, defender)) {
          logEntry.team = 1;
          this.teamOneStats.totalAttacks++;
          this.teamOneStats.totalDamage += damage;

          // Rastrear Pokémon do Time 1
          if (!team1Pokemon.has(attacker)) {
            team1Pokemon.set(attacker, { attack: 0 });
            this.teamOneStats.pokemonUsed++;
          }
          team1Pokemon.get(attacker)!.attack += damage;
        } else {
          logEntry.team = 2;
          this.teamTwoStats.totalAttacks++;
          this.teamTwoStats.totalDamage += damage;

          // Rastrear Pokémon do Time 2
          if (!team2Pokemon.has(attacker)) {
            team2Pokemon.set(attacker, { attack: 0 });
            this.teamTwoStats.pokemonUsed++;
          }
          team2Pokemon.get(attacker)!.attack += damage;
        }
      } else if (entry.includes('desmaiou')) {
        logEntry.type = 'faint';

        // Extrair nome do Pokémon que desmaiou
        const pokemonName = entry.split(' desmaiou')[0];

        // Determinar a equipe do Pokémon que desmaiou
        if (this.isTeamOnePokemon(pokemonName)) {
          logEntry.team = 1;
          this.teamTwoStats.knockouts++;
        } else {
          logEntry.team = 2;
          this.teamOneStats.knockouts++;
        }
      } else if (entry.includes('enfrenta')) {
        logEntry.type = 'switch';

        // Extrair nomes dos Pokémon
        const turnParts = entry.split(': ');
        const pokemonParts = turnParts[1].split(' enfrenta ');
        const pokemon1 = pokemonParts[0];
        const pokemon2 = pokemonParts[1];

        // Adicionar Pokémon às equipes se ainda não estiverem lá
        if (!team1Pokemon.has(pokemon1)) {
          team1Pokemon.set(pokemon1, { attack: 0 });
          this.teamOneStats.pokemonUsed++;
        }

        if (!team2Pokemon.has(pokemon2)) {
          team2Pokemon.set(pokemon2, { attack: 0 });
          this.teamTwoStats.pokemonUsed++;
        }
      } else if (entry.includes('venceu a batalha')) {
        const winnerTeam = entry.includes('Time 1') ? 'Time 1' : 'Time 2';
        this.winner = {
          name: winnerTeam,
          avatar: winnerTeam === 'Time 1' ? 'trainer-red' : 'trainer-blue',
        };
      }

      this.logEntries.push(logEntry);
    }

    // Encontrar o Pokémon mais forte de cada equipe
    let strongestTeam1Pokemon = { name: '', attack: 0 };
    let strongestTeam2Pokemon = { name: '', attack: 0 };

    team1Pokemon.forEach((stats, name) => {
      if (stats.attack > strongestTeam1Pokemon.attack) {
        strongestTeam1Pokemon = { name, attack: stats.attack };
      }
    });

    team2Pokemon.forEach((stats, name) => {
      if (stats.attack > strongestTeam2Pokemon.attack) {
        strongestTeam2Pokemon = { name, attack: stats.attack };
      }
    });

    if (strongestTeam1Pokemon.name) {
      this.teamOneStats.strongestPokemon = strongestTeam1Pokemon;
    }

    if (strongestTeam2Pokemon.name) {
      this.teamTwoStats.strongestPokemon = strongestTeam2Pokemon;
    }
  }

  // Determina se um Pokémon pertence ao Time 1 com base no contexto
  isTeamOnePokemon(pokemon: string, opponent?: string): boolean {
    // Lógica para determinar a qual equipe um Pokémon pertence
    // Esta é uma implementação simplificada que assume que o primeiro Pokémon mencionado em um confronto é do Time 1
    for (const entry of this.log) {
      if (entry.includes('enfrenta')) {
        const parts = entry.split(': ')[1].split(' enfrenta ');
        if (parts[0] === pokemon) return true;
        if (parts[1] === pokemon) return false;
      }
    }

    // Se não conseguirmos determinar, assumimos Time 1 se não houver oponente
    return !opponent;
  }

  calculateTotalPoints(): number {
    const attackPoints =
      (this.teamOneStats.totalAttacks + this.teamTwoStats.totalAttacks) * 1.5;
    const knockoutPoints =
      (this.teamOneStats.knockouts + this.teamTwoStats.knockouts) * 3;
    const pokemonPoints =
      (this.teamOneStats.pokemonUsed + this.teamTwoStats.pokemonUsed) * 2;

    return Math.floor(attackPoints + knockoutPoints + pokemonPoints);
  }

  closeReport() {
    this.close.emit();
  }

  newBattle() {
    this.restart.emit();
  }
}
