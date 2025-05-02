import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAvatarSelectorComponent } from './trainer-avatar-selector.component';

describe('TrainerAvatarSelectorComponent', () => {
  let component: TrainerAvatarSelectorComponent;
  let fixture: ComponentFixture<TrainerAvatarSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerAvatarSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerAvatarSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
