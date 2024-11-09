import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from "../app/sidebar/sidebar.component";
import { ConferenceManagementComponent } from "../conference-management/conference-management.component";

@Component({
  selector: 'app-conference',
  standalone: true,
  imports: [
              CommonModule,
              ButtonModule,
              SidebarComponent,
              ConferenceManagementComponent
           ],
  templateUrl: './conference.component.html',
  styleUrl: './conference.component.css'
})
export class ConferenceComponent implements OnInit{

  
  ngOnInit(): void {
    this.startClock();
  }
  
  conferenceCount: number = 0;
  
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
