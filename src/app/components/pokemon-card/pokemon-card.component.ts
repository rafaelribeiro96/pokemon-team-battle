import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
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
    trigger('attackEffect', [
      transition('inactive => fire', [
        animate(
          '0.6s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(255,69,0,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,69,0,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,69,0,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,69,0,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,69,0,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
      transition('inactive => water', [
        animate(
          '0.6s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(0,105,255,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(0,105,255,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(0,105,255,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(0,105,255,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(0,105,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
      transition('inactive => grass', [
        animate(
          '0.6s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(120,200,80,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(120,200,80,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(120,200,80,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(120,200,80,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(120,200,80,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
      transition('inactive => electric', [
        animate(
          '0.6s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(248,208,48,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(248,208,48,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(248,208,48,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(248,208,48,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(248,208,48,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
      transition('inactive => normal', [
        animate(
          '0.6s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,255,255,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
      transition('inactive => superEffective', [
        animate(
          '0.8s',
          keyframes([
            style({
              background:
                'radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,255,255,0) 70%)',
              offset: 0,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,215,0,0.9) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.2,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,215,0,0.7) 20%, rgba(255,255,255,0) 90%)',
              offset: 0.4,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,215,0,0.5) 10%, rgba(255,255,255,0) 80%)',
              offset: 0.6,
            }),
            style({
              background:
                'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,255,255,0) 70%)',
              offset: 0.8,
            }),
            style({ background: 'none', offset: 1.0 }),
          ])
        ),
      ]),
    ]),
    trigger('superEffectiveText', [
      state('inactive', style({ opacity: 0, transform: 'scale(0)' })),
      state('active', style({ opacity: 0, transform: 'scale(0)' })),
      transition('inactive => active', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('0.2s', style({ opacity: 1, transform: 'scale(1.2)' })),
        animate('0.5s', style({ opacity: 1, transform: 'scale(1)' })),
        animate('0.3s', style({ opacity: 0, transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class PokemonCardComponent implements OnChanges, OnInit {
  @Input() pokemon!: Pokemon;
  @Input() isAttacking = false;
  @Input() isDefending = false;
  @Input() isSuperEffective = false;

  displayHp: number = 0;
  damageState = 'inactive';
  attackEffectState = 'inactive';
  superEffectiveState = 'inactive';
  lastHp: number = 0;
  damageAmount: number = 0;
  Math = Math;
  typeClass: string = '';

  ngOnInit() {
    if (this.pokemon) {
      this.displayHp = this.pokemon.stats.hp;
      this.lastHp = this.pokemon.stats.hp;
      this.setTypeClass();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemon'] && this.pokemon) {
      if (this.lastHp === 0) {
        this.lastHp = this.pokemon.stats.hp;
        this.displayHp = this.pokemon.stats.hp;
        this.setTypeClass();
      } else if (this.lastHp !== this.pokemon.stats.hp) {
        // Calculate damage
        this.damageAmount = Math.max(0, this.lastHp - this.pokemon.stats.hp);

        if (this.damageAmount > 0) {
          // Show damage animation
          this.damageState = 'active';
          setTimeout(() => {
            this.damageState = 'inactive';
          }, 500);
        }

        // Animate HP change
        this.animateHpChange(this.pokemon.stats.hp);
        this.lastHp = this.pokemon.stats.hp;
      }
    }

    if (changes['isDefending'] && this.isDefending) {
      // Show attack effect based on pokemon type
      const type = this.pokemon.type[0].toLowerCase();
      if (type === 'fire') {
        this.attackEffectState = 'fire';
      } else if (type === 'water') {
        this.attackEffectState = 'water';
      } else if (type === 'grass') {
        this.attackEffectState = 'grass';
      } else if (type === 'electric') {
        this.attackEffectState = 'electric';
      } else {
        this.attackEffectState = 'normal';
      }

      setTimeout(() => {
        this.attackEffectState = 'inactive';
      }, 600);
    }

    if (changes['isSuperEffective'] && this.isSuperEffective) {
      this.attackEffectState = 'superEffective';
      this.superEffectiveState = 'active';

      setTimeout(() => {
        this.attackEffectState = 'inactive';
        this.superEffectiveState = 'inactive';
      }, 800);
    }
  }

  setTypeClass() {
    if (this.pokemon && this.pokemon.type && this.pokemon.type.length > 0) {
      this.typeClass = this.pokemon.type[0].toLowerCase();
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
