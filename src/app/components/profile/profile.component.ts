import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userName = 'Lilian Vale';
  userEmail = 'lilian.vale@example.com';
  avatarUrl = '';
  
  menuItems = [
    { icon: '✏️', label: 'Edit Profile', hasArrow: true },
    { icon: '♀️', label: 'Cycle Settings', hasArrow: true },
    { icon: '📊', label: 'Cycle History', hasArrow: true },
    { icon: '🔔', label: 'Notifications', hasArrow: true },
    { icon: '🔒', label: 'Privacy', hasArrow: true },
    { icon: '❓', label: 'Help & Support', hasArrow: true },
    { icon: '⚙️', label: 'App Settings', hasArrow: true }
  ];
  
  constructor(private router: Router) {}
  
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  openCycleForm() {
    this.router.navigate(['/cycle-form']);
  }
  
  logout() {
    console.log('Logging out...');
    // In a real application, call the auth service to log out
    this.router.navigate(['/login']);
  }
  
  openMenu(item: any) {
    console.log(Opening menu: ${item.label});
    // Implement navigation or modal dialog for each menu item
  }
}