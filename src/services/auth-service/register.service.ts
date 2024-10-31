import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Register } from '../../model/register';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { AppComponent } from '../../app/app.component';
import { AppConfigService } from '../../app/AppConfigService';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // private apiUrl = "https://100.90.130.38:2401/api/";
  // private apiUrl = "https://100.100.252.81:2501/api/";
  // private apiUrl = "https://localhost:7026/api/";
  constructor(private http: HttpClient, private config: AppConfigService) { }

  public onRegisterUser(data: Register): Observable<IApiResponse<Register>> {
    return this.http.post<IApiResponse<Register>>(this.config.apiUrl + 'UserAuth/RegisterUser', data);
  }
}
