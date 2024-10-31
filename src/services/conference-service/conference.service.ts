import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Conference } from '../../model/conference';
import { IApiResponse } from '../../model/api-response';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app/app.component';
import { AppConfigService } from '../../app/AppConfigService';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  // private apiUrl = "https://100.90.130.38:7026/api/";
  // private apiUrl = "https://localhost:7026/api/";
  constructor(private http: HttpClient, private config: AppConfigService) { }

  // Get calls
  public onGetAllConference(): Observable<IApiResponse<Conference[]>> {
    return this.http.get<IApiResponse<Conference[]>>(this.config.apiUrl + 'Conference/GetAllConference')
  }

  // Post calls
  public onAddOrUpdateConference(data: Conference): Observable<IApiResponse<Conference>> {
    return this.http.post<IApiResponse<Conference>>(this.config.apiUrl + 'Conference/AddOrUpdateConference', data)
  }

  // Delete calls
  public onConferenceDelete(ID: number): Observable<IApiResponse<Conference>> {
    return this.http.delete<IApiResponse<Conference>>(this.config.apiUrl + 'Conference/DeleteConference/' + ID)
  }
}
