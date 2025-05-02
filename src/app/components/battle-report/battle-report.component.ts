import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-battle-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battle-report.component.html',
  styleUrls: ['./battle-report.component.scss'],
})
export class BattleReportComponent {
  @Input() log: string[] = [];
}
