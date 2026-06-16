import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converttonumber',
  standalone:true
})
export class ConverttonumberPipe implements PipeTransform {

  transform(value: string): number {
    return Math.round(parseFloat(value));
  }

}
