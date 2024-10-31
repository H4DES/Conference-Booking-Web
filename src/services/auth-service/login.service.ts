import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from '../../model/login';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { AppComponent } from '../../app/app.component';
import { AppConfigService } from '../../app/AppConfigService';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // private apiUrl = "https://100.90.130.38:2401/api/";
  // private apiUrl = "https://localhost:7026/api/";

  constructor(private http: HttpClient, private config: AppConfigService) { }

  public onLogin(data: Login): Observable<IApiResponse<Login>> {
    return this.http.post<IApiResponse<Login>>(this.config.apiUrl + 'UserAuth/Login', data);
  }


}
