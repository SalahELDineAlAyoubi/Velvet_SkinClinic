// src/app/components/services/services.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateServiceRequest, Service, UpdateServiceRequest } from '../../../core/models/service.models';
import { ServiceService } from '../../../core/services/service.service';
 
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];

  // Form data
  newService: CreateServiceRequest = this.getEmptyService();
  editingService: Service | null = null;
  showAddForm: boolean = false;
  searchTerm: string = '';
  showDeleteModal: boolean = false;
  serviceToDelete: Service | null = null;

  // Loading states
  loading: boolean = false;
  submitting: boolean = false;

  // Validation errors
  addErrors = {
    name: '',
    price: '',
    sessionsNumber: '',
    description: ''
  };

  editErrors = {
    name: '',
    price: '',
    sessionsNumber: '',
    description: ''
  };

  // Success message
  showSuccess: boolean = false;
  successMessage: string = '';

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  // Load all services
  loadServices(): void {
    this.loading = true;
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
        this.filterServices();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.showErrorMessage('فشل تحميل الخدمات');
        this.loading = false;
      }
    });
  }

  // Filter services based on search term
  filterServices(): void {
    if (!this.searchTerm) {
      this.filteredServices = [...this.services];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredServices = this.services.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term))
      );
    }
  }

  // Watch search term changes
  onSearchChange(): void {
    this.filterServices();
  }

  // Get empty service template
  getEmptyService(): CreateServiceRequest {
    return {
      name: '',
      description: '',
      price: 0,
      sessionsNumber: 0
    };
  }

  // Format amount
  formatAmount(amount: number): string {
    if (amount % 1 === 0) {
      return amount.toString();
    } else {
      return amount.toFixed(2).replace(/\.?0+$/, '');
    }
  }

  // Toggle add form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.newService = this.getEmptyService();
      this.editingService = null;
      this.resetAddErrors();
    }
  }

  // Add new service
  addService(): void {
    if (this.validateAddForm()) {
      this.submitting = true;

      this.serviceService.createService(this.newService).subscribe({
        next: (service) => {
          this.services.push(service);
          this.filterServices();
          this.newService = this.getEmptyService();
          this.showAddForm = false;
          this.resetAddErrors();
          this.showSuccessMessage('تم إضافة الخدمة بنجاح');
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error adding service:', error);
          this.showErrorMessage(error.message || 'فشل إضافة الخدمة');
          this.submitting = false;
        }
      });
    }
  }

  // Start editing service
  startEdit(service: Service): void {
    this.editingService = { ...service };
    this.showAddForm = false;
    this.resetEditErrors();
  }

  // Save edited service
  saveEdit(): void {
    if (this.editingService && this.validateEditForm()) {
      this.submitting = true;

      const updateRequest: UpdateServiceRequest = {
        name: this.editingService.name,
        description: this.editingService.description,
        price: this.editingService.price,
        sessionsNumber: this.editingService.sessionsNumber
      };

      this.serviceService.updateService(this.editingService.id, updateRequest).subscribe({
        next: (updatedService) => {
          const index = this.services.findIndex(s => s.id === updatedService.id);
          if (index !== -1) {
            this.services[index] = updatedService;
            this.filterServices();
          }
          this.editingService = null;
          this.resetEditErrors();
          this.showSuccessMessage('تم تحديث الخدمة بنجاح');
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating service:', error);
          this.showErrorMessage(error.message || 'فشل تحديث الخدمة');
          this.submitting = false;
        }
      });
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingService = null;
  }

  // Show delete confirmation modal
  deleteService(service: Service): void {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  // Cancel delete
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  // Confirm delete
  confirmDelete(): void {
    if (this.serviceToDelete) {
      this.submitting = true;

      this.serviceService.deleteService(this.serviceToDelete.id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== this.serviceToDelete!.id);
          this.filterServices();
          this.showSuccessMessage('تم حذف الخدمة بنجاح');
          this.showDeleteModal = false;
          this.serviceToDelete = null;
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.showErrorMessage(error.message || 'فشل حذف الخدمة');
          this.submitting = false;
        }
      });
    }
  }

  // Validate add form
  validateAddForm(): boolean {
    let isValid = true;
    this.resetAddErrors();

    if (!this.newService.name.trim()) {
      this.addErrors.name = 'الرجاء إدخال اسم الخدمة';
      isValid = false;
    } else if (this.newService.name.trim().length < 2) {
      this.addErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
      isValid = false;
    }

    if (this.newService.price === null || this.newService.price === undefined) {
      this.addErrors.price = 'الرجاء إدخال السعر';
      isValid = false;
    } else if (this.newService.price <= 0) {
      this.addErrors.price = 'السعر يجب أن يكون أكبر من صفر';
      isValid = false;
    }

    if (this.newService.sessionsNumber !== null &&
      this.newService.sessionsNumber !== undefined &&
      this.newService.sessionsNumber < 0) {
      this.addErrors.sessionsNumber = 'عدد الجلسات يجب أن يكون صفر أو أكثر';
      isValid = false;
    }

    return isValid;
  }

  // Validate edit form
  validateEditForm(): boolean {
    let isValid = true;
    this.resetEditErrors();

    if (!this.editingService) return false;

    if (!this.editingService.name.trim()) {
      this.editErrors.name = 'الرجاء إدخال اسم الخدمة';
      isValid = false;
    } else if (this.editingService.name.trim().length < 2) {
      this.editErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
      isValid = false;
    }

    if (this.editingService.price === null || this.editingService.price === undefined) {
      this.editErrors.price = 'الرجاء إدخال السعر';
      isValid = false;
    } else if (this.editingService.price <= 0) {
      this.editErrors.price = 'السعر يجب أن يكون أكبر من صفر';
      isValid = false;
    }

    if (this.editingService.sessionsNumber !== null &&
      this.editingService.sessionsNumber !== undefined &&
      this.editingService.sessionsNumber < 0) {
      this.editErrors.sessionsNumber = 'عدد الجلسات يجب أن يكون صفر أو أكثر';
      isValid = false;
    }

    return isValid;
  }

  // Validate field on blur (add form)
  validateAddField(field: keyof typeof this.addErrors): void {
    switch (field) {
      case 'name':
        if (!this.newService.name.trim()) {
          this.addErrors.name = 'الرجاء إدخال اسم الخدمة';
        } else if (this.newService.name.trim().length < 2) {
          this.addErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
        } else {
          this.addErrors.name = '';
        }
        break;
      case 'price':
        if (this.newService.price === null || this.newService.price === undefined) {
          this.addErrors.price = 'الرجاء إدخال السعر';
        } else if (this.newService.price <= 0) {
          this.addErrors.price = 'السعر يجب أن يكون أكبر من صفر';
        } else {
          this.addErrors.price = '';
        }
        break;
      case 'sessionsNumber':
        if (this.newService.sessionsNumber !== null &&
          this.newService.sessionsNumber !== undefined &&
          this.newService.sessionsNumber < 0) {
          this.addErrors.sessionsNumber = 'عدد الجلسات يجب أن يكون صفر أو أكثر';
        } else {
          this.addErrors.sessionsNumber = '';
        }
        break;
    }
  }

  // Validate field on blur (edit form)
  validateEditField(field: keyof typeof this.editErrors): void {
    if (!this.editingService) return;

    switch (field) {
      case 'name':
        if (!this.editingService.name.trim()) {
          this.editErrors.name = 'الرجاء إدخال اسم الخدمة';
        } else if (this.editingService.name.trim().length < 2) {
          this.editErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
        } else {
          this.editErrors.name = '';
        }
        break;
      case 'price':
        if (this.editingService.price === null || this.editingService.price === undefined) {
          this.editErrors.price = 'الرجاء إدخال السعر';
        } else if (this.editingService.price <= 0) {
          this.editErrors.price = 'السعر يجب أن يكون أكبر من صفر';
        } else {
          this.editErrors.price = '';
        }
        break;
      case 'sessionsNumber':
        if (this.editingService.sessionsNumber !== null &&
          this.editingService.sessionsNumber !== undefined &&
          this.editingService.sessionsNumber < 0) {
          this.editErrors.sessionsNumber = 'عدد الجلسات يجب أن يكون صفر أو أكثر';
        } else {
          this.editErrors.sessionsNumber = '';
        }
        break;
    }
  }

  // Reset validation errors
  resetAddErrors(): void {
    this.addErrors = {
      name: '',
      price: '',
      sessionsNumber: '',
      description: ''
    };
  }

  resetEditErrors(): void {
    this.editErrors = {
      name: '',
      price: '',
      sessionsNumber: '',
      description: ''
    };
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

  // Reset filters
  resetFilters(): void {
    this.searchTerm = '';
    this.filterServices();
  }
}
