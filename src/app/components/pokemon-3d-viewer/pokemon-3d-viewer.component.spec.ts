import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pokemon3DViewerComponent } from './pokemon-3d-viewer.component';

describe('Pokemon3dviewerComponent', () => {
  let component: Pokemon3DViewerComponent;
  let fixture: ComponentFixture<Pokemon3DViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pokemon3DViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Pokemon3DViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
