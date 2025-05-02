/* scoreboard.component.ts */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <div class="team team-one" [class.winning]="teamOneScore > teamTwoScore">
        <div class="team-header">
          <h3>Time 1</h3>
        </div>
        <div class="score" [@scoreChange]="teamOneScore">
          {{ teamOneScore }}
        </div>
        <div class="pokemon-count">
          <span class="count-label">Pokémon:</span>
          <span class="count-value">{{ teamOneCount }}</span>
        </div>
      </div>

      <div class="vs-container">
        <div class="vs" *ngIf="!winner">VS</div>
        <div class="winner-announcement" *ngIf="winner" [@winnerAnnounce]>
          <div class="trophy-icon">🏆</div>
          <div class="winner-text">{{ winner }} VENCEU!</div>
        </div>
      </div>

      <div class="team team-two" [class.winning]="teamTwoScore > teamOneScore">
        <div class="team-header">
          <h3>Time 2</h3>
        </div>
        <div class="score" [@scoreChange]="teamTwoScore">
          {{ teamTwoScore }}
        </div>
        <div class="pokemon-count">
          <span class="count-label">Pokémon:</span>
          <span class="count-value">{{ teamTwoCount }}</span>
        </div>
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
        position: relative;
        overflow: hidden;
      }

      .team {
        flex: 1;
        text-align: center;
        padding: 15px;
        border-radius: 10px;
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;

        &.winning {
          background-color: rgba(76, 175, 80, 0.3);
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);

          .score {
            color: #4caf50;
            text-shadow: 0 0 10px rgba(76, 175, 80, 0.7);
          }
        }

        .team-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;

          h3 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        }

        .score {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .pokemon-count {
          font-size: 0.9rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 20px;
          padding: 5px 10px;
          display: inline-block;

          .count-label {
            opacity: 0.8;
            margin-right: 5px;
          }

          .count-value {
            font-weight: bold;
          }
        }
      }

      .vs-container {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }

      .vs {
        font-size: 2rem;
        font-weight: bold;
        color: #ffcb05;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }

      .winner-announcement {
        text-align: center;

        .trophy-icon {
          font-size: 2rem;
          color: #ffcb05;
          margin-bottom: 5px;
          animation: float 2s infinite ease-in-out;
        }

        .winner-text {
          color: #4caf50;
          font-weight: bold;
          font-size: 1.2rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          animation: pulse 1.5s infinite;
        }
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

      @keyframes float {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .scoreboard {
          flex-direction: column;
          gap: 15px;
        }

        .team {
          width: 100%;

          &.winning {
            transform: scale(1.02);
          }
        }

        .vs-container {
          padding: 10px 0;
        }
      }
    `,
  ],
  animations: [
    trigger('scoreChange', [
      transition(':increment', [
        style({ transform: 'scale(1.5)', color: '#4caf50' }),
        animate(
          '300ms ease-out',
          style({ transform: 'scale(1)', color: 'white' })
        ),
      ]),
    ]),
    trigger('winnerAnnounce', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('500ms ease-out')),
    ]),
  ],
})
export class ScoreboardComponent implements OnChanges {
  @Input() teamOneScore = 0;
  @Input() teamTwoScore = 0;
  @Input() teamOneCount = 0;
  @Input() teamTwoCount = 0;
  @Input() winner: string | null = null;

  previousTeamOneScore = 0;
  previousTeamTwoScore = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teamOneScore']) {
      this.previousTeamOneScore = changes['teamOneScore'].previousValue || 0;
    }
    if (changes['teamTwoScore']) {
      this.previousTeamTwoScore = changes['teamTwoScore'].previousValue || 0;
    }
  }
}
