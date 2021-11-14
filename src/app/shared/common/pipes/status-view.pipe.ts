import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusView'
})
export class StatusViewPipe implements PipeTransform {

  transform(value: string): any {
    let string = (value !== null && typeof value !== 'undefined') ? value.trim() : value;
    switch (string) {
      case 'A': return 'Active';
      case 'D': return 'Inactive';
      case 'C': return 'Corporate';
      case 'P': return 'Personal';
      default: return string;
    }
  }
}
