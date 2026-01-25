import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  //rememberMe = false;
  showPassword = false;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(private router: Router) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Validation
    if (!this.credentials.username || !this.credentials.password) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      // Example login logic - replace with your actual authentication service
      if (this.credentials.username === 'admin' && this.credentials.password === 'admin123') {
        // Successful login
        localStorage.setItem('access_token', 'sdfdsfsdfds.sdfsdfsdfsd.sdfsdfsd');
        // Navigate to clients list or dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Failed login
        this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        this.loading = false;
      }
    }, 1500);
  }

  // Optional: Add methods for social login, forgot password, etc.
  onForgotPassword(): void {
    // Handle forgot password
    console.log('Forgot password clicked');
  }

  onRegister(): void {
    // Navigate to registration page
    this.router.navigate(['/dashboard']);
  }
}
