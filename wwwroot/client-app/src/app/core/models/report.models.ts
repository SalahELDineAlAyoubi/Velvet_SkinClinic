// src/app/models/report.models.ts
export interface PaymentReport {
  id: number;
  clientId: number;
  clientName: string;
  clientIdentifier: string;
  paymentNumber: number;
  amount: number;
  date: string;  // YYYY-MM-DD
}

export interface MonthlyReport {
  period: string;
  startDate?: string;
  endDate?: string;
  totalAmount: number;
  totalPayments: number;
  uniqueClients: number;
  payments: PaymentReport[];
}

export interface MonthlyReportRequest {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
}
