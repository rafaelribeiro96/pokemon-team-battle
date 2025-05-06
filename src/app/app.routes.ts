/* src/app/app.routes.ts */
import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BattleComponent } from './pages/battle/battle.component';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GamesComponent } from './pages/games/games.component';
import { TrainerComponent } from './pages/trainer/trainer.component';
import { PokemonComparatorComponent } from './components/pokemon-comparator/pokemon-comparator.component';
import { PokemonQuizComponent } from './components/pokemon-quiz/pokemon-quiz.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewsFormComponent } from './components/news/news-form/news-form.component';
import { AuthGuard } from './guards/auth.guard';
import { TeamListComponent } from './components/teams/team-list/team-list.component';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { TeamFormComponent } from './components/teams/team-form/team-form.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokedex/:id', component: PokemonDetailComponent },
  { path: 'games', component: GamesComponent },
  { path: 'trainer', component: TrainerComponent },
  { path: 'comparator', component: PokemonComparatorComponent },
  { path: 'quiz', component: PokemonQuizComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsListComponent },
  { path: 'news/new', component: NewsFormComponent, canActivate: [AuthGuard] },
  {
    path: 'news/edit/:id',
    component: NewsFormComponent,
    canActivate: [AuthGuard],
  },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/new', component: TeamFormComponent, canActivate: [AuthGuard] },
  {
    path: 'teams/edit/:id',
    component: TeamFormComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];
