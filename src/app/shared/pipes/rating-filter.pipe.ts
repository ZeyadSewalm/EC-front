import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products';

@Pipe({
  name: 'ratingFilter',
  standalone: true,
})
export class RatingFilterPipe implements PipeTransform {
  transform(products: Products[], rating: number): Products[] {
    return products.filter((product) => product.rating >= rating);
  }
}
