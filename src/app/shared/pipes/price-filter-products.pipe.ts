import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products';

@Pipe({
  name: 'priceFilterProducts',
  standalone: true,
})
export class PriceFilterProductsPipe implements PipeTransform {
  transform(products: Products[], rangeValues: number[]): Products[] {
    const minPrice = rangeValues[0];
    const maxPrice = rangeValues[1];
    return products.filter(
      (product) => Number(product.price )>= minPrice && Number(product.price) <= maxPrice
    );
  }
}
