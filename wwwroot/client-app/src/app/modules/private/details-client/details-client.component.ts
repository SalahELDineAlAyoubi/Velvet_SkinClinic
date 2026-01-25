import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  // Available services for dropdown
  availableServices: string[] = [
    'Hifu',
    'BBL',
    'Caviation',
    'Laser',
    'Botox',
    'Filler',
    'Microneedling',
    'PRP',
    'Chemical Peel',
    'Mesotherapy'
  ];

  selectedService: string = '';
  newPaymentAmount: number = 0;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;

  // Edit modes
  isEditingInfo: boolean = false;
  isEditingTotalRequired: boolean = false;
  editingPaymentId: number | null = null;
  phoneError: string = '';
  tempPhone: string = ''; // Temporary storage for phone during editing
  showDeleteModal: boolean = false; // Show delete confirmation modal

  constructor(private router: Router) { }

  get remainingAmount(): number {
    return this.client.totalRequired - this.client.totalPaid;
  }

  // Show delete confirmation modal
  deleteClient(): void {
    this.showDeleteModal = true;
  }

  // Cancel delete
  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  // Confirm delete and navigate away
  confirmDelete(): void {
    this.showDeleteModal = false;

    // In a real app, you would call a service to delete from backend
    // this.clientService.deleteClient(this.client.id).subscribe(() => {
    //   this.router.navigate(['/dashboard']);
    // });

    // Navigate back to dashboard/clients list
    this.router.navigate(['/dashboard']);
  }

  // Validate Lebanese phone number
  validateLebanesePhone(phone: string): boolean {
    // Remove all spaces and special characters
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');

    // Lebanese mobile prefixes: 03, 70, 71, 76, 78, 79, 81
    // Lebanese landline prefixes: 01, 04, 05, 06, 07, 09
    const mobilePattern = /^(03|70|71|76|78|79|81)\d{6}$/;
    const landlinePattern = /^(01|04|05|06|07|09)\d{6}$/;

    return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
  }

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  formatDate(dateString: string): string {
    if (!dateString) return '';

    // Check if already in DD/MM/YYYY format
    if (dateString.includes('/')) {
      return dateString;
    }

    // Convert from YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  // Format date from DD/MM/YYYY to YYYY-MM-DD (for input fields)
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    // Check if already in YYYY-MM-DD format
    if (dateString.includes('-')) {
      return dateString;
    }

    // Convert from DD/MM/YYYY
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  // Get services not already added
  get availableServicesToAdd(): string[] {
    return this.availableServices.filter(s => !this.client.services.includes(s));
  }

  // Open WhatsApp chat
  openWhatsApp(): void {
    // Remove spaces and special characters from phone number
    const cleanPhone = this.client.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

    // Add country code if not present (Lebanon +961)
    let phoneNumber = cleanPhone;
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('961')) {
      // If number starts with 0, remove it and add +961
      if (cleanPhone.startsWith('0')) {
        phoneNumber = '961' + cleanPhone.substring(1);
      } else {
        phoneNumber = '961' + cleanPhone;
      }
    } else if (cleanPhone.startsWith('+')) {
      phoneNumber = cleanPhone.substring(1);
    }

    // Open WhatsApp with the phone number
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  // Add new service
  addService(): void {
    if (this.selectedService && !this.client.services.includes(this.selectedService)) {
      this.client.services.push(this.selectedService);
      this.selectedService = '';
    }
  }

  // Format amount - removes .00 but keeps decimals when needed
  formatAmount(amount: number): string {
    if (amount % 1 === 0) {
      // Whole number - no decimals
      return amount.toString();
    } else {
      // Has decimals - show up to 2 decimal places
      return amount.toFixed(2).replace(/\.?0+$/, '');
    }
  }

  // Remove service with confirmation
  removeService(service: string): void {
    if (confirm(`هل أنت متأكد من حذف خدمة "${service}"؟`)) {
      this.client.services = this.client.services.filter(s => s !== service);
    }
  }

  // Toggle edit mode for personal info
  toggleEditInfo(): void {
    if (this.isEditingInfo) {
      // Saving - validate phone number
      if (!this.validateLebanesePhone(this.client.phone)) {
        this.phoneError = 'رقم الهاتف غير صحيح. يجب أن يكون رقم لبناني صحيح';
        return;
      }
      this.phoneError = '';
    } else {
      // Starting edit - store temp phone
      this.tempPhone = this.client.phone;
    }
    this.isEditingInfo = !this.isEditingInfo;
  }

  // Cancel phone edit
  cancelPhoneEdit(): void {
    this.client.phone = this.tempPhone;
    this.phoneError = '';
    this.isEditingInfo = false;
  }

  // Toggle edit mode for total required
  toggleEditTotalRequired(): void {
    this.isEditingTotalRequired = !this.isEditingTotalRequired;
  }

  // Add payment
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

  // Edit payment
  editPayment(payment: Payment): void {
    this.editingPaymentId = payment.paymentNumber;
  } 

  // Save payment edit
  savePayment(payment: Payment): void {
    this.editingPaymentId = null;
    // Recalculate total paid
    this.client.totalPaid = this.client.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  // Delete payment
  deletePayment(payment: Payment): void {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      this.client.payments = this.client.payments.filter(p => p.paymentNumber !== payment.paymentNumber);
      this.client.totalPaid = this.client.payments.reduce((sum, p) => sum + p.amount, 0);
      // Renumber payments
      this.client.payments.forEach((p, index) => {
        p.paymentNumber = index + 1;
      });
    }
  }
}
