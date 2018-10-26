import {Directive, ElementRef, AfterContentChecked} from '@angular/core';

@Directive({
  selector: '[appChat]'
})
export class ChatDirective implements AfterContentChecked {

  private prevCurrentValue = 0;

  constructor(private el: ElementRef) {}

  ngAfterContentChecked() {
    if (this.prevCurrentValue < this.el.nativeElement.scrollHeight) {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
      this.prevCurrentValue = this.el.nativeElement.scrollHeight;
    }
  }

}
