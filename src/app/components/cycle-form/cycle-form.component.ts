import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cycle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cycle-form.component.html',
  styleUrls: ['./cycle-form.component.css']
})
export class CycleFormComponent {
  startDateInput: string = '';
  endDateInput: string = '';
  selectedSymptoms: string[] = [];
  notes: string = '';
  showCalendarPicker: boolean = false;

  symptoms = [
    { name: 'Cramps', selected: false, icon: '😣' },
    { name: 'Headache', selected: false, icon: '🤕' },
    { name: 'Bloating', selected: false, icon: '🫨' },
    { name: 'Fatigue', selected: false, icon: '😴' },
    { name: 'Mood Swings', selected: false, icon: '🥹' },
    { name: 'Acne', selected: false, icon: '😬' },
    { name: 'Breast Tenderness', selected: false, icon: '😖' },
    { name: 'Backache', selected: false, icon: '🤕' }
  ];

  monthDays = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    active: false,
    selected: false
  }));

  weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  constructor(private router: Router) {}

  toggleCalendarPicker() {
    this.showCalendarPicker = !this.showCalendarPicker;
  }

  toggleSymptom(symptom: any) {
    symptom.selected = !symptom.selected;
    
    if (symptom.selected) {
      this.selectedSymptoms.push(symptom.name);
    } else {
      this.selectedSymptoms = this.selectedSymptoms.filter(name => name !== symptom.name);
    }
  }

  selectDate(day: number) {
    // Reset all previously selected days
    this.monthDays.forEach(item => {
      item.selected = false;
    });
    
    // Select the clicked day
    const selectedDay = this.monthDays.find(item => item.day === day);
    if (selectedDay) {
      selectedDay.selected = true;
    }
    
    // Format the date string (assuming current month and year)
    const date = new Date();
    const formattedDate = ${date.getMonth() + 1}/${day}/${date.getFullYear()};
    
    // Populate the start date input if it's empty, otherwise the end date
    if (!this.startDateInput) {
      this.startDateInput = formattedDate;
    } else {
      this.endDateInput = formattedDate;
    }
    
    // Close the calendar picker
    this.showCalendarPicker = false;
  }

  saveCycleEntry() {
    const cycleEntry = {
      startDate: this.startDateInput,
      endDate: this.endDateInput,
      symptoms: this.selectedSymptoms,
      notes: this.notes
    };
    
    console.log('Saving cycle entry:', cycleEntry);
    
    // In a real application, you would call a service to save this data
    // For now, navigate back to the dashboard
    this.navigateToDashboard();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.navigateToDashboard();
  }
}