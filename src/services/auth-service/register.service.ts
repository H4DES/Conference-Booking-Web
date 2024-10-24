import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../model/register';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = "https://100.90.130.38:2401/api/";
  constructor(private http: HttpClient) { }

  public onRegisterUser(data: Register): Observable<IApiResponse<Register>> {
    return this.http.post<IApiResponse<Register>>(this.apiUrl + 'UserAuth/RegisterUser', data);
  }
}
