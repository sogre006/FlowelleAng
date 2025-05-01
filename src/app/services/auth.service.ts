// src/app/services/auth.services.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`;
  
  constructor(private http: HttpClient) { }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response && response.headerValue) {
            localStorage.setItem('authHeader', response.headerValue);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
          }
        })
      );
  }
  
  // Add the register method
  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/user`, {
      name: registerData.name,
      email: registerData.email,
      pw: registerData.password // Note: Using pw to match backend model
    });
  }
  
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authHeader');
    localStorage.removeItem('userEmail');
  }
  
  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
  
  getAuthHeaders(): { [header: string]: string } {
    const authHeader = localStorage.getItem('authHeader');
    if (!authHeader) {
      return {};
    }
    
    return {
      'Authorization': authHeader
    };
  }
}