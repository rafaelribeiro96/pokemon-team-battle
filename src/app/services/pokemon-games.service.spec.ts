import { TestBed } from '@angular/core/testing';

import { PokemonGamesService } from './pokemon-games.service';

describe('PokemonGamesService', () => {
  let service: PokemonGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonGamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
