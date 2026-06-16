import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products';

@Pipe({
  name: 'brandFilterProducts',
  standalone: true,
})
export class BrandFilterProductsPipe implements PipeTransform {
  transform(products: Products[], selectedBrands: string[]): Products[] {
    if (!selectedBrands || selectedBrands.length === 0) {
      return products;
    }
    return products.filter((product) => selectedBrands.includes(product.brand));
  }
}
