import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeMessage'
})
export class TypeMessagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? true : false;
  }

}
