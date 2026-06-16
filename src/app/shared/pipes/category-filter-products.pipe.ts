import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products';

@Pipe({
  name: 'categoryFilterProducts',
  standalone: true,
})
export class CategoryFilterProductsPipe implements PipeTransform {
  transform(products: Products[], selectedCategories: string[]): Products[] {
    if (!selectedCategories || selectedCategories.length === 0) {
      return products;
    }

    return products.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }
}
