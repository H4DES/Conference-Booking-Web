import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarModule, ButtonModule, RippleModule, 
            AvatarModule, StyleClassModule, DividerModule, CardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e: any): void {
        this.sidebarRef.close(e);
    }
  sidebarVisible: boolean = false;

}
