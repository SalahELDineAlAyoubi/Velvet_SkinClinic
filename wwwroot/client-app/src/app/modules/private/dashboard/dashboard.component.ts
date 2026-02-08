// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientListItem, CreateClientMinimalRequest } from '../../../core/models/client.models';
import { ClientService } from '../../../core/services/client.service';
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private _searchTerm: string = '';

  clients: ClientListItem[] = [];
  filteredClients: ClientListItem[] = [];

  // Pagination
  page: number = 1;
  pageSize: number = 10;

  // Add client form
  showAddModal: boolean = false;
  newClient: CreateClientMinimalRequest = {
    name: '',
    phone: ''
  };
  formErrors = {
    name: '',
    phone: ''
  };

  // Loading states
  loading: boolean = true;
  submitting: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.page = 1;
    this.filterClients();
  }

  // Load all clients
  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClientsList().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.showErrorMessage('فشل تحميل قائمة العملاء');
        this.loading = false;
      }
    });
  }

  // Filter clients
  filterClients(): void {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredClients = this.clients.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.clientIdentifier.includes(term)
      );
    }
  }

  get paginatedClients(): ClientListItem[] {
    if (this.page > this.totalPages) {
      this.page = this.totalPages || 1;
    }
    const start = (this.page - 1) * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClients.length / this.pageSize);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  goToClient(id: number): void {
    this.router.navigate(['/clients', id]);
  }

  // Validate Lebanese phone number
  validateLebanesePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const mobilePattern = /^(03|70|71|76|78|79|81)\d{6}$/;
    const landlinePattern = /^(01|04|05|06|07|09)\d{6}$/;
    return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
  }

  // Open add client modal
  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  // Close add client modal
  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.newClient = { name: '', phone: '' };
    this.formErrors = { name: '', phone: '' };
  }

  // Validate form
  validateForm(): boolean {
    let isValid = true;
    this.formErrors = { name: '', phone: '' };

    // Validate name
    if (!this.newClient.name.trim()) {
      this.formErrors.name = 'الاسم مطلوب';
      isValid = false;
    } else if (this.newClient.name.trim().length < 3) {
      this.formErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
      isValid = false;
    }

    // Validate mobile
    if (!this.newClient.phone.trim()) {
      this.formErrors.phone = 'رقم الهاتف مطلوب';
      isValid = false;
    } else if (!this.validateLebanesePhone(this.newClient.phone)) {
      this.formErrors.phone = 'رقم الهاتف غير صحيح. يجب أن يكون رقم لبناني صحيح';
      isValid = false;
    }

    return isValid;
  }

  // Add new client
  addClient(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;

    this.clientService.createClientMinimal(this.newClient).subscribe({
      next: (client) => {
        // Add to local array
        const newListItem: ClientListItem = {
          id: client.id,
          clientIdentifier: client.clientIdentifier,
          name: client.name,
          phone: client.phone
        };

        this.clients.push(newListItem);
        this.filterClients();

        // Show success message
        this.showSuccessMessage('تم إضافة العميل بنجاح');

        // Close modal
        this.closeAddModal();

        // Navigate to last page to see new client
        this.page = this.totalPages;

        this.submitting = false;
      },
      error: (error) => {
        console.error('Error adding client:', error);

        // Check if it's a duplicate phone error
        if (error.message.includes('مسجل مسبقاً')) {
          this.formErrors.phone = error.message;
        } else {
          this.showErrorMessage(error.message || 'فشل إضافة العميل');
        }

        this.submitting = false;
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
