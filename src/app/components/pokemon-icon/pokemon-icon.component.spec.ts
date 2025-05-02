import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonIconComponent } from './pokemon-icon.component';

describe('PokemonIconComponent', () => {
  let component: PokemonIconComponent;
  let fixture: ComponentFixture<PokemonIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
