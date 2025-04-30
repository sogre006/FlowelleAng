import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'calendar-view', component: CalendarViewComponent },
  { path: 'cycle-form', component: CycleFormComponent },
  { path: '**', redirectTo: '' }
];