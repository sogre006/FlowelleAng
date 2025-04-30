import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarService } from '../../services/calendar.service';
import { PeriodCycleService } from '../../services/periodcycle.service';
import { CycleEntryService } from '../../services/cycleentry.service';
import { Calendar } from '../../models/calendar';
import { Periodcycle } from '../../models/periodcycle';
import { Cycleentry } from '../../models/cycleentry';
import { forkJoin, Observable, of, catchError } from 'rxjs';

interface CalendarDay {
  day: number | null;
  date: Date | null;
  active: boolean;
  selected: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
}

/**
 * CalendarViewComponent - Provides a full month calendar view for cycle tracking
 * 
 * Improvements implemented:
 * 1. Dynamic calendar generation based on actual dates
 * 2. Integration with services to load real data
 * 3. Proper month navigation with date calculations
 * 4. Calculation of period days, fertile window, and ovulation based on data
 */
@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  // Calendar state
  currentDate: Date = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  
  // Calendar data
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthDays: CalendarDay[] = [];
  
  // Data from services
  userId: number = 1; // This would normally come from an auth service
  calendarData: Calendar | null = null;
  cycleData: Periodcycle[] = [];
  entryData: Cycleentry[] = [];
  
  // UI state
  isLoading: boolean = false;
  errorMessage: string = '';

  /**
   * Inject required services and router
   */
  constructor(
    private router: Router,
    private calendarService: CalendarService,
    private periodCycleService: PeriodCycleService,
    private cycleEntryService: CycleEntryService
  ) {}

  /**
   * Initialize the component and load data
   */
  ngOnInit(): void {
    this.initializeCalendarState();
    this.loadCalendarData();
  }

  /**
   * Initialize the calendar with current month/year
   */
  private initializeCalendarState(): void {
    this.currentYear = this.currentDate.getFullYear();
    this.updateMonthDisplay();
  }
  
  /**
   * Updates the month display string based on current date
   */
  private updateMonthDisplay(): void {
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  /**
   * Load all data needed for the calendar from services
   */
  private loadCalendarData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Get current month and year for API requests
    const month = this.currentDate.toLocaleString('default', { month: 'long' });
    const year = this.currentDate.getFullYear();
    
    // Create the requests but don't execute them yet
    const calendarRequest$ = this.calendarService.getCalendarByMonthYear(this.userId, this.currentDate.getMonth() + 1, year)
      .pipe(catchError(error => {
        console.error('Error fetching calendar:', error);
        return of(null);
      }));
      
    const cyclesRequest$ = this.periodCycleService.getCyclesByUserId(this.userId)
      .pipe(catchError(error => {
        console.error('Error fetching cycles:', error);
        return of([]);
      }));
    
    // Execute both requests in parallel
    forkJoin({
      calendar: calendarRequest$,
      cycles: cyclesRequest$
    }).subscribe({
      next: (results) => {
        this.calendarData = results.calendar;
        this.cycleData = results.cycles;
        
        // If we have a calendar, load the entries
        if (this.calendarData) {
          this.loadEntriesForCalendar(this.calendarData.calendar_id);
        } else {
          this.generateCalendarGrid();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading calendar data:', err);
        this.errorMessage = 'Could not load calendar data. Please try again later.';
        this.isLoading = false;
        this.generateCalendarGrid(); // Still generate the grid even if data loading fails
      }
    });
  }
  
  /**
   * Load entries for a specific calendar
   */
  private loadEntriesForCalendar(calendarId: number): void {
    this.cycleEntryService.getEntriesByCalendarId(calendarId)
      .pipe(catchError(error => {
        console.error('Error fetching entries:', error);
        return of([]);
      }))
      .subscribe({
        next: (entries) => {
          this.entryData = entries;
          this.generateCalendarGrid();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading entries:', err);
          this.generateCalendarGrid(); // Still generate the grid even if entries fail to load
          this.isLoading = false;
        }
      });
  }

  /**
   * Generate the calendar grid for the current month
   */
  private generateCalendarGrid(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Create a date object for the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Get the number of days in the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    // Convert to Monday = 0 format for our calendar
    let firstDayWeekday = firstDayOfMonth.getDay() - 1;
    if (firstDayWeekday < 0) firstDayWeekday = 6; // Sunday becomes 6
    
    // Clear the calendar grid
    this.monthDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      this.monthDays.push({
        day: null,
        date: null,
        active: false,
        selected: false,
        isPeriod: false,
        isFertile: false,
        isOvulation: false
      });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Check if this date is a period day, fertile day, or ovulation day
      const isPeriod = this.isPeriodDay(date);
      const isFertile = this.isFertileDay(date);
      const isOvulation = this.isOvulationDay(date);
      const active = isPeriod || isFertile || isOvulation;
      
      // Check if this is the selected day (current date by default)
      const isToday = this.isSameDay(date, new Date());
      
      this.monthDays.push({
        day: day,
        date: date,
        active: active,
        selected: isToday,
        isPeriod: isPeriod,
        isFertile: isFertile,
        isOvulation: isOvulation
      });
    }
    
    // Add empty cells for days after the end of the month to complete the grid
    const totalCells = Math.ceil((firstDayWeekday + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayWeekday + daysInMonth);
    
    for (let i = 0; i < remainingCells; i++) {
      this.monthDays.push({
        day: null,
        date: null,
        active: false,
        selected: false,
        isPeriod: false,
        isFertile: false,
        isOvulation: false
      });
    }
  }
  
  /**
   * Check if a date is a period day based on cycle data
   */
  private isPeriodDay(date: Date): boolean {
    return this.cycleData.some(cycle => {
      const startDate = new Date(cycle.start_date);
      const endDate = new Date(cycle.end_date);
      return date >= startDate && date <= endDate;
    });
  }
  
  /**
   * Calculate and check if a date is in the fertile window
   * Typically 5 days before ovulation and the day of ovulation
   */
  private isFertileDay(date: Date): boolean {
    for (const cycle of this.cycleData) {
      const startDate = new Date(cycle.start_date);
      
      // Find the ovulation day (typically 14 days before the next period)
      // For simplicity, we'll estimate it as 14 days after the start of the current period
      // In a real app, this should use a more sophisticated algorithm or data from the user
      const ovulationDate = new Date(startDate);
      ovulationDate.setDate(startDate.getDate() + 14);
      
      // Fertile window is typically 5 days before ovulation and the day of ovulation
      const fertileWindowStart = new Date(ovulationDate);
      fertileWindowStart.setDate(ovulationDate.getDate() - 5);
      
      if (date >= fertileWindowStart && date <= ovulationDate) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Check if a date is an ovulation day based on cycle data
   * Typically occurs 14 days before the next period
   */
  private isOvulationDay(date: Date): boolean {
    for (const cycle of this.cycleData) {
      const startDate = new Date(cycle.start_date);
      
      // For simplicity, we'll estimate ovulation as 14 days after period start
      // In a real app, this should use a more sophisticated algorithm
      const ovulationDate = new Date(startDate);
      ovulationDate.setDate(startDate.getDate() + 14);
      
      if (this.isSameDay(date, ovulationDate)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Compare two dates to see if they're the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * Handle date selection in the calendar
   */
  selectDate(day: number | null): void {
    if (day !== null) {
      // Find the day object
      this.monthDays.forEach(item => {
        if (item.day !== null) {
          item.selected = item.day === day;
        }
      });
      
      // Get the selected day object
      const selectedDay = this.monthDays.find(d => d.day === day);
      
      if (selectedDay && selectedDay.date) {
        console.log(`Selected date: ${selectedDay.date.toLocaleDateString()}`);
        
        // Here you would typically:
        // 1. Update UI to show more details about the selected day
        // 2. Load any additional data for the selected day
        // 3. Allow users to add or edit entries for this day
      }
    }
  }

  /**
   * Navigate to the previous or next month
   */
  navigateMonth(direction: number): void {
    // Create a new date for the navigation to avoid mutating the current date
    const newDate = new Date(this.currentDate);
    
    // Move to the previous or next month
    newDate.setMonth(newDate.getMonth() + direction);
    
    // Update the current date
    this.currentDate = newDate;
    this.currentYear = newDate.getFullYear();
    
    // Update the month display
    this.updateMonthDisplay();
    
    // Reload the calendar data
    this.loadCalendarData();
  }

  /**
   * Navigate to the dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Open the cycle form to add a new entry
   */
  openCycleForm(): void {
    this.router.navigate(['/cycle-form']);
  }

  /**
   * Navigate to the user profile
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}