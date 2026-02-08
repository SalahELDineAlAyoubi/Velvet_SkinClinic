 import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  showPassword = false;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Validation
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.loading = true;

    // Call authentication service
    this.authService.login(this.credentials.username, this.credentials.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.message || 'اسم المستخدم أو كلمة المرور غير صحيحة';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // Navigate to forgot password page
    // this.router.navigate(['/forgot-password']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}
