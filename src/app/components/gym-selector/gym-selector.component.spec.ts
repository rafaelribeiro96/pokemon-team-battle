import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymSelectorComponent } from './gym-selector.component';

describe('GymSelectorComponent', () => {
  let component: GymSelectorComponent;
  let fixture: ComponentFixture<GymSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
