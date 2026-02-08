// src/app/components/monthly-states/monthly-states.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonthlyReport, PaymentReport } from '../../../core/models/report.models';
import { ReportService } from '../../../core/services/report.service';
  
@Component({
  selector: 'app-monthly-states',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-states.component.html',
  styleUrl: './monthly-states.component.css'
})
export class MonthlyStatesComponent implements OnInit {
  // Report data
  report: MonthlyReport | null = null;

  // Filter options
  filterType: 'month' | 'range' = 'month';
  selectedMonth: string = this.getCurrentMonth();
  startDate: string = '';
  endDate: string = '';

  // Loading state
  loading: boolean = false;
  error: string = '';

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReport();
  }

  // Get current month in YYYY-MM format
  getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Load report based on current filter
  loadReport(): void {
    this.loading = true;
    this.error = '';

    if (this.filterType === 'month' && this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      this.reportService.getMonthlyReport(year, month).subscribe({
        next: (report) => {
          this.report = report;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading report:', error);
          this.error = error.message || 'فشل تحميل التقرير';
          this.loading = false;
        }
      });
    } else if (this.filterType === 'range' && this.startDate && this.endDate) {
      this.reportService.getDateRangeReport(this.startDate, this.endDate).subscribe({
        next: (report) => {
          this.report = report;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading report:', error);
          this.error = error.message || 'فشل تحميل التقرير';
          this.loading = false;
        }
      });
    } else {
      this.reportService.getAllPaymentsReport().subscribe({
        next: (report) => {
          this.report = report;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading report:', error);
          this.error = error.message || 'فشل تحميل التقرير';
          this.loading = false;
        }
      });
    }
  }

  // Get filtered payments (from report)
  get filteredPayments(): PaymentReport[] {
    return this.report?.payments || [];
  }

  // Sort payments by date (newest first)
  get sortedPayments(): PaymentReport[] {
    return [...this.filteredPayments].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // Calculate total amount
  get totalAmount(): number {
    return this.report?.totalAmount || 0;
  }

  // Get total number of payments
  get totalPayments(): number {
    return this.report?.totalPayments || 0;
  }

  // Get unique clients count
  get uniqueClients(): number {
    return this.report?.uniqueClients || 0;
  }

  // Reset filters
  resetFilters(): void {
    this.filterType = 'month';
    this.selectedMonth = this.getCurrentMonth();
    this.startDate = '';
    this.endDate = '';
    this.loadReport();
  }

  // Handle filter type change
  onFilterTypeChange(): void {
    if (this.filterType === 'month') {
      this.selectedMonth = this.getCurrentMonth();
      this.loadReport();
    }
  }

  // Handle month change
  onMonthChange(): void {
    if (this.selectedMonth) {
      this.loadReport();
    }
  }

  // Handle date range change
  onDateRangeChange(): void {
    if (this.startDate && this.endDate) {
      this.loadReport();
    }
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
    return this.report?.period || 'جميع الفترات';
  }
}
