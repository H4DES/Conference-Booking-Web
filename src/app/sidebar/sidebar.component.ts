import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarModule, DividerModule, ButtonModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit{
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private AuthServ: AuthService){}
  
  tokenRole: string | null = null;

  ngOnInit(): void {
      this.tokenRole = this.AuthServ.getUserRole()!;
  }
  


  // Handle visibility changes internally
  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
