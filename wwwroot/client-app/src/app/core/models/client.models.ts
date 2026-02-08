import { Service } from "./service.models";
export interface Client {
  id: number;
  clientIdentifier: string;
  name: string;
  phone: string;
  birthday?: string;
  diseases?: string;
  notes?: string;
  services: Service[];
  totalRequired: number;
  totalPaid: number;
  remainingAmount: number;
  payments: Payment[];
}

export interface Payment {
  id: number;
  paymentNumber: number;
  amount: number;
  date: string;  // YYYY-MM-DD format
}

export interface CreateClientRequest {
  name: string;
  clientIdentifier: string;
  phone: string;
  birthday?: string;
  diseases?: string;
  notes?: string;
  totalRequired: number;
  serviceIds: number[];
}

export interface UpdateClientRequest {
  name: string;
  phone: string;
  birthday?: string;
  diseases?: string;
  notes?: string;
}

export interface UpdateClientTotalRequiredRequest {
  totalRequired: number;
}

export interface CreatePaymentRequest {
  amount: number;
}

export interface UpdatePaymentRequest {
  amount: number;
  date: string;
}


 export interface ClientListItem {
  id: number;
  clientIdentifier: string;
  name: string;
  phone: string;
}

export interface CreateClientMinimalRequest {
  name: string;
  phone: string;
}
