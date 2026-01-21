import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Payment {  
  paymentNumber: number;
  amount: number; 
  date: string; 
}

interface Client {
  name: string; 
  id: string;
  phone: string;
  birthday: string;
  services: string[];
  totalRequired: number;
  totalPaid: number;
  payments: Payment[];
}

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details-client.component.html',
  styleUrl: './details-client.component.css'

})
export class DetailsClientComponent {
  client: Client = {
    name: 'Maysa Ayoubi',
    id: '123',
    phone: '03 181 111',
    birthday: '15/08/2005',
    services: ['Hifu', 'BBL', 'Caviation'],
    totalRequired: 700,  
    totalPaid: 650,
    payments: [    
      { paymentNumber: 1, amount: 200, date: '2026-01-05' },
      { paymentNumber: 2, amount: 150, date: '2025-01-12' }, 
      { paymentNumber: 3, amount: 300, date: '2025-01-18' }
    ]
  };

  newPaymentAmount: number = 0;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;

  get remainingAmount(): number {
    return this.client.totalRequired - this.client.totalPaid;
  }

  addPayment(): void {
    if (this.newPaymentAmount <= 0) return;

    this.isSubmitting = true;

    setTimeout(() => {
      const newPayment: Payment = {
        paymentNumber: this.client.payments.length + 1,
        amount: this.newPaymentAmount,
        date: new Date().toISOString().split('T')[0]
      };

      this.client.payments.push(newPayment);
      this.client.totalPaid += this.newPaymentAmount;

      this.isSubmitting = false;
      this.newPaymentAmount = 0;

      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 1000);
  }
}
