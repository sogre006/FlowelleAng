import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cycleentry } from '../models/cycleentry';
import { environment } from '../environments/environment';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class CycleEntryService {
  private baseUrl = `${environment.apiUrl}/Cycleentry`;
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getEntryById(id: number): Observable<Cycleentry> {
    return this.http.get<Cycleentry>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getEntriesByCycleId(cycleId: number): Observable<Cycleentry[]> {
    return this.http.get<Cycleentry[]>(`${this.baseUrl}/cycle/${cycleId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getEntriesByCalendarId(calendarId: number): Observable<Cycleentry[]> {
    return this.http.get<Cycleentry[]>(`${this.baseUrl}/calendar/${calendarId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getEntriesByDate(date: Date): Observable<Cycleentry[]> {
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<Cycleentry[]>(`${this.baseUrl}/date/${formattedDate}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  createEntry(entry: Cycleentry): Observable<Cycleentry> {
    return this.http.post<Cycleentry>(`${this.baseUrl}`, entry, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  deleteEntry(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}