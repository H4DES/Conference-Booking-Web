// app-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public readonly apiUrl = "https://100.100.252.81:2501/api/";
}
