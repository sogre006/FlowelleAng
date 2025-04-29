import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-period-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './period-tracker.component.html',
  styleUrls: ['./period-tracker.component.css']
})
export class PeriodTrackerComponent {
  currentDay = 2;
  cycleStage = 'Menstrual';
  currentMonth = 'March 2025';
  selectedDate = new Date(2025, 2, 2); // March 2, 2025
  showFullCalendar = false;
  showAddModal = false;
  showCalendarPicker = false;
  
  // Date picker fields
  startDateInput = '';
  endDateInput = '';
  
  constructor(private router: Router) {}
  
  dates = [
    { day: 3, dayOfWeek: 'S', active: false },
    { day: 4, dayOfWeek: 'S', active: false },
    { day: 5, dayOfWeek: 'M', active: true },
    { day: 6, dayOfWeek: 'T', active: true, selected: false },
    { day: 7, dayOfWeek: 'W', active: true },
    { day: 8, dayOfWeek: 'T', active: false },
    { day: 9, dayOfWeek: 'F', active: false }
  ];

  monthDays = [
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
    { day: 15, active: false, selected: false },
    { day: 16, active: false, selected: false },
    { day: 17, active: false, selected: false },
    { day: 18, active: false, selected: false },
    { day: 19, active: false, selected: false },
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

  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleCalendar() {
    this.showFullCalendar = !this.showFullCalendar;
    // Close add modal if open
    if (this.showAddModal) {
      this.showAddModal = false;
    }
  }

  closeCalendar() {
    this.showFullCalendar = false;
  }

  toggleAddModal() {
    this.showAddModal = !this.showAddModal;
    this.showCalendarPicker = false;
    this.startDateInput = '';
    this.endDateInput = '';
    
    // Close calendar if open
    if (this.showFullCalendar) {
      this.showFullCalendar = false;
    }
  }

  toggleCalendarPicker() {
    this.showCalendarPicker = !this.showCalendarPicker;
  }

  selectDate(day: number | null) {
    if (day !== null) {
      this.selectedDate = new Date(2025, 2, day); // March 2025
      this.currentDay = day;
      console.log('Selected date:', this.selectedDate);
      
      // Update the selected state in monthDays
      this.monthDays.forEach(item => {
        if (item.day === day) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
      
      // If calendar picker is open, fill in the start date
      if (this.showCalendarPicker) {
        this.startDateInput = `${this.selectedDate.getMonth() + 1}/${this.selectedDate.getDate()}/${this.selectedDate.getFullYear()}`;
        this.showCalendarPicker = false;
      } else {
        this.showAddModal = false;
        this.showFullCalendar = false;
      }
    }
  }

  getFormattedDate() {
    return this.selectedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  saveEntryDates() {
    console.log('Saving entry with dates:', {
      startDate: this.startDateInput,
      endDate: this.endDateInput
    });
    
    this.showAddModal = false;
  }
}
