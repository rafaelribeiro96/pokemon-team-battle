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
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
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
