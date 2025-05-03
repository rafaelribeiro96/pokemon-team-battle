import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonQuizComponent } from './pokemon-quiz.component';

describe('PokemonQuizComponent', () => {
  let component: PokemonQuizComponent;
  let fixture: ComponentFixture<PokemonQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
