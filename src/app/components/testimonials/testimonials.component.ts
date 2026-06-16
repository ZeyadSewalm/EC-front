import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 Add this line
})
export class TestimonialsComponent {
  testimonials = [
    {
      name: 'Amy',
      job:'designer',
      text: 'Discovering Be Better was a game-changer! Their unmatched expertise skyrocketed my online presence and credibility. Highly recommended'
    },
    {
      name: 'Jhon',
      job:'designer',
      text: "Thanks to Be Better, I've unlocked my true potential and transformed how others perceive me. Their tailored strategies are a must for anyone looking to stand out!"
    },
    {
      name: 'Katie',
      job:'designer',
      text: "Working with Be Better, was one of the best career decisions I've made. Their dedication resulted in a brand identity that truly resonates with my audience."
    },
  ];

}
