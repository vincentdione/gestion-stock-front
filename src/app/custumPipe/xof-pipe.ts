import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xof'
})
export class XofPipe implements PipeTransform {
  transform(value: number): string {
    // Formatez la valeur en XOF avec un point comme séparateur décimal
    return value.toFixed(2).replace(',', '.').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
