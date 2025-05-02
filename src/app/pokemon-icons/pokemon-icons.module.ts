import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonIconComponent } from '../components/pokemon-icon/pokemon-icon.component';
import { PokemonIconSelectorComponent } from '../components/pokemon-icon-selector/pokemon-icon-selector.component';
import { PokemonIconDirective } from '../directives/pokemon-icon.directive';
import { PokemonIconsService } from '../services/pokemon-icons.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PokemonIconComponent,
    PokemonIconSelectorComponent,
    PokemonIconDirective,
  ],
  exports: [
    PokemonIconComponent,
    PokemonIconSelectorComponent,
    PokemonIconDirective,
  ],
  providers: [PokemonIconsService],
})
export class PokemonIconsModule {}
