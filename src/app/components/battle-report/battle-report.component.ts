import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-battle-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="report-container">
      <h2>Relatório da Batalha</h2>
      <div class="report-content" #scrollBox>
        <ul>
          <li
            *ngFor="let entry of reversedLog"
            @newLogEntry
            [ngClass]="{
              'attack-entry': entry.includes('ataca'),
              'fainted-entry': entry.includes('desmaiou'),
              'victory-entry': entry.includes('venceu')
            }"
          >
            <span [innerHTML]="formatLogEntry(entry)"></span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .report-container {
        max-height: 400px;
        overflow-y: auto;
        border: 3px solid #3b4cca;
        padding: 15px;
        background-color: #f8f8f8;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        font-family: 'Press Start 2P', cursive, sans-serif;
        margin-top: 20px;

        h2 {
          text-align: center;
          color: #ff0000;
          text-shadow: 1px 1px 2px #000;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }
      }

      .report-content {
        max-height: 300px;
        overflow-y: auto;

        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;

          li {
            padding: 8px 10px;
            margin-bottom: 8px;
            border-radius: 5px;
            background-color: rgba(255, 203, 5, 0.1);
            border-left: 4px solid #ffcb05;
            font-size: 0.9rem;
            transition: all 0.3s ease;

            &:hover {
              background-color: rgba(255, 203, 5, 0.2);
              transform: translateX(5px);
            }

            &.attack-entry {
              background-color: rgba(255, 87, 34, 0.1);
              border-left: 4px solid #ff5722;
            }

            &.fainted-entry {
              background-color: rgba(158, 158, 158, 0.2);
              border-left: 4px solid #9e9e9e;
            }

            &.victory-entry {
              background-color: rgba(76, 175, 80, 0.2);
              border-left: 4px solid #4caf50;
              font-weight: bold;
            }
          }
        }
      }

      .winner {
        color: #4caf50;
        font-weight: bold;
      }

      .attack {
        color: #ff5722;
        font-weight: bold;
      }

      .fainted {
        color: #9e9e9e;
        font-style: italic;
      }
    `,
  ],
  animations: [
    trigger('newLogEntry', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class BattleReportComponent implements OnChanges {
  @Input() log: string[] = [];
  @ViewChild('scrollBox') private scrollBox!: ElementRef;

  reversedLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['log']) {
      // Reverse the log to show newest entries at the top
      this.reversedLog = [...this.log].reverse();

      // Scroll to top after update
      setTimeout(() => {
        if (this.scrollBox) {
          this.scrollBox.nativeElement.scrollTop = 0;
        }
      }, 0);
    }
  }

  formatLogEntry(entry: string): string {
    // Highlight Pokemon names, attacks, and battle events
    if (entry.includes('venceu a batalha')) {
      return entry.replace(
        /(.*) venceu a batalha!/,
        '<span class="winner">$1</span> venceu a batalha!'
      );
    }
    if (entry.includes('ataca')) {
      return entry.replace(
        /(.*) ataca (.*) e causa (.*)/,
        '<span class="attack">$1</span> ataca <span class="attack">$2</span> e causa <span class="attack">$3</span>'
      );
    }
    if (entry.includes('desmaiou')) {
      return entry.replace(
        /(.*) desmaiou!/,
        '<span class="fainted">$1</span> desmaiou!'
      );
    }
    return entry;
  }
}
