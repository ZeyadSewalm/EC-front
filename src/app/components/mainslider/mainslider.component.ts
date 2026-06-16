import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './mainslider.component.html',
  styleUrls: ['./mainslider.component.scss'],
})
export class MainsliderComponent {
  mainSliderOption: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 4000,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
  items: 1,
  nav: true,
  };
}
