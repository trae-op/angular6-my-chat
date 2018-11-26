import {Directive, ElementRef, AfterContentChecked, HostListener} from '@angular/core';
import {ChatService} from './chat.service';
import {ActivatedRoute} from '@angular/router';
import _ from 'lodash';
import {MessagesService} from './messages/messages.service';
import {PrivateMessagesService} from './private-messages/private-messages.service';
import {Observable, timer} from 'rxjs';

@Directive({
  selector: '[appContainerMessages]'
})
export class ChatDirective implements AfterContentChecked {

  private prevCurrentValue = 0;
  private initPointX: number;
  private prevRouteParam: string;
  private prevMessages = [];
  private timerScroll: Observable<any> = timer(1000);
  private controlRequestScroll = this.chatService.controlRequestScroll;

  constructor(
    private el: ElementRef,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private privateMessagesService: PrivateMessagesService) {}


  @HostListener('mousewheel', ['$event'])
  public scroll(event: any) {
    let wheelDeltaTop = false;
    let checkLimit = false;
    const wheelDelta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    const checkPrivateMessages = this.idPrivateDialog() ? 'privateMessagesService' : 'messagesService';
    const checkMessagesByLimit = this.idPrivateDialog() ? 'getPrivateMessagesByLimit' : 'getMessagesByLimit';

    this.controlRequestScroll.scroll = true;

    if (wheelDelta > 0) {
      wheelDeltaTop = true;
    }

    if (wheelDeltaTop && this.el.nativeElement.scrollTop <= 0 && this.controlRequestScroll.limitActive) {
      this.controlRequestScroll.limitActive = false;
      checkLimit = true;
    }

    if (checkLimit) {
      this.timerPromise()
        .then(() => {
          this.controlRequestScroll.limit = this.chatService.allMessages.length + this.controlRequestScroll.limitDefault;
        })
        .then(() => {
          this[checkPrivateMessages][checkMessagesByLimit](0, this.chatService.currentRouteId)
            .subscribe(response => {
              const filter = _.filter(response, n => n.private_dialog_id === this.idPrivateDialog());
              const responseLimit = this.idPrivateDialog() ? filter : response;

              this.chatService.allMessages = responseLimit;

              if (response.length === this.prevMessages.length) {
                return;
              }

              this.prevMessages = response;
              this.controlRequestScroll.limitActive = true;
              this.prevRouteParam = this.chatService.currentRouteId;
            });
        });
    }

    this.initPointX = event.pageX;
  }

  private timerPromise(): Promise<any> {
    return new Promise(resolve => this.timerScroll
      .subscribe(() => resolve(true)));
  }

  public idPrivateDialog() {
    return this.route.snapshot.params.id;
  }

  ngAfterContentChecked() {
    if (this.prevCurrentValue < this.chatService.allMessages.length && !this.controlRequestScroll.scroll) {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    }
    this.prevCurrentValue = this.chatService.allMessages.length;
  }

}
