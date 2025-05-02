import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-filter.component.html',
  styleUrls: ['./type-filter.component.scss'],
})
export class TypeFilterComponent {
  @Input() types: string[] = [];
  @Input() selectedType: string | null = null;
  @Output() typeSelect = new EventEmitter<string | null>();

  selectType(type: string | null): void {
    this.typeSelect.emit(type);
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
