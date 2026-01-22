import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Payment {
  id: number;
  clientName: string;
  amount: number;
  date: string;
  paymentNumber: number;
}

@Component({
  selector: 'app-monthly-states',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-states.component.html',
  styleUrl: './monthly-states.component.css'
})
export class MonthlyStatesComponent {
  // Sample data - replace with real data from your service
  allPayments: Payment[] = [
    { id: 1, clientName: 'Lea Ahmad', amount: 200, date: '2026-01-05', paymentNumber: 1 },
    { id: 2, clientName: 'Maysaa Ayoubi', amount: 150, date: '2026-01-12', paymentNumber: 1 },
    { id: 3, clientName: 'Tala Dib', amount: 300, date: '2026-01-18', paymentNumber: 1 },
    { id: 4, clientName: 'Lea Ahmad', amount: 100, date: '2026-01-25', paymentNumber: 2 },
    { id: 5, clientName: 'Alexandra Tayachi', amount: 250, date: '2026-02-03', paymentNumber: 1 },
    { id: 6, clientName: 'Mira Mohammad', amount: 180, date: '2026-02-10', paymentNumber: 1 },
    { id: 7, clientName: 'Hala Sayed', amount: 220, date: '2026-02-15', paymentNumber: 1 },
    { id: 8, clientName: 'Maysaa Ayoubi', amount: 120, date: '2026-02-20', paymentNumber: 2 },
    { id: 9, clientName: 'Arij Taha', amount: 300, date: '2025-12-10', paymentNumber: 1 },
    { id: 10, clientName: 'Sana Ayoubi', amount: 150, date: '2025-12-20', paymentNumber: 1 },
  ];

  // Filter options
  filterType: 'month' | 'range' = 'month';
  selectedMonth: string = this.getCurrentMonth();
  startDate: string = '';
  endDate: string = '';

  // Get current month in YYYY-MM format
  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Get filtered payments based on selected filter
  get filteredPayments(): Payment[] {
    if (this.filterType === 'month' && this.selectedMonth) {
      return this.allPayments.filter(payment =>
        payment.date.startsWith(this.selectedMonth)
      );
    } else if (this.filterType === 'range' && this.startDate && this.endDate) {
      return this.allPayments.filter(payment =>
        payment.date >= this.startDate && payment.date <= this.endDate
      );
    }
    return this.allPayments;
  }

  // Sort payments by date (newest first)
  get sortedPayments(): Payment[] {
    return [...this.filteredPayments].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Calculate total amount
  get totalAmount(): number {
    return this.filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  // Get total number of payments
  get totalPayments(): number {
    return this.filteredPayments.length;
  }

  // Get unique clients count
  get uniqueClients(): number {
    const uniqueNames = new Set(this.filteredPayments.map(p => p.clientName));
    return uniqueNames.size;
  }

  // Reset filters
  resetFilters(): void {
    this.filterType = 'month';
    this.selectedMonth = this.getCurrentMonth();
    this.startDate = '';
    this.endDate = '';
  }

  // Print function
  printReport(): void {
    window.print();
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-LB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get period description
  get periodDescription(): string {
    if (this.filterType === 'month' && this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-');
      const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (this.filterType === 'range' && this.startDate && this.endDate) {
      return `من ${this.formatDate(this.startDate)} إلى ${this.formatDate(this.endDate)}`;
    }
    return 'جميع الفترات';
  }
}
