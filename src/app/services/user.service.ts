import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

// Define interface for user creation
interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface PasswordUpdateRequest {
  UserId: number;
  Password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;
  
  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) { }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/byemail/${email}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}`, user, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  updatePassword(userId: number, password: string): Observable<any> {
    const request: PasswordUpdateRequest = { 
      UserId: userId, 
      Password: password 
    };
    
    return this.http.put(`${this.baseUrl}/password`, request, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Add method to create a new user - no auth header needed for registration
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
  
  // Get all users (admin function)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  // Check if email exists (useful for registration)
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/email/${email}`);
  }
  
  // Delete user (admin function)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}