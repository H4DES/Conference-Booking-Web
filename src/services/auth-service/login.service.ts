import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../model/login';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "https://100.90.130.38:2401/api/";
  constructor(private http: HttpClient) { }

  public onLogin(data: Login): Observable<IApiResponse<Login>> {
    return this.http.post<IApiResponse<Login>>(this.apiUrl + 'UserAuth/Login', data);
  }


}
