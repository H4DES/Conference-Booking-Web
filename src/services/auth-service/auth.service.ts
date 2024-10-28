import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!: string | null;
  constructor() { }

  getNameIdentifier(): string | null {
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      const decoded: any = jwtDecode(this.token);
      // Adjust the key based on your token's payload structure
      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    } else {
      return null;
    }
  }

  getUserRole(): string | null {
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      const decoded: any = jwtDecode(this.token);
      return (
        decoded['role'] || // Adjust this key based on your token's payload structure
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null
      );
    }
    return null;
  }

}
