import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyStatesComponent } from './monthly-states.component';

describe('MonthlyStatesComponent', () => {
  let component: MonthlyStatesComponent;
  let fixture: ComponentFixture<MonthlyStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyStatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
