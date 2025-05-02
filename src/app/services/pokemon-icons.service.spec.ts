import { TestBed } from '@angular/core/testing';

import { PokemonIconsService } from './pokemon-icons.service';

describe('PokemonIconsService', () => {
  let service: PokemonIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
