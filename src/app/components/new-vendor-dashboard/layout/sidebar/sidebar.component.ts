import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
   @Input() sidebarOpen!: boolean;
  // Output event to notify the parent when the sidebar should be closed
  @Output() sidebarClose = new EventEmitter<void>();
}
