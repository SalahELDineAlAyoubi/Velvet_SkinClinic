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
  diseases: string;
  notes: string;
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
    diseases: '',
    notes: '',
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
  tempPhone: string = '';

  // Modals
  showDeleteModal: boolean = false;
  showDeleteServiceModal: boolean = false;
  showDeletePaymentModal: boolean = false;
  serviceToDelete: string = '';
  paymentToDelete: Payment | null = null;

  // Validation errors
  infoErrors = {
    name: '',
    phone: '',
    birthday: ''
  };

  totalRequiredError: string = '';
  paymentAmountError: string = '';
  editPaymentErrors = {
    amount: '',
    date: ''
  };

  constructor(private router: Router) { }

  get remainingAmount(): number {
    return this.client.totalRequired - this.client.totalPaid;
  }

  // Show delete client confirmation modal
  deleteClient(): void {
    this.showDeleteModal = true;
  }

  // Cancel delete client
  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  // Confirm delete client and navigate away
  confirmDelete(): void {
    this.showDeleteModal = false;
    this.router.navigate(['/dashboard']);
  }

  // Validate Lebanese phone number
  validateLebanesePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const mobilePattern = /^(03|70|71|76|78|79|81)\d{6}$/;
    const landlinePattern = /^(01|04|05|06|07|09)\d{6}$/;
    return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
  }

  // Validate birthday format
  validateBirthday(birthday: string): boolean {
    if (!birthday) return false;
    // Accept DD/MM/YYYY or DD/MM format
    const pattern = /^(\d{2})\/(\d{2})(\/\d{4})?$/;
    if (!pattern.test(birthday)) return false;

    const parts = birthday.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;

    return true;
  }

  // Validate personal info fields
  validateInfoField(field: keyof typeof this.infoErrors): void {
    switch (field) {
      case 'name':
        if (!this.client.name.trim()) {
          this.infoErrors.name = 'الرجاء إدخال الاسم';
        } else if (this.client.name.trim().length < 2) {
          this.infoErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
        } else {
          this.infoErrors.name = '';
        }
        break;
      case 'phone':
        if (!this.client.phone.trim()) {
          this.infoErrors.phone = 'الرجاء إدخال رقم الهاتف';
        } else if (!this.validateLebanesePhone(this.client.phone)) {
          this.infoErrors.phone = 'رقم الهاتف غير صحيح. يجب أن يكون رقم لبناني صحيح';
        } else {
          this.infoErrors.phone = '';
        }
        break;
      case 'birthday':
        if (!this.client.birthday.trim()) {
          this.infoErrors.birthday = 'الرجاء إدخال تاريخ الميلاد';
        } else if (!this.validateBirthday(this.client.birthday)) {
          this.infoErrors.birthday = 'تاريخ غير صحيح. استخدم صيغة DD/MM/YYYY';
        } else {
          this.infoErrors.birthday = '';
        }
        break;
    }
  }

  // Validate all personal info
  validatePersonalInfo(): boolean {
    let isValid = true;

    this.validateInfoField('name');
    this.validateInfoField('phone');
    this.validateInfoField('birthday');

    if (this.infoErrors.name || this.infoErrors.phone || this.infoErrors.birthday) {
      isValid = false;
    }

    return isValid;
  }

  // Reset personal info errors
  resetInfoErrors(): void {
    this.infoErrors = {
      name: '',
      phone: '',
      birthday: ''
    };
  }

  // Get services not already added
  get availableServicesToAdd(): string[] {
    return this.availableServices.filter(s => !this.client.services.includes(s));
  }

  // Open WhatsApp chat
  openWhatsApp(): void {
    const cleanPhone = this.client.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    let phoneNumber = cleanPhone;
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('961')) {
      if (cleanPhone.startsWith('0')) {
        phoneNumber = '961' + cleanPhone.substring(1);
      } else {
        phoneNumber = '961' + cleanPhone;
      }
    } else if (cleanPhone.startsWith('+')) {
      phoneNumber = cleanPhone.substring(1);
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  // Add new service
  addService(): void {
    if (this.selectedService) {
      if (this.client.services.includes(this.selectedService)) {
        alert('هذه الخدمة موجودة بالفعل!');
        return;
      }
      this.client.services.push(this.selectedService);
      this.selectedService = '';
    }
  }

  // Format amount - removes .00 but keeps decimals when needed
  formatAmount(amount: number): string {
    if (amount % 1 === 0) {
      return amount.toString();
    } else {
      return amount.toFixed(2).replace(/\.?0+$/, '');
    }
  }

  // Show delete service modal
  removeService(service: string): void {
    this.serviceToDelete = service;
    this.showDeleteServiceModal = true;
  }

  // Cancel service deletion
  cancelServiceDelete(): void {
    this.showDeleteServiceModal = false;
    this.serviceToDelete = '';
  }

  // Confirm service deletion
  confirmServiceDelete(): void {
    if (this.serviceToDelete) {
      this.client.services = this.client.services.filter(s => s !== this.serviceToDelete);
      this.showDeleteServiceModal = false;
      this.serviceToDelete = '';
    }
  }

  // Toggle edit mode for personal info
  toggleEditInfo(): void {
    if (this.isEditingInfo) {
      // Saving - validate all fields
      if (!this.validatePersonalInfo()) {
        return;
      }
      this.resetInfoErrors();
    } else {
      // Starting edit - store temp phone and reset errors
      this.tempPhone = this.client.phone;
      this.resetInfoErrors();
    }
    this.isEditingInfo = !this.isEditingInfo;
  }

  // Validate total required
  validateTotalRequired(): void {
    if (this.client.totalRequired === null || this.client.totalRequired === undefined) {
      this.totalRequiredError = 'الرجاء إدخال المبلغ المطلوب';
    } else if (this.client.totalRequired < 0) {
      this.totalRequiredError = 'المبلغ المطلوب يجب أن يكون صفر أو أكثر';
    } else {
      this.totalRequiredError = '';
    }
  }

  // Toggle edit mode for total required
  toggleEditTotalRequired(): void {
    if (this.isEditingTotalRequired) {
      // Saving - validate
      this.validateTotalRequired();
      if (this.totalRequiredError) {
        return;
      }
    } else {
      this.totalRequiredError = '';
    }
    this.isEditingTotalRequired = !this.isEditingTotalRequired;
  }

  // Validate payment amount
  validatePaymentAmount(): void {
    if (this.newPaymentAmount === null || this.newPaymentAmount === undefined) {
      this.paymentAmountError = 'الرجاء إدخال المبلغ';
    } else if (this.newPaymentAmount <= 0) {
      this.paymentAmountError = 'المبلغ يجب أن يكون أكبر من صفر';
    } else {
      this.paymentAmountError = '';
    }
  }

  // Add payment
  addPayment(): void {
    this.validatePaymentAmount();
    if (this.paymentAmountError) {
      return;
    }

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
      this.paymentAmountError = '';

      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 1000);
  }

  // Edit payment
  editPayment(payment: Payment): void {
    this.editingPaymentId = payment.paymentNumber;
    this.editPaymentErrors = { amount: '', date: '' };
  }

  // Validate edit payment field
  validateEditPaymentField(field: 'amount' | 'date', payment: Payment): void {
    switch (field) {
      case 'amount':
        if (payment.amount === null || payment.amount === undefined) {
          this.editPaymentErrors.amount = 'الرجاء إدخال المبلغ';
        } else if (payment.amount <= 0) {
          this.editPaymentErrors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
        } else {
          this.editPaymentErrors.amount = '';
        }
        break;
      case 'date':
        if (!payment.date) {
          this.editPaymentErrors.date = 'الرجاء إدخال التاريخ';
        } else {
          this.editPaymentErrors.date = '';
        }
        break;
    }
  }

  // Save payment edit
  savePayment(payment: Payment): void {
    this.validateEditPaymentField('amount', payment);
    this.validateEditPaymentField('date', payment);

    if (this.editPaymentErrors.amount || this.editPaymentErrors.date) {
      return;
    }

    this.editingPaymentId = null;
    this.editPaymentErrors = { amount: '', date: '' };
    // Recalculate total paid
    this.client.totalPaid = this.client.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  // Show delete payment modal
  deletePayment(payment: Payment): void {
    this.paymentToDelete = payment;
    this.showDeletePaymentModal = true;
  }

  // Cancel payment deletion
  cancelPaymentDelete(): void {
    this.showDeletePaymentModal = false;
    this.paymentToDelete = null;
  }

  // Confirm payment deletion
  confirmPaymentDelete(): void {
    if (this.paymentToDelete) {
      this.client.payments = this.client.payments.filter(p => p.paymentNumber !== this.paymentToDelete!.paymentNumber);
      this.client.totalPaid = this.client.payments.reduce((sum, p) => sum + p.amount, 0);
      // Renumber payments
      this.client.payments.forEach((p, index) => {
        p.paymentNumber = index + 1;
      });
      this.showDeletePaymentModal = false;
      this.paymentToDelete = null;
    }
  }
}
