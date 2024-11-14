import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../app/AppConfigService';
import { Holiday } from '../../model/holiday';
import { IApiResponse } from '../../model/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http: HttpClient, private config: AppConfigService) { }

  public onAddOrUpdateHoliday(data: Holiday): Observable<IApiResponse<string>> {
    return this.http.post<IApiResponse<string>>(this.config.apiUrl + 'Holiday/AddOrUpdateHoliday', data);
  }

  public onHolidayDelete(id: string): Observable<IApiResponse<string>> {
    return this.http.delete<IApiResponse<string>>(this.config.apiUrl + 'Holiday/DeleteHoliday/' + id);
  }

  public onGetAllHolday(): Observable<IApiResponse<Holiday[]>> {
    return this.http.get<IApiResponse<Holiday[]>>(this.config.apiUrl + 'Holiday/GetAllHoliday');
  }

  public onGetHolidayById(id: string): Observable<IApiResponse<Holiday>> {
    return this.http.get<IApiResponse<Holiday>>('Holiday/GetHolidayById/' + id);
  }

}
