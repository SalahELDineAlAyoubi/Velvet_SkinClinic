// src/app/components/details-client/details-client.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../core/models/service.models';
import { Client, CreatePaymentRequest, Payment, UpdateClientRequest, UpdateClientTotalRequiredRequest, UpdatePaymentRequest } from '../../../core/models/client.models';
import { ClientService } from '../../../core/services/client.service';
import { ServiceService } from '../../../core/services/service.service';
  
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details-client.component.html',
  styleUrl: './details-client.component.css'
})
export class DetailsClientComponent implements OnInit {
  client: Client | null = null;
  availableServices: Service[] = [];
  selectedServiceId: number | null = null;
  newPaymentAmount: number = 0;

  // Loading states
  loading: boolean = true;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

  // Edit modes
  isEditingInfo: boolean = false;
  isEditingTotalRequired: boolean = false;
  editingPaymentId: number | null = null;

  // Modals
  showDeleteModal: boolean = false;
  showDeleteServiceModal: boolean = false;
  showDeletePaymentModal: boolean = false;
  serviceToDelete: Service | null = null;
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

  // Temporary storage for editing
  tempClient: UpdateClientRequest | null = null;
  tempTotalRequired: number = 0;
  tempPayment: UpdatePaymentRequest | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private serviceService: ServiceService
  ) { }

  ngOnInit(): void {
    // Get client ID from route
    const clientId = this.route.snapshot.paramMap.get('id');

    if (clientId) {
      this.loadClient(parseInt(clientId));
      this.loadServices();
    } else {
      this.showErrorMessage('معرف العميل غير صحيح');
      this.router.navigate(['/dashboard']);
    }
  }

  // Load client data
  loadClient(id: number): void {
    this.loading = true;
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading client:', error);
        this.showErrorMessage(error.message || 'فشل تحميل بيانات العميل');
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  // Load available services
  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.availableServices = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  get remainingAmount(): number {
    return this.client ? this.client.totalRequired - this.client.totalPaid : 0;
  }

  // Get services not already added to client
  get availableServicesToAdd(): Service[] {
    if (!this.client) return [];
    const clientServiceIds = this.client.services.map(s => s.id);
    return this.availableServices.filter(s => !clientServiceIds.includes(s.id));
  }

  // Format amount
  formatAmount(amount: number): string {
    if (amount % 1 === 0) {
      return amount.toString();
    } else {
      return amount.toFixed(2).replace(/\.?0+$/, '');
    }
  }

  // Open WhatsApp
  openWhatsApp(): void {
    if (!this.client) return;

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

  // Validate Lebanese phone number
  validateLebanesePhone(phone: string): boolean {
     if (!/^[0-9]+$/.test(phone)) {
    return false;
  }

    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const mobilePattern = /^(03|70|71|76|78|79|81)\d{6}$/;
    const landlinePattern = /^(01|04|05|06|07|09)\d{6}$/;
    return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
  }

  // Validate birthday
  validateBirthday(birthday: string): boolean {
    if (!birthday) return true; // Optional field
    const pattern = /^(\d{2})\/(\d{2})(\/\d{4})?$/;
    if (!pattern.test(birthday)) return false;

    const parts = birthday.split('/');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;

    return true;
  }

  // Validate personal info field
  validateInfoField(field: keyof typeof this.infoErrors): void {
    if (!this.client) return;

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
          this.infoErrors.phone = 'رقم الهاتف غير صحيح';
        } else {
          this.infoErrors.phone = '';
        }
        break;
      case 'birthday':
        if (this.client.birthday && !this.validateBirthday(this.client.birthday)) {
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

  // Toggle edit mode for personal info
  toggleEditInfo(): void {
    if (!this.client) return;

    if (this.isEditingInfo) {
      // Saving - validate
      if (!this.validatePersonalInfo()) {
        return;
      }

      this.isSubmitting = true;
      const updateRequest: UpdateClientRequest = {
        name: this.client.name,
        phone: this.client.phone,
        birthday: this.client.birthday,
        diseases: this.client.diseases,
        notes: this.client.notes
      };

      this.clientService.updateClient(this.client.id, updateRequest).subscribe({
        next: (updatedClient) => {
          this.client = updatedClient;
          this.isEditingInfo = false;
          this.resetInfoErrors();
          this.showSuccessMessage('تم تحديث المعلومات بنجاح');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.showErrorMessage(error.message || 'فشل تحديث المعلومات');
          this.isSubmitting = false;
        }
      });
    } else {
      // Starting edit - store temp and reset errors
      this.tempClient = {
        name: this.client.name,
        phone: this.client.phone,
        birthday: this.client.birthday,
        diseases: this.client.diseases,
        notes: this.client.notes
      };
      this.resetInfoErrors();
      this.isEditingInfo = true;
    }
  }

  // Validate total required
  validateTotalRequired(): void {
    if (!this.client) return;

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
    if (!this.client) return;

    if (this.isEditingTotalRequired) {
      // Saving - validate
      this.validateTotalRequired();
      if (this.totalRequiredError) {
        return;
      }

      this.isSubmitting = true;
      const updateRequest: UpdateClientTotalRequiredRequest = {
        totalRequired: this.client.totalRequired
      };

      this.clientService.updateClientTotalRequired(this.client.id, updateRequest).subscribe({
        next: (updatedClient) => {
          this.client = updatedClient;
          this.isEditingTotalRequired = false;
          this.totalRequiredError = '';
          this.showSuccessMessage('تم تحديث المبلغ المطلوب بنجاح');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating total required:', error);
          this.showErrorMessage(error.message || 'فشل تحديث المبلغ المطلوب');
          this.isSubmitting = false;
        }
      });
    } else {
      // Starting edit
      this.tempTotalRequired = this.client.totalRequired;
      this.totalRequiredError = '';
      this.isEditingTotalRequired = true;
    }
  }

  // Add service
  addService(): void {
    if (!this.client || !this.selectedServiceId) return;

    this.isSubmitting = true;
    this.clientService.addServiceToClient(this.client.id, this.selectedServiceId).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient;
        this.selectedServiceId = null;
        this.showSuccessMessage('تم إضافة الخدمة بنجاح');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding service:', error);
        this.showErrorMessage(error.message || 'فشل إضافة الخدمة');
        this.isSubmitting = false;
      }
    });
  }

  // Show delete service modal
  removeService(service: Service): void {
    this.serviceToDelete = service;
    this.showDeleteServiceModal = true;
  }

  // Cancel service deletion
  cancelServiceDelete(): void {
    this.showDeleteServiceModal = false;
    this.serviceToDelete = null;
  }

  // Confirm service deletion
  confirmServiceDelete(): void {
    if (!this.client || !this.serviceToDelete) return;

    this.isSubmitting = true;
    this.clientService.removeServiceFromClient(this.client.id, this.serviceToDelete.id).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient;
        this.showDeleteServiceModal = false;
        this.serviceToDelete = null;
        this.showSuccessMessage('تم حذف الخدمة بنجاح');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error removing service:', error);
        this.showErrorMessage(error.message || 'فشل حذف الخدمة');
        this.isSubmitting = false;
      }
    });
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
    if (!this.client) return;

    this.validatePaymentAmount();
    if (this.paymentAmountError) {
      return;
    }

    this.isSubmitting = true;
    const paymentRequest: CreatePaymentRequest = {
      amount: this.newPaymentAmount
    };

    this.clientService.addPayment(this.client.id, paymentRequest).subscribe({
      next: (payment) => {
        // Reload client to get updated data
        this.loadClient(this.client!.id);
        this.newPaymentAmount = 0;
        this.paymentAmountError = '';
        this.showSuccessMessage('تم إضافة الدفعة بنجاح');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error adding payment:', error);
        this.showErrorMessage(error.message || 'فشل إضافة الدفعة');
        this.isSubmitting = false;
      }
    });
  }

  // Edit payment
  editPayment(payment: Payment): void {
    this.editingPaymentId = payment.paymentNumber;
    this.tempPayment = {
      amount: payment.amount,
      date: payment.date
    };
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
    if (!this.client) return;

    this.validateEditPaymentField('amount', payment);
    this.validateEditPaymentField('date', payment);

    if (this.editPaymentErrors.amount || this.editPaymentErrors.date) {
      return;
    }

    this.isSubmitting = true;
    const updateRequest: UpdatePaymentRequest = {
      amount: payment.amount,
      date: payment.date
    };

    this.clientService.updatePayment(this.client.id, payment.paymentNumber, updateRequest).subscribe({
      next: (updatedPayment) => {
        // Reload client to get updated totals
        this.loadClient(this.client!.id);
        this.editingPaymentId = null;
        this.tempPayment = null;
        this.editPaymentErrors = { amount: '', date: '' };
        this.showSuccessMessage('تم تحديث الدفعة بنجاح');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating payment:', error);
        this.showErrorMessage(error.message || 'فشل تحديث الدفعة');
        this.isSubmitting = false;
      }
    });
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
    if (!this.client || !this.paymentToDelete) return;

    this.isSubmitting = true;
    this.clientService.deletePayment(this.client.id, this.paymentToDelete.paymentNumber).subscribe({
      next: () => {
        // Reload client to get updated data and renumbered payments
        this.loadClient(this.client!.id);
        this.showDeletePaymentModal = false;
        this.paymentToDelete = null;
        this.showSuccessMessage('تم حذف الدفعة بنجاح');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        this.showErrorMessage(error.message || 'فشل حذف الدفعة');
        this.isSubmitting = false;
      }
    });
  }

  // Show delete client confirmation modal
  deleteClient(): void {
    this.showDeleteModal = true;
  }

  // Cancel client deletion
  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  // Confirm client deletion
  confirmDelete(): void {
    if (!this.client) return;

    this.isSubmitting = true;
    this.clientService.deleteClient(this.client.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.showSuccessMessage('تم حذف العميل بنجاح');
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting client:', error);
        this.showErrorMessage(error.message || 'فشل حذف العميل');
        this.isSubmitting = false;
      }
    });
  }

  // Success message
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // Error message
  showErrorMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 5000);
  }
}
