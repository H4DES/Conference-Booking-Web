import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  status = false;
  addToggle()
{
  this.status = !this.status;       
}

}
