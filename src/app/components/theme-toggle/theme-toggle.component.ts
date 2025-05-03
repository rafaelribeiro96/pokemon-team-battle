import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle-button"
      [class.dark]="currentTheme === 'dark'"
      (click)="toggleTheme()"
      aria-label="Alternar tema"
    >
      <div class="toggle-icon sun" *ngIf="currentTheme === 'dark'">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </div>
      <div class="toggle-icon moon" *ngIf="currentTheme === 'light'">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </button>
  `,
  styles: [
    `
      .theme-toggle-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background-color: var(--card-background);
        box-shadow: 0 2px 8px var(--shadow-color);
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-color);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow-color);
        }

        &.dark {
          background-color: #333;
          color: #ffcb05;
        }
      }

      .toggle-icon {
        width: 24px;
        height: 24px;

        svg {
          width: 100%;
          height: 100%;
        }

        &.sun {
          color: #ffcb05;
        }

        &.moon {
          color: #3d7dca;
        }
      }
    `,
  ],
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.getTheme().subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
