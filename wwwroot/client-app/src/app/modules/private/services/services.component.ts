import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "30 دقيقة"
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
    { id: 1, name: 'Hifu', description: 'شد الوجه بالموجات فوق الصوتية', price: 200, duration: '60 دقيقة' },
    { id: 2, name: 'BBL', description: 'تكبير الأرداف البرازيلي', price: 350, duration: '90 دقيقة' },
    { id: 3, name: 'Cavitation', description: 'تفتيت الدهون بالموجات الصوتية', price: 150, duration: '45 دقيقة' },
    { id: 4, name: 'Laser', description: 'إزالة الشعر بالليزر', price: 100, duration: '30 دقيقة' },
    { id: 5, name: 'Botox', description: 'حقن البوتوكس للتجاعيد', price: 250, duration: '20 دقيقة' },
    { id: 6, name: 'Filler', description: 'حشوات الوجه والشفاه', price: 280, duration: '30 دقيقة' },
    { id: 7, name: 'Microneedling', description: 'الوخز بالإبر الدقيقة', price: 180, duration: '45 دقيقة' },
    { id: 8, name: 'PRP', description: 'حقن البلازما الغنية بالصفائح', price: 220, duration: '40 دقيقة' },
    { id: 9, name: 'Chemical Peel', description: 'التقشير الكيميائي للبشرة', price: 120, duration: '30 دقيقة' },
    { id: 10, name: 'Mesotherapy', description: 'حقن الميزوثيرابي', price: 160, duration: '35 دقيقة' }
  ];

  // Form data
  newService: Service = this.getEmptyService();
  editingService: Service | null = null;
  showAddForm: boolean = false;
  searchTerm: string = '';

  // Get empty service template
  getEmptyService(): Service {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      duration: ''
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
    }
  }

  // Add new service
  addService(): void {
    if (this.validateService(this.newService)) {
      this.newService.id = this.getNextId();
      this.services.push({ ...this.newService });
      this.newService = this.getEmptyService();
      this.showAddForm = false;
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
  }

  // Save edited service
  saveEdit(): void {
    if (this.editingService && this.validateService(this.editingService)) {
      const index = this.services.findIndex(s => s.id === this.editingService!.id);
      if (index !== -1) {
        this.services[index] = { ...this.editingService };
        this.editingService = null;
        this.showSuccessMessage('تم تحديث الخدمة بنجاح');
      }
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingService = null;
  }

  // Delete service
  deleteService(service: Service): void {
    if (confirm(`هل أنت متأكد من حذف خدمة "${service.name}"؟`)) {
      this.services = this.services.filter(s => s.id !== service.id);
      this.showSuccessMessage('تم حذف الخدمة بنجاح');
    }
  }

  // Validate service
  validateService(service: Service): boolean {
    if (!service.name.trim()) {
      alert('الرجاء إدخال اسم الخدمة');
      return false;
    }
    if (service.price <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return false;
    }
    return true;
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
