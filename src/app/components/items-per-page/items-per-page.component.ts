import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items-per-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.scss'],
})
export class ItemsPerPageComponent {
  @Input() options: number[] = [20, 50, 100];
  @Input() selected: number = 20;
  @Output() selectionChange = new EventEmitter<number>();

  onSelectionChange(value: number): void {
    this.selected = value;
    this.selectionChange.emit(value);
  }
}
