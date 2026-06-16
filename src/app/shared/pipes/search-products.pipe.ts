import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../interfaces/products';

@Pipe({
  name: 'searchProducts',
  standalone: true,
})
export class SearchProductsPipe implements PipeTransform {
  transform(Products: Products[], value: string): Products[] {
    return Products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
  }
}
