import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class ChatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || !args) {
      return value;
    }
    return value.filter(data => {
      return data.message.toLowerCase().indexOf(args) !== -1;
    });
  }

}
