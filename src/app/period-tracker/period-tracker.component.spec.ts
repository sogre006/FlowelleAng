import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodTrackerComponent } from './period-tracker.component';

describe('PeriodTrackerComponent', () => {
  let component: PeriodTrackerComponent;
  let fixture: ComponentFixture<PeriodTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
