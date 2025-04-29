import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodcycleComponent } from './periodcycle.component';

describe('PeriodcycleComponent', () => {
  let component: PeriodcycleComponent;
  let fixture: ComponentFixture<PeriodcycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodcycleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodcycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
