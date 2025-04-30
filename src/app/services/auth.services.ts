import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }
  
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('headerValue');
  }
  
  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  getAuthHeaders(): { [header: string]: string } {
    return {
      'X-My-Request-Header': 'Abc123!!!'
    };
  }
}