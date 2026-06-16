import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reviewPrecentage',
  standalone: true
})
export class ReviewPrecentagePipe implements PipeTransform {

  transform(minNum: number, maxNum:number):any {
    return (minNum/maxNum*100) + '%' ;
  }

}
