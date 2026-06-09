import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone: true
})
export class CustomPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // saca acentos
      .replace(/[^a-z0-9]+/g, '-')      // reemplaza especiales por -
      .replace(/^-|-$/g, '');           // saca guiones al inicio y final

  }
}
