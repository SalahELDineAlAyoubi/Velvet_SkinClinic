// src/app/components/layout/header/header.component.ts
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';
import { BirthdayNotification } from '../../../models/client.models';
 
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName = 'ميساء';
  showNotifications = false;
  birthdayClients: BirthdayNotification[] = [];
  birthdayCount = 0;
  daysToCheck = 10; // Show birthdays for next 10 days

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.checkUpcomingBirthdays();

    // Refresh notifications every 5 minutes
    setInterval(() => {
      this.checkUpcomingBirthdays();
    }, 300000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  checkUpcomingBirthdays(): void {
    this.clientService.getUpcomingBirthdays(this.daysToCheck).subscribe({
      next: (birthdays) => {
        this.birthdayClients = birthdays;
        this.birthdayCount = birthdays.length;
      },
      error: (error) => {
        console.error('Error fetching birthday notifications:', error);
        this.birthdayClients = [];
        this.birthdayCount = 0;
      }
    });
  }

  goToClient(client: BirthdayNotification): void {
    this.router.navigate(['/clients', client.id]);
    this.showNotifications = false;
  }

  getBirthdayMessage(client: BirthdayNotification): string {
    if (client.isToday) {
      return 'عيد ميلاد اليوم! 🎉';
    } else if (client.daysUntilBirthday === 1) {
      return 'غداً';
    } else {
      return `بعد ${client.daysUntilBirthday} أيام`;
    }
  }

  getBirthdayIcon(client: BirthdayNotification): string {
    if (client.isToday) {
      return '🎂';
    } else if (client.daysUntilBirthday <= 3) {
      return '🎉';
    } else {
      return '🎈';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
