import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlanknavComponent } from '../blanknav/blanknav.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [
    CommonModule,
    BlanknavComponent,
    RouterOutlet,
    FooterComponent,
    ScrollTopModule,
  ],
  templateUrl: './blank-layout.component.html',
  styleUrls: ['./blank-layout.component.scss'],
})
export class BlankLayoutComponent {
  showScrollButton: boolean = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = scrollY > innerHeight;
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
  }
  goToUp(): void {
    scrollTo(0, 0);
  }
}
