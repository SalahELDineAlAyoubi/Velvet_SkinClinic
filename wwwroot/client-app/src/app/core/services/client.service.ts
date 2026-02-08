// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  UpdateClientTotalRequiredRequest,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  Payment,
  ClientListItem,
  CreateClientMinimalRequest
} from '../models/client.models';
import { environment } from '../../../environments/environment.prod';
 
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}clients`;

  constructor(private http: HttpClient) { }

  // Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get client by ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get client by identifier
  getClientByIdentifier(clientIdentifier: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/by-identifier/${clientIdentifier}`)
      .pipe(catchError(this.handleError));
  }

  // Create client
  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client)
      .pipe(catchError(this.handleError));
  }

  // Update client info
  updateClient(id: number, client: UpdateClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client)
      .pipe(catchError(this.handleError));
  }

  // Update client total required
  updateClientTotalRequired(id: number, data: UpdateClientTotalRequiredRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}/total-required`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete client
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Add service to client
  addServiceToClient(clientId: number, serviceId: number): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/${clientId}/services/${serviceId}`, {})
      .pipe(catchError(this.handleError));
  }

  // Remove service from client
  removeServiceFromClient(clientId: number, serviceId: number): Observable<Client> {
    return this.http.delete<Client>(`${this.apiUrl}/${clientId}/services/${serviceId}`)
      .pipe(catchError(this.handleError));
  }

  // Add payment
  addPayment(clientId: number, payment: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${clientId}/payments`, payment)
      .pipe(catchError(this.handleError));
  }

  // Update payment
  updatePayment(clientId: number, paymentNumber: number, payment: UpdatePaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${clientId}/payments/${paymentNumber}`, payment)
      .pipe(catchError(this.handleError));
  }

  // Delete payment
  deletePayment(clientId: number, paymentNumber: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${clientId}/payments/${paymentNumber}`)
      .pipe(catchError(this.handleError));
  }

  // Get all clients for list view
  getAllClientsList(): Observable<ClientListItem[]> {
    return this.http.get<ClientListItem[]>(`${this.apiUrl}/list`)
      .pipe(catchError(this.handleError));
  }

  // Search clients
  searchClients(searchTerm: string): Observable<ClientListItem[]> {
    const params = new HttpParams().set('term', searchTerm);
    return this.http.get<ClientListItem[]>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  // Create client with minimal info (from dashboard)
  createClientMinimal(client: CreateClientMinimalRequest): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/minimal`, client)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.status === 400 && error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = error.error?.message || 'البيانات غير موجودة';
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
