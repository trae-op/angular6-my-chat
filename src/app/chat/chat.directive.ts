import {Directive, ElementRef, AfterContentChecked, Input} from '@angular/core';

@Directive({
  selector: '[appContainerMessages]'
})
export class ChatDirective implements AfterContentChecked {

  private prevCurrentValue = 0;

  constructor(private el: ElementRef) {}

  @Input() data: any;

  ngAfterContentChecked() {
    if (this.prevCurrentValue < this.data.length) {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    }
    this.prevCurrentValue = this.data.length;
  }

}
