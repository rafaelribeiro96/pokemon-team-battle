import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonComparatorComponent } from './pokemon-comparator.component';

describe('PokemonComparatorComponent', () => {
  let component: PokemonComparatorComponent;
  let fixture: ComponentFixture<PokemonComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonComparatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
