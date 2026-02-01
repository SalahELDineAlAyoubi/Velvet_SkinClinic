import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Client {
  id: string;
  name: string;
  birthday: string;
  phone?: string;
}

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName = 'ميساء'; // you can get from AuthService
  showNotifications = false;
  birthdayClients: Client[] = [];
  birthdayCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.checkBirthdaysToday();
    // Refresh notifications every 5 minutes
    setInterval(() => {
      this.checkBirthdaysToday();
    }, 300000);
  }

  // Close notifications when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    console.log('Notifications toggled:', this.showNotifications);
    console.log('Birthday count:', this.birthdayCount);
    console.log('Birthday clients:', this.birthdayClients);
  }

  checkBirthdaysToday(): void {
    // Get today's date in DD/MM format
    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

    // TODO: Replace this with actual API call
    // Example: this.clientService.getClients().subscribe(clients => { ... });

    // For now, using mock data - REPLACE WITH YOUR API CALL
    const allClients: Client[] = [
      { id: '1', name: 'Maysa Ayoubi', birthday: '02/02/2005', phone: '03 181 111' },
      { id: '2', name: 'Sara Ahmad', birthday: '15/03/1995', phone: '03 123 456' },
      { id: '3', name: 'Lara Hassan', birthday: '01/02/1998', phone: '03 789 012' }
      // Add more mock clients or fetch from API
    ];

    // Filter clients with birthdays today
    this.birthdayClients = allClients.filter(client => {
      // Extract DD/MM from birthday (assuming format: DD/MM/YYYY or DD/MM)
      const birthdayParts = client.birthday.split('/');
      const clientBirthday = `${birthdayParts[0]}/${birthdayParts[1]}`;
      return clientBirthday === todayFormatted;
    });

    this.birthdayCount = this.birthdayClients.length;

    /* 
    // EXAMPLE: Real API implementation
    this.clientService.getClients().subscribe({
      next: (clients: Client[]) => {
        this.birthdayClients = clients.filter(client => {
          const birthdayParts = client.birthday.split('/');
          const clientBirthday = `${birthdayParts[0]}/${birthdayParts[1]}`;
          return clientBirthday === todayFormatted;
        });
        this.birthdayCount = this.birthdayClients.length;
      },
      error: (error) => {
        console.error('Error fetching birthday notifications:', error);
      }
    });
    */
  }

  goToClient(client: Client): void {
    // Navigate to client details page
    this.router.navigate(['/clients', client.id]);
    this.showNotifications = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
