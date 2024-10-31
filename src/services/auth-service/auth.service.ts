import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../model/login';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { jwtDecode } from 'jwt-decode';
import { Register } from '../../model/register';
import { Admin } from '../../model/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "https://100.90.130.38:2401/api/";
  constructor(private http: HttpClient) { }

  token!: string | null;

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

  public onLogin(data: Login): Observable<IApiResponse<Login>> {
    return this.http.post<IApiResponse<Login>>(this.apiUrl + 'UserAuth/Login', data);
  }

  public onRegisterUser(data: Register): Observable<IApiResponse<Register>> {
    return this.http.post<IApiResponse<Register>>(this.apiUrl + 'UserAuth/RegisterUser', data);
  }

  public onGetAdmins(): Observable<IApiResponse<Admin>> {
    return this.http.get<IApiResponse<Admin>>(this.apiUrl + 'UserAuth/GetAllAdmins');
  }

  public onGetUserConferenceId(id: string): Observable<IApiResponse<number>> {
    return this.http.get<IApiResponse<number>>(this.apiUrl + 'UserAuth/GetUserConferenceId?userId=' + id);
  }
}
