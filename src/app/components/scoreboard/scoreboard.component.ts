// scoreboard.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <div class="team team-one" [class.winning]="teamOneScore > teamTwoScore">
        <h3>Time 1</h3>
        <div class="score">{{ teamOneScore }}</div>
        <div class="pokemon-count">Pokémon: {{ teamOneCount }}</div>
      </div>

      <div class="vs">
        <span *ngIf="!winner">VS</span>
        <span *ngIf="winner" class="winner-text">{{ winner }} VENCEU!</span>
      </div>

      <div class="team team-two" [class.winning]="teamTwoScore > teamOneScore">
        <h3>Time 2</h3>
        <div class="score">{{ teamTwoScore }}</div>
        <div class="pokemon-count">Pokémon: {{ teamTwoCount }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .scoreboard {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #3b4cca, #1a237e);
        border-radius: 15px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        color: white;
      }

      .team {
        flex: 1;
        text-align: center;
        padding: 10px;
        border-radius: 10px;
        transition: all 0.3s ease;

        &.winning {
          background-color: rgba(76, 175, 80, 0.3);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
        }

        h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
        }

        .score {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .pokemon-count {
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }

      .vs {
        font-size: 2rem;
        font-weight: bold;
        color: #ffcb05;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        padding: 0 20px;
      }

      .winner-text {
        color: #4caf50;
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ScoreboardComponent {
  @Input() teamOneScore = 0;
  @Input() teamTwoScore = 0;
  @Input() teamOneCount = 0;
  @Input() teamTwoCount = 0;
  @Input() winner: string | null = null;
}
