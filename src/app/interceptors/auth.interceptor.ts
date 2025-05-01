import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding auth header for login request
    if (request.url.includes('/api/login') || request.url.includes('/api/user/register')) {
      return next.handle(request);
    }
    
    // Get the auth header from localStorage
    const authHeader = this.authService.getAuthHeader();
    
    // Clone the request and add the auth header
    if (authHeader) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', authHeader)
      });
      return next.handle(authRequest);
    }
    
    // If no auth header, just forward the original request
    return next.handle(request);
  }
}