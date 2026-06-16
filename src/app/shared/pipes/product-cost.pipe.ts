import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productCost',
  standalone: true
})
export class ProductCostPipe implements PipeTransform {

  transform(itemPrice:string , qty:string): number {
    return Number(itemPrice)*Number(qty) ;
  }
}


