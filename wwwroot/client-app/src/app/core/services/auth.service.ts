 import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../models/auth.models';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth'
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    //const storedUser = localStorage.getItem('currentUser');
    const storedUser = ' ';

    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.getToken();
  }


  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      loginCustom: username,
      password: password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        map(response => {
          this.setTokens(response.accessToken, response.refreshToken);

          const user: User = {
            userId: response.userId,
            firstName: response.firstName,
            lastName: response.lastName,
            loginCustom: response.loginCustom,
            userRole: response.userRole
          };

          //localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

           this.startRefreshTokenTimer();

          return response;
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.startRefreshTokenTimer();
          return response;
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }



  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      // Revoke token on server
      this.http.post(`${this.apiUrl}/auth/revoke-token`, { refreshToken })
        .subscribe();
    }

    this.stopRefreshTokenTimer();
    //localStorage.removeItem('access_token');
    //localStorage.removeItem('refresh_token');
    //localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }


  getToken(): string | null {
    return ''
    //return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    //return localStorage.getItem('refresh_token');
  return ''
  }
  private setTokens(accessToken: string, refreshToken: string): void {
    //localStorage.setItem('access_token', accessToken);
    //localStorage.setItem('refresh_token', refreshToken);
  }
  private startRefreshTokenTimer(): void {
    const timeout = environment.refreshTokenTimeOut * 60 * 1000;  

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }
  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
      } else if (error.status === 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
