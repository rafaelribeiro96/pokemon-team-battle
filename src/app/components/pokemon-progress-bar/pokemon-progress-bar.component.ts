import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-progress-bar.component.html',
  styleUrls: ['./pokemon-progress-bar.component.scss'],
})
export class PokemonProgressBarComponent {
  @Input() progress: number = 0;
}
