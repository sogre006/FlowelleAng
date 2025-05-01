import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environments/environment';

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
  
  constructor(private http: HttpClient) { }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/byemail/${email}`);
  }
  
  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}`, user);
  }
  
  updatePassword(userId: number, password: string): Observable<any> {
    const request: PasswordUpdateRequest = { 
      UserId: userId, 
      Password: password 
    };
    return this.http.put(`${this.baseUrl}/password`, request);
  }

  // Registration doesn’t need auth header
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
  
  // Admin functions
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  
  // Public endpoint, no auth header
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/email/${email}`);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
