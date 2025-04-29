import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.services';

@Injectable({
  providedIn: 'root'
})
export class PeriodCycleService {
  private baseUrl = ${environment.apiUrl}/periodcycle;
  
  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getCyclesByUserId(userId: number): Observable<PeriodCycle[]> {
    return this.http.get<PeriodCycle[]>(${this.baseUrl}/user/${userId}, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getCycleById(id: number): Observable<PeriodCycle> {
    return this.http.get<PeriodCycle>(${this.baseUrl}/${id}, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  createCycle(cycle: PeriodCycle): Observable<PeriodCycle> {
    return this.http.post<PeriodCycle>(${this.baseUrl}, cycle, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  updateCycle(cycle: PeriodCycle): Observable<any> {
    return this.http.put(${this.baseUrl}, cycle, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  deleteCycle(id: number, userId: number): Observable<any> {
    return this.http.delete(${this.baseUrl}/${id}/user/${userId}, {
      headers: this.authService.getAuthHeaders()
    });
  }
}