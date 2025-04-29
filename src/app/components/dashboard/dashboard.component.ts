import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentDay = 2;
  cycleStage = 'Menstrual';
  currentMonth = 'March 2025';
  selectedDate = new Date(2025, 2, 2); // March 2, 2025
  showFullCalendar = false;
  showAddModal = false;
  
  dates = [
    { day: 3, dayOfWeek: 'S', active: false },
    { day: 4, dayOfWeek: 'S', active: false },
    { day: 5, dayOfWeek: 'M', active: true },
    { day: 6, dayOfWeek: 'T', active: true, selected: false },
    { day: 7, dayOfWeek: 'W', active: true },
    { day: 8, dayOfWeek: 'T', active: false },
    { day: 9, dayOfWeek: 'F', active: false }
  ];

  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToCalendarView() {
    this.router.navigate(['/calendar-view']);
  }

  openCycleForm() {
    this.router.navigate(['/cycle-form']);
  }

  getFormattedDate() {
    return this.selectedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}