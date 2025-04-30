import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.services';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // User data
  userId: number = 1; // This would normally come from an auth service
  user: User | null = null;
  
  // Form handling - Profile
  profileForm!: FormGroup;
  editMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Form handling - Password
  passwordForm!: FormGroup;
  isPasswordLoading: boolean = false;
  
  // App settings
  reminderEnabled: boolean = true;
  darkModeEnabled: boolean = false;
  selectedLanguage: string = 'en';
  
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Initialize forms
    this.initProfileForm();
    this.initPasswordForm();
    
    // Load user data
    this.loadUserData();
    
    // Load app settings (from localStorage for example)
    this.loadAppSettings();
  }
  
  /**
   * Initialize the profile form
   */
  private initProfileForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
    
    // Disable the form initially (view-only mode)
    this.profileForm.disable();
  }
  
  /**
   * Initialize the password change form
   */
  private initPasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  /**
   * Validator to ensure passwords match
   */
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    
    return null;
  }
  
  /**
   * Load user data from service
   */
  private loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.populateForm(userData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.errorMessage = 'Could not load your profile. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Populate the form with user data
   */
  private populateForm(user: User): void {
    this.profileForm.patchValue({
      name: user.name,
      email: user.email
    });
  }
  
  /**
   * Load app settings from localStorage
   * This is just a mock implementation - real app would use a settings service
   */
  private loadAppSettings(): void {
    // Mock implementation - in a real app, get from localStorage or a settings service
    this.reminderEnabled = localStorage.getItem('reminderEnabled') === 'true';
    this.darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    this.selectedLanguage = localStorage.getItem('language') || 'en';
  }
  
  /**
   * Toggle edit mode on/off
   */
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    
    if (this.editMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      
      // Reset form to original values if canceling edit
      if (this.user) {
        this.populateForm(this.user);
      }
    }
  }
  
  /**
   * Submit form to update profile
   */
  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    // Create user object with updated data
    const updatedUser: User = {
      ...this.user!,
      name: this.profileForm.value.name,
      email: this.profileForm.value.email
    };
    
    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.editMode = false;
        this.profileForm.disable();
        this.user = updatedUser;
        
        // Show success message
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoading = false;
        this.errorMessage = 'Could not update your profile. Please try again later.';
      }
    });
  }
  
  /**
   * Change password
   */
  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.isPasswordLoading = true;
    
    const currentPassword = this.passwordForm.value.currentPassword;
    const newPassword = this.passwordForm.value.newPassword;
    
    // In a real app, you would first verify the current password before changing
    this.userService.updatePassword(this.userId, newPassword).subscribe({
      next: () => {
        this.isPasswordLoading = false;
        this.passwordForm.reset();
        
        // Show success message
        this.snackBar.open('Password changed successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.isPasswordLoading = false;
        this.snackBar.open('Could not change password. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  /**
   * Toggle reminders setting
   */
  toggleReminders(event: MatSlideToggleChange): void {
    this.reminderEnabled = event.checked;
    // Save to localStorage or settings service
    localStorage.setItem('reminderEnabled', this.reminderEnabled.toString());
    
    this.snackBar.open(
      `Reminders ${this.reminderEnabled ? 'enabled' : 'disabled'}`, 
      'Close', 
      { duration: 2000 }
    );
  }
  
  /**
   * Toggle dark mode setting
   */
  toggleDarkMode(event: MatSlideToggleChange): void {
    this.darkModeEnabled = event.checked;
    // Save to localStorage or settings service
    localStorage.setItem('darkModeEnabled', this.darkModeEnabled.toString());
    
    // In a real app, you would apply the theme change here
    this.snackBar.open(
      `Dark mode ${this.darkModeEnabled ? 'enabled' : 'disabled'}`, 
      'Close', 
      { duration: 2000 }
    );
  }
  
  /**
   * Change language setting
   */
  changeLanguage(event: MatSelectChange): void {
    this.selectedLanguage = event.value;
    // Save to localStorage or settings service
    localStorage.setItem('language', this.selectedLanguage);
    
    // In a real app, you would apply the language change here
    this.snackBar.open(
      `Language changed to ${this.getLanguageName(this.selectedLanguage)}`, 
      'Close', 
      { duration: 2000 }
    );
  }
  
  /**
   * Get language name from code
   */
  private getLanguageName(code: string): string {
    const languages: {[key: string]: string} = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    
    return languages[code] || code;
  }
  
  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}