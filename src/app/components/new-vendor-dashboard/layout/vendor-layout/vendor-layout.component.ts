import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet, SidebarComponent, RouterModule],
  templateUrl: './vendor-layout.component.html',
  styleUrls: ['./vendor-layout.component.scss']
})
export class VendorLayoutComponent {
  // Use a signal to manage the state of the sidebar's visibility.
    sidebarOpen = signal(false);


}
