import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('hpChange', [transition('* => *', [animate('0.5s ease-out')])]),
    trigger('damageEffect', [
      state(
        'inactive',
        style({
          opacity: 0,
          transform: 'translateY(0) scale(1)',
        })
      ),
      state(
        'active',
        style({
          opacity: 0,
          transform: 'translateY(-20px) scale(1.5)',
        })
      ),
      transition('inactive => active', [
        style({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        }),
        animate('0.5s ease-out'),
      ]),
    ]),
  ],
})
export class PokemonCardComponent implements OnChanges {
  @Input() pokemon!: Pokemon;
  @Input() isAttacking = false;

  displayHp: number = 0;
  damageState = 'inactive';
  lastHp: number = 0;
  damageAmount: number = 0;
  Math = Math;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemon'] && this.pokemon) {
      if (this.lastHp === 0) {
        this.lastHp = this.pokemon.stats.hp;
        this.displayHp = this.pokemon.stats.hp;
      } else if (this.lastHp !== this.pokemon.stats.hp) {
        // Calculate damage
        this.damageAmount = this.lastHp - this.pokemon.stats.hp;

        // Animate HP change
        this.animateHpChange(this.pokemon.stats.hp);
        this.lastHp = this.pokemon.stats.hp;
      }
    }
  }

  animateHpChange(targetHp: number) {
    const startHp = this.displayHp;
    const diff = startHp - targetHp;
    const duration = 500; // ms
    const startTime = performance.now();

    const updateHp = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.displayHp = startHp - diff * progress;

      if (progress < 1) {
        requestAnimationFrame(updateHp);
      } else {
        this.displayHp = targetHp;
      }
    };

    requestAnimationFrame(updateHp);
  }
}
