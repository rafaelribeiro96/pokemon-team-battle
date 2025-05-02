import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BattleComponent } from './pages/battle/battle.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'battle', component: BattleComponent },
];
