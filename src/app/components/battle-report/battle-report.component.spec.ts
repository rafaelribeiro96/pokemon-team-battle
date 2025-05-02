import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleReportComponent } from './battle-report.component';

describe('BattleReportComponent', () => {
  let component: BattleReportComponent;
  let fixture: ComponentFixture<BattleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
