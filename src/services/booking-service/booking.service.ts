import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { Booking } from '../../model/booking';
import { Conference } from '../../model/conference';
import { AppComponent } from '../../app/app.component';
import { AppConfigService } from '../../app/AppConfigService';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  // private apiUrl = "https://100.90.130.38:2401/api/";
  // private apiUrl = "https://localhost:7026/api/";
  constructor(private http: HttpClient, private config: AppConfigService) { }


  // Get calls
  public onGetBookingByConferenceId(ID: string): Observable<IApiResponse<Booking[]>> {
    return this.http.get<IApiResponse<Booking[]>>(this.config.apiUrl +  'Booking/GetBookingByConferenceID/' + ID)
  }

  public onGetBookingByBookingId(ID: string): Observable<IApiResponse<Booking>> {
    return this.http.get<IApiResponse<Booking>>(this.config.apiUrl + 'Booking/GetBookingByBookingID/' + ID)
  }

  public onGetAllBooking(): Observable<IApiResponse<Booking[]>> {
    return this.http.get<IApiResponse<Booking[]>>(this.config.apiUrl + 'Booking/GetAllBooking')
  }

  // Post calls
  public onAddOrUpdateBooking(data: Booking): Observable<IApiResponse<Booking>> {
    return this.http.post<IApiResponse<Booking>>(this.config.apiUrl + 'Booking/AddOrUpdateBooking', data);
    console.log(this.http.post<IApiResponse<Booking>>(this.config.apiUrl + 'Booking/AddOrUpdateBooking', data));
  }

  public onUpdateBookingStatus(data: Booking): Observable<IApiResponse<Booking>> {
    return this.http.post<IApiResponse<Booking>>(this.config.apiUrl + 'Booking/UpdateBookingStatus', data);
  }

  // Delete calls
  public onBookingDelete(ID: string): Observable<IApiResponse<Booking>> {
    return this.http.delete<IApiResponse<Booking>>(this.config.apiUrl + 'Booking/DeleteBooking/' + ID)
  }

}
