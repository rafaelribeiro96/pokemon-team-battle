import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isPlaying: boolean = false;
  audio: HTMLAudioElement | null = null;
  volume: number = 0.5;
  userName: string = 'Ash Ketchum'; // Nome mockado do usuário

  ngOnInit(): void {
    this.audio = new Audio('/assets/music/pokemon-abertura.mp3');
    this.audio.loop = true;
    this.audio.volume = this.volume;
  }

  togglePlay(): void {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  setVolume(event: Event): void {
    if (!this.audio) return;

    const input = event.target as HTMLInputElement;
    this.volume = Number(input.value);
    this.audio.volume = this.volume;
  }

  stopMusic(): void {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }
}
