import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonIconSelectorComponent } from './pokemon-icon-selector.component';

describe('PokemonIconSelectorComponent', () => {
  let component: PokemonIconSelectorComponent;
  let fixture: ComponentFixture<PokemonIconSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonIconSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonIconSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
