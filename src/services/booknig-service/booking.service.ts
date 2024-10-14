import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { Booking } from '../../model/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = "";
  constructor(private http: HttpClient) { }

  public onGetBookingByConferenceId(): Observable<IApiResponse<Booking[]>> {
    return this.http.get<IApiResponse<Booking[]>>(this.apiUrl +  '')
  }

}
