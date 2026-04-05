// src/app/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MonthlyReport, MonthlyReportRequest } from '../models/report.models';
import { environment } from '../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}reports`;

  constructor(private http: HttpClient) { }

  // Get monthly report
  getMonthlyReport(year: number, month: number): Observable<MonthlyReport> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<MonthlyReport>(`${this.apiUrl}/monthly`, { params })
      .pipe(catchError(this.handleError));
  }

  // Get date range report
  getDateRangeReport(startDate: string, endDate: string): Observable<MonthlyReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<MonthlyReport>(`${this.apiUrl}/date-range`, { params })
      .pipe(catchError(this.handleError));
  }

  // Get all payments report
  getAllPaymentsReport(): Observable<MonthlyReport> {
    return this.http.get<MonthlyReport>(`${this.apiUrl}/all`)
      .pipe(catchError(this.handleError));
  }

  // Get custom report
  getCustomReport(request: MonthlyReportRequest): Observable<MonthlyReport> {
    return this.http.post<MonthlyReport>(`${this.apiUrl}/custom`, request)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.status === 400 && error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'يجب تسجيل الدخول أولاً';
    } else if (error.status === 500) {
      errorMessage = 'خطأ في الخادم';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
