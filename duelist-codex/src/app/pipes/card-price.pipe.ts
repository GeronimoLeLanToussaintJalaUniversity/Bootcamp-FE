import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardPrice',
})
export class CardPricePipe implements PipeTransform {
  transform(value: string | null | undefined, currencySymbol = '$'): string {
    const numericValue = value ? parseFloat(value) : NaN;

    if (isNaN(numericValue)) {
      return 'Sin cotización';
    }

    return `${currencySymbol}${numericValue.toFixed(2)}`;
  }
}
