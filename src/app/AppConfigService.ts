// app-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public readonly apiUrl = "https://100.90.130.38:2401/api/";//2501
  // public readonly apiUrl = "https://100.100.252.81:2501/api/";//2501

}
