import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BattleComponent } from './pages/battle/battle.component';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GamesComponent } from './pages/games/games.component';
import { TrainerComponent } from './pages/trainer/trainer.component';
// Importar os novos componentes
import { PokemonComparatorComponent } from './components/pokemon-comparator/pokemon-comparator.component';
import { PokemonQuizComponent } from './components/pokemon-quiz/pokemon-quiz.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokedex/:id', component: PokemonDetailComponent },
  { path: 'games', component: GamesComponent },
  { path: 'trainer', component: TrainerComponent },
  // Adicionar novas rotas
  { path: 'comparator', component: PokemonComparatorComponent },
  { path: 'quiz', component: PokemonQuizComponent },
  { path: '**', component: NotFoundComponent },
];
