import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearMonthCalendar } from './year-month-calendar';

describe('YearMonthCalendar', () => {
  let component: YearMonthCalendar;
  let fixture: ComponentFixture<YearMonthCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearMonthCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearMonthCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
