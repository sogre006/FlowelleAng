import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipGrid, MatChipRow, MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { PeriodCycleService } from '../../services/periodcycle.service';
import { CalendarService } from '../../services/calendar.service';
import { CycleEntryService } from '../../services/cycleentry.service';
import { Periodcycle } from '../../models/periodcycle';
import { Calendar } from '../../models/calendar';
import { Cycleentry } from '../../models/cycleentry';

interface Symptom {
  name: string;
  selected: boolean;
  icon: string;
}

/**
 * CycleFormComponent - Enhanced cycle entry form with service integration
 * 
 * Allows users to add or edit cycle data including:
 * - Period dates (start and end)
 * - Symptoms
 * - Notes
 * 
 * The component saves data to multiple tables as needed:
 * - PeriodCycle for the main cycle data
 * - Calendar for month views
 * - CycleEntry for individual day entries
 */
@Component({
  selector: 'app-cycle-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cycle-form.component.html',
  styleUrls: ['./cycle-form.component.css']
})
export class CycleFormComponent implements OnInit {
  // User data
  userId: number = 1; // This would normally come from an auth service
  
  // Form handling
  cycleForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Symptoms tracking
  symptoms: Symptom[] = [
    { name: 'Cramps', selected: false, icon: '😣' },
    { name: 'Headache', selected: false, icon: '🤕' },
    { name: 'Bloating', selected: false, icon: '🫨' },
    { name: 'Fatigue', selected: false, icon: '😴' },
    { name: 'Mood Swings', selected: false, icon: '🥹' },
    { name: 'Acne', selected: false, icon: '😬' },
    { name: 'Breast Tenderness', selected: false, icon: '😖' },
    { name: 'Backache', selected: false, icon: '🤕' }
  ];
  
  // Date selection 
  selectedSymptoms: string[] = [];
  notes: string = '';
  
  // Date constraints
  minDate: Date = new Date(new Date().getFullYear() - 1, 0, 1); // One year ago
  maxDate: Date = new Date(); // Today
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private periodCycleService: PeriodCycleService,
    private calendarService: CalendarService,
    private cycleEntryService: CycleEntryService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  /**
   * Initialize the form with validators
   */
  private initForm(): void {
    this.cycleForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      notes: ['']
    }, { validators: this.dateRangeValidator });
  }
  
  /**
   * Custom validator to ensure end date is after start date
   */
  private dateRangeValidator(group: FormGroup): {[key: string]: any} | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (start && end) {
      // Convert to date objects if they're strings
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      
      if (startDate > endDate) {
        return { 'dateRange': true };
      }
    }
    
    return null;
  }
  
  /**
   * Toggle a symptom's selected state
   */
  toggleSymptom(symptom: Symptom): void {
    symptom.selected = !symptom.selected;
    
    if (symptom.selected) {
      this.selectedSymptoms.push(symptom.name);
    } else {
      this.selectedSymptoms = this.selectedSymptoms.filter(name => name !== symptom.name);
    }
  }
  
  /**
   * Save the cycle data to the database
   */
  saveCycleEntry(): void {
    if (this.cycleForm.invalid) {
      // Mark fields as touched to trigger validation messages
      Object.keys(this.cycleForm.controls).forEach(key => {
        this.cycleForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const formValues = this.cycleForm.value;
    
    // Create period cycle data
    const startDate: Date = formValues.startDate instanceof Date 
      ? formValues.startDate 
      : new Date(formValues.startDate);
      
    const endDate: Date = formValues.endDate instanceof Date 
      ? formValues.endDate 
      : new Date(formValues.endDate);
    
    // Calculate duration in days (database does this, but we need it for UI feedback)
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24)) + 1;
    
    // Create the cycle object
    const newCycle: Partial<Periodcycle> = {
      user_id: this.userId,
      start_date: startDate,
      end_date: endDate
    };
    
    // First, save the cycle
    this.periodCycleService.createCycle(newCycle as Periodcycle).subscribe({
      next: (savedCycle) => {
        console.log('Saved cycle data:', savedCycle);
        
        // Now, check if we need to create a calendar for the month
        this.createOrGetCalendar(startDate, savedCycle);
      },
      error: (error) => {
        console.error('Error saving cycle:', error);
        this.errorMessage = 'Could not save your cycle data. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Create or get existing calendar for the month
   */
  private createOrGetCalendar(date: Date, cycle: Periodcycle): void {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // First, try to get an existing calendar
    this.calendarService.getCalendarByMonthYear(this.userId, date.getMonth() + 1, year)
      .subscribe({
        next: (calendar) => {
          if (calendar) {
            // Calendar exists, use it
            this.createCycleEntries(cycle, calendar);
          } else {
            // Create a new calendar
            const newCalendar: Partial<Calendar> = {
              user_id: this.userId,
              month: month,
              year: year
            };
            
            this.calendarService.createCalendar(newCalendar as Calendar).subscribe({
              next: (savedCalendar) => {
                this.createCycleEntries(cycle, savedCalendar);
              },
              error: (error) => {
                console.error('Error creating calendar:', error);
                this.handleSaveCompleted('partial', 'Could not create calendar, but cycle was saved.');
              }
            });
          }
        },
        error: (error) => {
          console.error('Error getting calendar:', error);
          this.handleSaveCompleted('partial', 'Could not access calendar, but cycle was saved.');
        }
      });
  }
  
  /**
   * Create cycle entries for each day of the period
   */
  private createCycleEntries(cycle: Periodcycle, calendar: Calendar): void {
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);
    const entries: Partial<Cycleentry>[] = [];
    
    // Create an entry for each day in the period
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const entry: Partial<Cycleentry> = {
        cycle_id: cycle.cycle_id,
        calendar_id: calendar.calendar_id,
        date: new Date(currentDate)
      };
      
      entries.push(entry);
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Save all entries in sequence
    this.saveEntriesSequentially(entries, 0);
  }
  
  /**
   * Save entries one by one (sequentially)
   * This could be optimized with a batch API, but this works for demonstration
   */
  private saveEntriesSequentially(entries: Partial<Cycleentry>[], index: number): void {
    if (index >= entries.length) {
      // All entries saved
      this.handleSaveCompleted('success');
      return;
    }
    
    this.cycleEntryService.createEntry(entries[index] as Cycleentry).subscribe({
      next: () => {
        // Save next entry
        this.saveEntriesSequentially(entries, index + 1);
      },
      error: (error) => {
        console.error(`Error saving entry ${index}:`, error);
        // Continue with next entry even if one fails
        this.saveEntriesSequentially(entries, index + 1);
      }
    });
  }
  
  /**
   * Handle the completion of the save process
   */
  private handleSaveCompleted(status: 'success' | 'partial' | 'error', message?: string): void {
    this.isLoading = false;
    
    if (status === 'success') {
      this.snackBar.open('Cycle data saved successfully', 'Close', {
        duration: 3000
      });
      this.navigateToDashboard();
    } else if (status === 'partial') {
      this.snackBar.open(message || 'Cycle partially saved', 'Close', {
        duration: 3000
      });
      this.navigateToDashboard();
    } else {
      this.errorMessage = message || 'Error saving cycle data';
    }
  }
  
  /**
   * Navigate back to dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  /**
   * Cancel form and return to dashboard
   */
  cancel(): void {
    this.navigateToDashboard();
  }
}