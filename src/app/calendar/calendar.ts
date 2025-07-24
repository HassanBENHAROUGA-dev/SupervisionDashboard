import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import dayjs from 'dayjs';
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuContent, MatMenuTrigger} from '@angular/material/menu';
import {MatButton} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {YearMonthCalendar} from '../year-month-calendar/year-month-calendar';

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.html',
  styleUrl: 'calendar.scss',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatButton,
    MatMenuContent,
    YearMonthCalendar
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calendar implements OnInit, OnChanges {
  @Input() monthDayInformationList!: DayInformation[];
  @Output() selectedDateEventEmitter: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() displayedDateEventEmitter: EventEmitter<Date> = new EventEmitter<Date>();
  monthDayList: DayInformation[] = [];
  selectedDate: Date = new Date();
  displayedDate: Date = new Date();
  maxDate: Date = new Date();
  minDate: Date = new Date(2020, 0, 1);
  days: number[] = [];
  currentWeekday!: string;
  WEEK_DAYS: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  FRENCH_MONTH_LIST: string[] = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];

  constructor(private changeDetector: ChangeDetectorRef, private http:HttpClient) {
  }

  ngOnInit() {
    //this.maxDate = dayjs().subtract(AppConstants.FIRST_CALCUL_DAY_DELAY, 'day').toDate();
    this.maxDate = dayjs().subtract(4, 'day').toDate();
    this.selectedDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate());
    this.displayedDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate());
    this.currentWeekday = this.WEEK_DAYS[this.selectedDate.getDay() - 1];
    this.updateCalendarDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['monthDayInformationList'] && this.monthDayInformationList.length > 0) {
      this.updateCalendarDisplay();
    }
  }

/*  updateCalendarDisplay(): void {
    const adjustedIndex: number = this.getFirstDayIndexOfSelectedMonth();
    const lastDay: number = dayjs(this.displayedDate).daysInMonth();
    if (!this.monthDayInformationList) return;
    this.monthDayList = this.monthDayInformationList.filter(
      (m: DayInformation) =>
        m.date.getMonth() === this.displayedDate.getMonth() && m.date.getFullYear() === this.displayedDate.getFullYear()
    );
    this.days = Array(adjustedIndex).fill(0);
    this.days = [...this.days, ...Array.from({length: lastDay}, (_, i) => i + 1)];
    this.changeDetector.detectChanges();
    console.log('DAYS ARRAY:', this.days);

  }*/

  updateCalendarDisplay(): void {
    const adjustedIndex: number = this.getFirstDayIndexOfSelectedMonth();
    const lastDay: number = dayjs(this.displayedDate).daysInMonth();

    this.http.get<DayInformation[]>('assets/mock-data/daysInformationsMock.json').subscribe({
      next: (data) => {
        this.monthDayInformationList = data.map(d => ({
          ...d,
          date: new Date(d.date)
        }));

        // Now that we have the data, we can filter it
        this.monthDayList = this.monthDayInformationList.filter(
          (m: DayInformation) =>
            m.date.getMonth() === this.displayedDate.getMonth() &&
            m.date.getFullYear() === this.displayedDate.getFullYear()
        );

        // Build the days array
        this.days = Array(adjustedIndex).fill(0);
        this.days = [...this.days, ...Array.from({ length: lastDay }, (_, i) => i + 1)];

        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load mock day data:', err);
      }
    });
  }


  private getFirstDayIndexOfSelectedMonth(): number {
    const firstDay: Date = this.getFirstDayOfSelectedMonth();
    return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  }

  /** Retourne le premier jour du mois sélectionné */
  private getFirstDayOfSelectedMonth(): Date {
    return new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth(), 1);
  }

  onDaySelected(day: number): void {
    this.selectedDate.setFullYear(this.displayedDate.getFullYear());
    this.selectedDate.setMonth(this.displayedDate.getMonth());
    this.selectedDate.setDate(day);
    this.selectedDateEventEmitter.emit(this.selectedDate);
    this.changeDetector.detectChanges();
  }

  /** Génère le calendrier pour le mois sélectionné */
  generateCalendar(): void {
    this.days = [];
    this.updateCalendarDisplay();
  }

  getMonthName(month: number): string {
    return this.FRENCH_MONTH_LIST[month];
  }

  decrementSelectedMonth() {
    this.displayedDate = dayjs(this.displayedDate).subtract(1, 'month').toDate();
    this.displayedDateEventEmitter.emit(this.displayedDate);
    this.updateCalendarDisplay();
  }

  incrementSelectedMonth() {
    this.displayedDate = dayjs(this.displayedDate).add(1, 'month').toDate();
    this.displayedDateEventEmitter.emit(this.displayedDate);
    this.updateCalendarDisplay();
  }

  isSameMonth(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  }

  isDayDisabled(day: number): boolean {
    return this.isSameMonth(this.displayedDate, this.maxDate) && this.maxDate.getDate() < day;
  }

  updateSelectedDate(date: Date) {
    this.selectedDate = date;
    this.displayedDate = date;
    this.displayedDateEventEmitter.emit(this.displayedDate);
    this.generateCalendar();
  }

  isDecrementMonthDisabled() {
    return dayjs(this.displayedDate).subtract(1, 'month').isBefore(this.minDate);
  }

  isIncrementMonthDisabled() {
    return dayjs(this.displayedDate).add(1, 'month').isAfter(this.maxDate);
  }

  isDaySelected(day: number) {
    return this.isSameMonth(this.displayedDate, this.selectedDate) && this.selectedDate.getDate() === day;
  }
}
