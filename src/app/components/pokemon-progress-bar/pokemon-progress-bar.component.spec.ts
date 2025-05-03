import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonProgressBarComponent } from './pokemon-progress-bar.component';

describe('PokemonProgressBarComponent', () => {
  let component: PokemonProgressBarComponent;
  let fixture: ComponentFixture<PokemonProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
