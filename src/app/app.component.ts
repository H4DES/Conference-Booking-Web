import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
              RouterOutlet
           ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Conference-Booking';
  // public apiUrl = "https://100.100.252.81:2501/api/";
}
