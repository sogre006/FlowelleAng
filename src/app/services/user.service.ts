import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import { AuthService } from './auth.services';

// Define interface for user creation
interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}`, user, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  updatePassword(userId: number, password: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/password`, { userId, password }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Add method to create a new user
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
}