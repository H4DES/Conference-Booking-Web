import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserManagementComponent } from "../user-management/user-management.component";
import { SidebarComponent } from "../app/sidebar/sidebar.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    UserManagementComponent,
    SidebarComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  ngOnInit(): void {
    this.startClock();
  }
  
  userCount: number = 0;
  
  currentTime: Date = new Date();
  sidebarVisible: boolean = false;
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  startClock(){
    // Update the time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}
