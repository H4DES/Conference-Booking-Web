import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conference } from '../../model/conference';
import { IApiResponse } from '../../model/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  private apiUrl = "https://conferencebooking.local/api/";
  constructor(private http: HttpClient) { }

  // Get calls
  public onGetAllConference(): Observable<IApiResponse<Conference[]>> {
    return this.http.get<IApiResponse<Conference[]>>(this.apiUrl + 'Conference/GetAllConference')
  }

  // Post calls
  public onAddOrUpdateConference(data: Conference): Observable<IApiResponse<Conference>> {
    return this.http.post<IApiResponse<Conference>>(this.apiUrl + 'Conference/AddOrUpdateConference', data)
  }

  // Delete calls
  public onConferenceDelete(ID: number): Observable<IApiResponse<Conference>> {
    return this.http.delete<IApiResponse<Conference>>(this.apiUrl + 'Conference/DeleteConference/' + ID)
  }
}
