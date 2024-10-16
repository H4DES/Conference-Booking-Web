import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../model/api-response';
import { Booking } from '../../model/booking';
import { Conference } from '../../model/conference';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = "https://100.90.130.38:7026/api/";
  constructor(private http: HttpClient) { }


  // Get calls
  public onGetBookingByConferenceId(ID: number): Observable<IApiResponse<Booking[]>> {
    return this.http.get<IApiResponse<Booking[]>>(this.apiUrl +  'Booking/GetBookingByConferenceID/' + ID)
  }

  public onGetBookingByBookingId(ID: number): Observable<IApiResponse<Booking>> {
    return this.http.get<IApiResponse<Booking>>(this.apiUrl + 'Booking/GetBookingByBookingID/' + ID)
  }

  public onGetAllBooking(): Observable<IApiResponse<Booking[]>> {
    return this.http.get<IApiResponse<Booking[]>>(this.apiUrl + 'Booking/GetAllBooking')
  }

  // Post calls
  public onAddOrUpdateBooking(data: Booking): Observable<IApiResponse<Booking>> {
    return this.http.post<IApiResponse<Booking>>(this.apiUrl + 'Booking/AddOrUpdateBooking', data);
  }

  // Delete calls
  public onBookingDelete(ID: number): Observable<IApiResponse<Booking>> {
    return this.http.delete<IApiResponse<Booking>>(this.apiUrl + 'Booking/DeleteBooking/' + ID)
  }

}
