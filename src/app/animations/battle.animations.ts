import { trigger, transition, style, animate } from '@angular/animations';

export const battleAnimations = [
  trigger('attack', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('500ms ease-out', style({ transform: 'translateX(0)' })),
    ]),
  ]),
];
