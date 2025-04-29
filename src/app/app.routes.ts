import { Routes } from '@angular/router';
import { PeriodTrackerComponent } from './period-tracker/period-tracker.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', component: PeriodTrackerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];