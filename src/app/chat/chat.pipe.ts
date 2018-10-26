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
      const check = prop => data[prop].toLowerCase().indexOf(args) !== -1;
      return check('message') || check('creator_email') || check('created_at');
    });
  }

}
