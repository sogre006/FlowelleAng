import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

/**
 * ProfileComponent - Simplified profile management
 * Allows users to view and edit their profile information
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // User data
  userId: number = 1; // This would normally come from an auth service
  user: User | null = null;
  
  // Form handling
  profileForm!: FormGroup;
  editMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Initialize the form
    this.initForm();
    
    // Load user data
    this.loadUserData();
  }
  
  /**
   * Initialize the profile form
   */
  private initForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      // Note: Not including password here for security reasons
      // Password changes should be handled in a separate form with confirmation
    });
    
    // Disable the form initially (view-only mode)
    this.profileForm.disable();
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
   * Navigate to dashboard
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  /**
   * Open cycle form
   */
  openCycleForm(): void {
    this.router.navigate(['/cycle-form']);
  }
  
  /**
   * Logout user
   */
  logout(): void {
    // In a real app, call the auth service to log out
    this.router.navigate(['/login']);
  }
}