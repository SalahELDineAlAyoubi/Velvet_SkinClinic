// src/app/services/service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Service, CreateServiceRequest, UpdateServiceRequest } from '../models/service.models';
import { environment } from '../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}services`;

  constructor(private http: HttpClient) { }

  // Get all services
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Search services
  searchServices(searchTerm: string): Observable<Service[]> {
    const params = new HttpParams().set('term', searchTerm);
    return this.http.get<Service[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get service by ID
  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create service
  createService(service: CreateServiceRequest): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update service
  updateService(id: number, service: UpdateServiceRequest): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete service
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 404) {
        errorMessage = 'الخدمة غير موجودة';
      } else if (error.status === 401) {
        errorMessage = 'يجب تسجيل الدخول أولاً';
      } else if (error.status === 500) {
        errorMessage = 'خطأ في الخادم';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
