import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Calendar } from '../models/calendar';
import { environment } from '../environments/environment';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = ${environment.apiUrl}/calendar;
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getCalendarById(id: number): Observable<Calendar> {
    return this.http.get<Calendar>(${this.baseUrl}/${id}, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getCalendarsByUserId(userId: number): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(${this.baseUrl}/user/${userId}, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getCalendarByMonthYear(userId: number, month: number, year: number): Observable<Calendar> {
    return this.http.get<Calendar>(${this.baseUrl}/user/${userId}/month/${month}/year/${year}, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  createCalendar(calendar: Calendar): Observable<Calendar> {
    return this.http.post<Calendar>(${this.baseUrl}, calendar, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  deleteCalendar(id: number, userId: number): Observable<any> {
    return this.http.delete(${this.baseUrl}/${id}/user/${userId}, {
      headers: this.authService.getAuthHeaders()
    });
  }
}