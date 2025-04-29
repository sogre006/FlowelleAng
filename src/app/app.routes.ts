import { Routes } from '@angular/router';
import { PeriodTrackerComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: PeriodTrackerComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];