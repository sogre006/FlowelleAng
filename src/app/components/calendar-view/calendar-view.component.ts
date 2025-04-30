import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent {
  currentMonth: string = 'March 2025';
  currentYear: number = 2025;
  
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  monthDays = [
    { day: null, active: false, selected: false },
    { day: null, active: false, selected: false },
    { day: 1, active: false, selected: false },
    { day: 2, active: true, selected: true },
    { day: 3, active: false, selected: false },
    { day: 4, active: false, selected: false },
    { day: 5, active: true, selected: false },
    { day: 6, active: true, selected: false },
    { day: 7, active: true, selected: false },
    { day: 8, active: false, selected: false },
    { day: 9, active: false, selected: false },
    { day: 10, active: false, selected: false },
    { day: 11, active: false, selected: false },
    { day: 12, active: false, selected: false },
    { day: 13, active: false, selected: false },
    { day: 14, active: false, selected: false },
    { day: 15, active: true, selected: false },
    { day: 16, active: true, selected: false },
    { day: 17, active: true, selected: false },
    { day: 18, active: true, selected: false },
    { day: 19, active: true, selected: false },
    { day: 20, active: false, selected: false },
    { day: 21, active: false, selected: false },
    { day: 22, active: false, selected: false },
    { day: 23, active: false, selected: false },
    { day: 24, active: false, selected: false },
    { day: 25, active: false, selected: false },
    { day: 26, active: false, selected: false },
    { day: 27, active: false, selected: false },
    { day: 28, active: false, selected: false },
    { day: 29, active: false, selected: false },
    { day: 30, active: false, selected: false },
    { day: 31, active: false, selected: false }
  ];

  constructor(private router: Router) {}

  selectDate(day: number | null) {
    if (day !== null) {
      // Reset all selections
      this.monthDays.forEach(item => {
        if (item.day !== null) {
          item.selected = item.day === day;
        }
      });

      console.log(Selected date: ${this.currentMonth} ${day}, ${this.currentYear});
    }
  }

  navigateMonth(direction: number) {
    // In a real app, this would properly update the month and regenerate the calendar
    if (direction > 0) {
      this.currentMonth = 'April 2025';
    } else {
      this.currentMonth = 'February 2025';
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  openCycleForm() {
    this.router.navigate(['/cycle-form']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}