/* battle-report.component.ts */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';

interface BattleStats {
  totalAttacks: number;
  strongestPokemon: {
    name: string;
    attack: number;
  } | null;
  totalPokemon: number;
  pointsEarned: number;
}

interface LogEntry {
  type: 'attack' | 'faint' | 'switch' | 'info';
  message: string;
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

        <div class="stats-section">
          <h4>Estatísticas</h4>

          <div class="stat-item">
            <div class="stat-icon">
              <app-pokemon-icon iconId="fight" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Total de Ataques:</div>
            <div class="stat-value">{{ battleStats.totalAttacks }}</div>
          </div>

          <div class="stat-item" *ngIf="battleStats.strongestPokemon">
            <div class="stat-icon">
              <app-pokemon-icon iconId="crown" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Pokémon Mais Forte:</div>
            <div class="stat-value">
              {{ battleStats.strongestPokemon?.name }}
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <app-pokemon-icon iconId="pokeball" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Pokémon Utilizados:</div>
            <div class="stat-value">{{ battleStats.totalPokemon }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">
              <app-pokemon-icon iconId="coin" size="sm"></app-pokemon-icon>
            </div>
            <div class="stat-label">Pontos Ganhos:</div>
            <div class="stat-value">{{ battleStats.pointsEarned }}</div>
          </div>
        </div>

        <div class="battle-log">
          <h4>Log da Batalha</h4>
          <div class="log-entries">
            <div *ngFor="let entry of logEntries" class="log-entry">
              <div class="log-icon" [ngSwitch]="entry.type">
                <app-pokemon-icon
                  *ngSwitchCase="'attack'"
                  iconId="fight"
                  size="xs"
                ></app-pokemon-icon>
                <app-pokemon-icon
                  *ngSwitchCase="'faint'"
                  iconId="open-pokeball"
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

  battleStats: BattleStats = {
    totalAttacks: 0,
    strongestPokemon: null,
    totalPokemon: 0,
    pointsEarned: 0,
  };

  get logEntries(): LogEntry[] {
    return this.log.map((message) => {
      if (message.includes('ataca')) {
        return { type: 'attack', message };
      } else if (message.includes('desmaiou')) {
        return { type: 'faint', message };
      } else if (message.includes('enfrenta')) {
        return { type: 'switch', message };
      } else {
        return { type: 'info', message };
      }
    });
  }

  ngOnInit() {
    this.processLog();
  }

  ngOnChanges() {
    this.processLog();
  }

  processLog() {
    // Processar o log para extrair estatísticas
    let attacks = 0;
    let pokemonNames = new Set<string>();
    let strongestPokemon = { name: '', attack: 0 };

    for (const entry of this.log) {
      if (entry.includes('ataca')) {
        attacks++;

        // Extrair nome do Pokémon atacante
        const attackerName = entry.split(' ataca ')[0];
        pokemonNames.add(attackerName);
      } else if (entry.includes('enfrenta')) {
        const parts = entry.split(': ')[1].split(' enfrenta ');
        pokemonNames.add(parts[0]);
        pokemonNames.add(parts[1]);
      } else if (entry.includes('venceu a batalha')) {
        const winner = entry.includes('Time 1') ? 'Time 1' : 'Time 2';
        this.winner = {
          name: winner,
          avatar: winner === 'Time 1' ? 'trainer-red' : 'trainer-blue',
        };
      }
    }

    this.battleStats = {
      totalAttacks: attacks,
      strongestPokemon: strongestPokemon.name ? strongestPokemon : null,
      totalPokemon: pokemonNames.size,
      pointsEarned: Math.floor(attacks * 1.5 + pokemonNames.size * 2),
    };
  }

  closeReport() {
    this.close.emit();
  }

  newBattle() {
    this.restart.emit();
  }
}
