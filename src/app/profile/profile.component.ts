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
  userHandle = '@liliva';
  
  menuItems = [
    { icon: '✏️', label: 'Edit Profile', hasArrow: true },
    { icon: '♀️', label: 'Cycle', hasArrow: true },
    { icon: '❓', label: 'Help', hasArrow: true }
  ];
  
  constructor(private router: Router) {}
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
  
  logout() {
    console.log('Logging out...');
    // In a real application, this would handle the logout process
    this.router.navigate(['/']);
  }
}