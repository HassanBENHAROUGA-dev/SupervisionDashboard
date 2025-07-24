import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import dayjs from 'dayjs';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-year-month-calendar',
  imports: [
    MatButton,
    MatIcon,
    MatDivider
  ],
  templateUrl: './year-month-calendar.html',
  standalone: true,
  styleUrl: './year-month-calendar.scss'
})
export class YearMonthCalendar implements OnInit {
  @Input() selectedDate!: Date;
  @Input() maxDate!: Date;
  @Input() minDate!: Date;
  monthInformationList: MonthInformation[] = [];
  @Output() selectedDateEventEmitter: EventEmitter<Date> = new EventEmitter<Date>();

  selectedYear!: number;
  selectedMonth!: number;

  displayedYear!: number;
  yearList: number[] = [];
  months: string[] = [
    'JANV.',
    'FÉVR.',
    'MARS',
    'AVRIL',
    'MAI',
    'JUIN',
    'JUIL.',
    'AOÛT',
    'SEPT.',
    'OCT.',
    'NOV.',
    'DÉC.'
  ];

  showMonthList = true;

  constructor(
    /*    private dashboardService: DashboardService,*/
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.selectedYear = this.selectedDate.getFullYear();
    this.displayedYear = this.selectedDate.getFullYear();
    this.selectedMonth = this.selectedDate.getMonth();
    this.yearList = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
    this.updateMonthInformationList();
  }

  /*updateMonthInformationList() {
    this.dashboardService.getMonthInformationListByYear(this.displayedYear).subscribe((data) => {
      this.monthInformationList = data;
      this.changeDetector.detectChanges();
    });
  }*/

  updateMonthInformationList() {
    this.http.get<MonthInformation[]>('assets/mock-data/monthInformationMock.json').subscribe((data) => {
      this.monthInformationList = data;
      this.changeDetector.detectChanges();
    });
  }

  getNotificationNumber(monthNumber: number, yearNumber: number): string {
    const monthInfo: MonthInformation | undefined = this.monthInformationList.find(
      (info) => info.monthNumber === monthNumber && info.yearNumber === yearNumber
    );
    return monthInfo ? (monthInfo.notificationNumber > 99 ? '99+' : monthInfo.notificationNumber.toString()) : '';
  }

  isActiveMonth(monthIndex: number) {
    const firstActiveMonth: Date = dayjs(this.maxDate).subtract(1, 'month').toDate();
    const secondActiveMonth: Date = dayjs(this.maxDate).subtract(2, 'month').toDate();

    return (
      (this.displayedYear === firstActiveMonth.getFullYear() && monthIndex === firstActiveMonth.getMonth()) ||
      (this.displayedYear === secondActiveMonth.getFullYear() && monthIndex === secondActiveMonth.getMonth())
    );
  }

  isSelectedMonth(monthIndex: number) {
    return this.displayedYear === this.selectedYear && this.selectedMonth === monthIndex;
  }

  decrement(event: MouseEvent) {
    event.stopPropagation();
    this.displayedYear--;
    this.updateMonthInformationList();
  }

  increment(event: MouseEvent) {
    event.stopPropagation();
    this.displayedYear++;
    this.updateMonthInformationList();
  }

  isMonthButtonDisabled(i: number) {
    return (
      (this.maxDate.getFullYear() === this.displayedYear && this.maxDate.getMonth() + 1 <= i) ||
      (this.minDate.getFullYear() === this.displayedYear && this.minDate.getMonth() > i)
    );
  }

  toggleYearList(event: MouseEvent) {
    event.stopPropagation();
    this.showMonthList = !this.showMonthList;
  }

  selectYear($event: MouseEvent, year: number) {
    $event.stopPropagation();
    this.showMonthList = true;
    this.displayedYear = year;
    this.updateMonthInformationList();
  }

  selectMonth(i: number) {
    this.selectedMonth = i;
    this.selectedDate.setFullYear(this.displayedYear, this.selectedMonth, 1);
    this.selectedDateEventEmitter.emit(this.selectedDate);
    this.changeDetector.detectChanges();
  }

  isPreviousButtonDisabled() {
    return this.displayedYear === this.minDate.getFullYear();
  }

  isNextButtonDisabled() {
    return this.displayedYear === this.maxDate.getFullYear();
  }

  isYearSelected(year: number) {
    return this.selectedYear === year;
  }

  isYearButtonDisabled(year: number) {
    return this.minDate.getFullYear() > year || this.maxDate.getFullYear() < year;
  }
}
