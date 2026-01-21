import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  isAuthenticated(): boolean {
    //const token = localStorage.getItem('access_token');
    const  token = true;
    return !!token;
  }

  logout() {
    ///localStorage.removeItem('access_token');
  }
}
