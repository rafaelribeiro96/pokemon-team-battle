import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BattleComponent } from './pages/battle/battle.component';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GamesComponent } from './pages/games/games.component';
import { TrainerComponent } from './pages/trainer/trainer.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokedex/:id', component: PokemonDetailComponent },
  { path: 'games', component: GamesComponent },
  { path: 'trainer', component: TrainerComponent },
  { path: '**', component: NotFoundComponent },
];
