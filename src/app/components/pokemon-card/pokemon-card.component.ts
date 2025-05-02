/* pokemon-card.component.ts */
import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { PokemonIconsModule } from '../../pokemon-icons/pokemon-icons.module';
import { PokemonIconComponent } from '../pokemon-icon/pokemon-icon.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PokemonIconsModule,
    PokemonIconComponent,
    MatProgressBarModule,
  ],
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
    trigger('iconAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'scale(0.5)' })),
      ]),
    ]),
  ],
})
export class PokemonCardComponent implements OnChanges, OnInit {
  @Input() pokemon!: Pokemon;
  @Input() isAttacking = false;
  @Input() isDefending = false;
  @Input() isSuperEffective = false;
  @Input() isStrongest = false;
  @Input() showDetails: boolean = true;
  @Input() compact: boolean = false;

  displayHp: number = 0;
  damageState = 'inactive';
  attackEffectState = 'inactive';
  superEffectiveState = 'inactive';
  lastHp: number = 0;
  damageAmount: number = 0;
  Math = Math;
  typeClass: string = '';
  justAttacked: boolean = false;
  hpPercentage: number = 100;
  hpColor: string = 'primary';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.pokemon) {
      this.displayHp = this.pokemon.stats?.hp || 0;
      this.lastHp = this.displayHp;
      this.setTypeClass();
      this.updateHpStatus();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemon'] && this.pokemon) {
      if (this.lastHp === 0) {
        this.lastHp = this.pokemon.stats?.hp || 0;
        this.displayHp = this.lastHp;
        this.setTypeClass();
      } else {
        const currentHp = this.pokemon.stats?.hp || 0;
        if (this.lastHp !== currentHp) {
          // Calculate damage
          this.damageAmount = Math.max(0, this.lastHp - currentHp);

          if (this.damageAmount > 0) {
            // Show damage animation
            this.damageState = 'active';
            setTimeout(() => {
              this.damageState = 'inactive';
            }, 500);
          }

          // Animate HP change
          this.animateHpChange(currentHp);
          this.lastHp = currentHp;
        }
      }

      this.updateHpStatus();
      this.cdr.detectChanges();
    }

    if (changes['isDefending'] && this.isDefending) {
      // Show attack effect based on pokemon type
      const type = this.getFirstType().toLowerCase();
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

    if (changes['isAttacking'] && this.isAttacking) {
      this.justAttacked = true;
      setTimeout(() => {
        this.justAttacked = false;
      }, 2000);
    }
  }

  setTypeClass() {
    if (this.pokemon && this.pokemon.type && this.pokemon.type.length > 0) {
      this.typeClass = this.pokemon.type[0].toLowerCase();
    }
  }

  getFirstType(): string {
    if (this.pokemon && this.pokemon.type && this.pokemon.type.length > 0) {
      return this.pokemon.type[0];
    }
    return 'normal';
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
      this.updateHpStatus();
      this.cdr.detectChanges();

      if (progress < 1) {
        requestAnimationFrame(updateHp);
      } else {
        this.displayHp = targetHp;
        this.updateHpStatus();
        this.cdr.detectChanges();
      }
    };

    requestAnimationFrame(updateHp);
  }

  getCardClasses() {
    const classes: { [key: string]: boolean } = {
      attacking: this.isAttacking,
      fainted: this.pokemon.isFainted ?? false,
      defending: this.isDefending,
      'type-themed': true,
      strongest: this.isStrongest,
      compact: this.compact,
    };

    if (this.typeClass) {
      classes[this.typeClass] = true;
    }

    return classes;
  }

  getTypeIcon(type: string): string | null {
    const typeMap: { [key: string]: string } = {
      fire: 'fire-type',
      water: 'water-type',
      grass: 'grass-type',
      electric: 'electric-type',
      psychic: 'psychic-type',
      ice: 'ice-type',
      dragon: 'dragon-type',
      dark: 'dark-type',
      normal: 'normal-type',
      fighting: 'fighting-type',
      flying: 'flying-type',
      poison: 'poison-type',
      ground: 'ground-type',
      rock: 'rock-type',
      bug: 'bug-type',
      ghost: 'ghost-type',
      steel: 'steel-type',
      fairy: 'fairy-type',
    };

    return typeMap[type.toLowerCase()] || null;
  }

  updateHpStatus(): void {
    if (this.pokemon && this.pokemon.stats) {
      const maxHp = this.pokemon.stats.maxHp || 100;
      const currentHp = this.pokemon.stats.hp || 0;

      this.hpPercentage = (currentHp / maxHp) * 100;

      if (this.hpPercentage > 50) {
        this.hpColor = 'primary';
      } else if (this.hpPercentage > 20) {
        this.hpColor = 'accent';
      } else {
        this.hpColor = 'warn';
      }
    }
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }

  getTypes(): string[] {
    if (this.pokemon && this.pokemon.type) {
      return this.pokemon.type;
    }
    return [];
  }

  getMaxHp(): number {
    return this.pokemon?.stats?.maxHp || 100;
  }

  getCurrentHp(): number {
    return this.pokemon?.stats?.hp || 0;
  }

  getHpPercentage(): number {
    if (this.pokemon && this.pokemon.stats) {
      return (this.pokemon.stats.hp / this.pokemon.stats.maxHp) * 100;
    }
    return 0;
  }
}
