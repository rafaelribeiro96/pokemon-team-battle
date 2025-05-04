/* scoreboard.component.ts */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';
import {
  trigger,
  transition,
  style,
  animate,
  state,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule, PokemonIconsModule, PokemonIconComponent],
  template: `
    <div class="scoreboard">
      <div
        class="team team-one"
        [class.winner]="winner === 'Time 1'"
        [ngClass]="getGymClass(teamOneGym)"
      >
        <div class="team-name">
          <app-pokemon-icon
            [iconId]="teamOneTrainer"
            size="sm"
          ></app-pokemon-icon>
          {{ teamOneName }}
        </div>
        <div class="team-score" [@scoreChange]="teamOneScore">
          {{ teamOneScore }}
        </div>
        <div class="team-pokeballs">
          <app-pokemon-icon
            *ngFor="let i of [].constructor(teamOneCount)"
            iconId="pokeball"
            size="xs"
            [@pokeballAnimation]
          >
          </app-pokemon-icon>
          <app-pokemon-icon
            *ngFor="let i of [].constructor(6 - teamOneCount)"
            iconId="fainted-pokeball"
            size="xs"
            [@faintedAnimation]
          >
          </app-pokemon-icon>
        </div>
      </div>

      <div class="vs">
        <app-pokemon-icon
          *ngIf="!winner"
          iconId="battle"
          size="md"
          [@pulseAnimation]="'active'"
        >
        </app-pokemon-icon>
        <app-pokemon-icon
          *ngIf="winner"
          iconId="trophy"
          size="md"
          [@trophyAnimation]="'active'"
        >
        </app-pokemon-icon>
      </div>

      <div
        class="team team-two"
        [class.winner]="winner === 'Time 2'"
        [ngClass]="getGymClass(teamTwoGym)"
      >
        <div class="team-name">
          <app-pokemon-icon
            [iconId]="teamTwoTrainer"
            size="sm"
          ></app-pokemon-icon>
          {{ teamTwoName }}
        </div>
        <div class="team-score" [@scoreChange]="teamTwoScore">
          {{ teamTwoScore }}
        </div>
        <div class="team-pokeballs">
          <app-pokemon-icon
            *ngFor="let i of [].constructor(teamTwoCount)"
            iconId="pokeball"
            size="xs"
            [@pokeballAnimation]
          >
          </app-pokemon-icon>
          <app-pokemon-icon
            *ngFor="let i of [].constructor(6 - teamTwoCount)"
            iconId="fainted-pokeball"
            size="xs"
            [@faintedAnimation]
          >
          </app-pokemon-icon>
        </div>
      </div>
    </div>

    <div *ngIf="winner" class="winner-announcement" [@winnerAnnounce]>
      <div class="winner-text">
        <app-pokemon-icon
          [iconId]="winner === 'Time 1' ? teamOneTrainer : teamTwoTrainer"
          size="md"
        >
        </app-pokemon-icon>
        {{ winner === 'Time 1' ? teamOneName : teamTwoName }} VENCEU!
      </div>
    </div>
  `,
  styleUrls: ['./scoreboard.component.scss'],
  animations: [
    trigger('scoreChange', [
      transition(':increment', [
        animate(
          '0.5s',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.5)', color: '#4caf50', offset: 0.5 }),
            style({ transform: 'scale(1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('winnerAnnounce', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        animate(
          '0.5s ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(5px)', offset: 0.7 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('pokeballAnimation', [
      state('*', style({ transform: 'rotate(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0) rotate(-180deg)' }),
        animate(
          '0.5s ease-out',
          style({ opacity: 1, transform: 'scale(1) rotate(0)' })
        ),
      ]),
    ]),
    trigger('faintedAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0) rotate(0)' }),
        animate(
          '0.5s ease-out',
          style({ opacity: 0.7, transform: 'scale(1) rotate(180deg)' })
        ),
      ]),
    ]),
    trigger('pulseAnimation', [
      state('active', style({ transform: 'scale(1)' })),
      transition('* => active', [
        animate(
          '2s ease-in-out',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.1)', offset: 0.5 }),
            style({ transform: 'scale(1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('trophyAnimation', [
      state('active', style({ transform: 'translateY(0)' })),
      transition('* => active', [
        animate(
          '1.5s ease-in-out',
          keyframes([
            style({ transform: 'translateY(0)', offset: 0 }),
            style({ transform: 'translateY(-10px)', offset: 0.5 }),
            style({ transform: 'translateY(0)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ScoreboardComponent implements OnChanges {
  @Input() teamOneScore: number = 0;
  @Input() teamTwoScore: number = 0;
  @Input() teamOneCount: number = 0;
  @Input() teamTwoCount: number = 0;
  @Input() winner: string | null = null;

  // New inputs for trainer icons and names
  @Input() teamOneTrainer: string = 'trainer-red';
  @Input() teamTwoTrainer: string = 'trainer-blue';
  @Input() teamOneName: string = 'Time 1';
  @Input() teamTwoName: string = 'Time 2';
  @Input() teamOneGym: string = '';
  @Input() teamTwoGym: string = '';

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

  // Method to get gym class based on gym ID
  getGymClass(gymId: string): string {
    if (!gymId) return '';

    const gymType = gymId.split('-')[0]; // Extracts 'fire', 'water', etc.
    return `gym-${gymType}`;
  }
}
