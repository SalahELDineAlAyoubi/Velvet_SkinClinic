import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  sessionsNumber: number; // e.g., "30 دقيقة"
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services: Service[] = [
    { id: 1, name: 'Hifu', description: 'شد الوجه بالموجات فوق الصوتية', price: 200, sessionsNumber: 5 },
    { id: 2, name: 'BBL', description: 'تكبير الأرداف البرازيلي', price: 350, sessionsNumber: 5 },
    { id: 3, name: 'Cavitation', description: 'تفتيت الدهون بالموجات الصوتية', price: 150, sessionsNumber: 6 },
    { id: 4, name: 'Laser', description: 'إزالة الشعر بالليزر', price: 100, sessionsNumber: 6 },
    { id: 5, name: 'Botox', description: 'حقن البوتوكس للتجاعيد', price: 250, sessionsNumber: 15 },
    { id: 6, name: 'Filler', description: 'حشوات الوجه والشفاه', price: 280, sessionsNumber: 3 },
    { id: 7, name: 'Microneedling', description: 'الوخز بالإبر الدقيقة', price: 180, sessionsNumber: 22 },
    { id: 8, name: 'PRP', description: 'حقن البلازما الغنية بالصفائح', price: 220, sessionsNumber: 3 },
    { id: 9, name: 'Chemical Peel', description: 'التقشير الكيميائي للبشرة', price: 120, sessionsNumber: 4 },
    { id: 10, name: 'Mesotherapy', description: 'حقن الميزوثيرابي', price: 160, sessionsNumber: 5 }
  ];

  // Form data
  newService: Service = this.getEmptyService();
  editingService: Service | null = null;
  showAddForm: boolean = false;
  searchTerm: string = '';
  showDeleteModal: boolean = false;
  serviceToDelete: Service | null = null;

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

  // Get empty service template
  getEmptyService(): Service {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      sessionsNumber: 0
    };
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

  // Filter services
  get filteredServices(): Service[] {
    let filtered = this.services;

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  // Get total services count
  get totalServices(): number {
    return this.services.length;
  }

  // Get total revenue if all services sold once
  //get totalRevenue(): number {
  //  return this.services.reduce((sum, s) => sum + s.price, 0);
  //}

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
      this.newService.id = this.getNextId();
      this.services.push({ ...this.newService });
      this.newService = this.getEmptyService();
      this.showAddForm = false;
      this.resetAddErrors();
      this.showSuccessMessage('تم إضافة الخدمة بنجاح');
    }
  }

  // Get next ID
  getNextId(): number {
    return this.services.length > 0
      ? Math.max(...this.services.map(s => s.id)) + 1
      : 1;
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
      const index = this.services.findIndex(s => s.id === this.editingService!.id);
      if (index !== -1) {
        this.services[index] = { ...this.editingService };
        this.editingService = null;
        this.resetEditErrors();
        this.showSuccessMessage('تم تحديث الخدمة بنجاح');
      }
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
      this.services = this.services.filter(s => s.id !== this.serviceToDelete!.id);
      this.showSuccessMessage('تم حذف الخدمة بنجاح');
      this.showDeleteModal = false;
      this.serviceToDelete = null;
    }
  }

  // Validate add form
  validateAddForm(): boolean {
    let isValid = true;
    this.resetAddErrors();

    // Validate name
    if (!this.newService.name.trim()) {
      this.addErrors.name = 'الرجاء إدخال اسم الخدمة';
      isValid = false;
    } else if (this.newService.name.trim().length < 2) {
      this.addErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
      isValid = false;
    }

    // Validate price
    if (this.newService.price === null || this.newService.price === undefined) {
      this.addErrors.price = 'الرجاء إدخال السعر';
      isValid = false;
    } else if (this.newService.price <= 0) {
      this.addErrors.price = 'السعر يجب أن يكون أكبر من صفر';
      isValid = false;
    }

    // Validate sessions number (optional but if provided must be valid)
    if (this.newService.sessionsNumber !== null && this.newService.sessionsNumber !== undefined && this.newService.sessionsNumber < 0) {
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

    // Validate name
    if (!this.editingService.name.trim()) {
      this.editErrors.name = 'الرجاء إدخال اسم الخدمة';
      isValid = false;
    } else if (this.editingService.name.trim().length < 2) {
      this.editErrors.name = 'اسم الخدمة يجب أن يكون حرفين على الأقل';
      isValid = false;
    }

    // Validate price
    if (this.editingService.price === null || this.editingService.price === undefined) {
      this.editErrors.price = 'الرجاء إدخال السعر';
      isValid = false;
    } else if (this.editingService.price <= 0) {
      this.editErrors.price = 'السعر يجب أن يكون أكبر من صفر';
      isValid = false;
    }

    // Validate sessions number (optional but if provided must be valid)
    if (this.editingService.sessionsNumber !== null && this.editingService.sessionsNumber !== undefined && this.editingService.sessionsNumber < 0) {
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
        if (this.newService.sessionsNumber !== null && this.newService.sessionsNumber !== undefined && this.newService.sessionsNumber < 0) {
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
        if (this.editingService.sessionsNumber !== null && this.editingService.sessionsNumber !== undefined && this.editingService.sessionsNumber < 0) {
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

  // Success message handling
  showSuccess: boolean = false;
  successMessage: string = '';

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  // Reset filters
  resetFilters(): void {
    this.searchTerm = '';
  }
}
