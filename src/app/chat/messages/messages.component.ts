import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from './messages.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ChatService} from '../chat.service';
import {NotificationsModel} from '../notifications.model';
import {PrivateDialoguesModel} from '../privateDialogues.model';
import {NotificationPopupComponent} from '../notification-popup/notification-popup.component';
import {PrivateDialoguesBottomSheetComponent} from '../private-dialogues-bottom-sheet/private-dialogues-bottom-sheet.component';
import {ChatMessages} from './messages.model';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {

  public chatForm: FormGroup;
  public searchMessagesForm: FormGroup;
  public searchQuery: string;
  public privateDialog: PrivateDialoguesModel;
  public activeSearchBar = false;
  private dataUpdate: { _id: string, index: number };

  @ViewChild('message') messageField;
  @ViewChild('search') searchBarInput;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private messagesService: MessagesService,
              private localStorage: LocalStorageService,
              public dialog: MatDialog,
              private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });

    this.searchMessagesForm = this.fb.group({
      search: ['', [Validators.required]]
    });

    this.chatService.currentRouteId = false;
    this.chatService.controlRequestScroll.limit = this.chatService.controlRequestScroll.limitDefault;
    this.chatService.controlRequestScroll.limitActive = true;

    this.trigger.menuOpened
      .subscribe(() => this.getPrivateDialogues());

    this.getMessages();
    this.getNotifications();
    this.getPrivateDialogues();

  }

  public noComments() {
    return this.chatService.lackOfComment;
  }

  public showSearchBar() {
    this.activeSearchBar = true;
    this.searchBarInput.nativeElement.focus();
  }

  public openPrivateDialogues() {
    this.bottomSheet.open(PrivateDialoguesBottomSheetComponent,{
      data: {
        privateDialogs: this.privateDialogues(),
        routeParams: false
      }
    });
  }

  public openNotifications() {
    this.dialog.open(NotificationPopupComponent, {
      width: '350px',
      data: this.notificationList()
    });
  }

  public faceToFace(message) {
    const dataFilled = {
      type: 'face-to-face-invite',
      user: {
        name: this.getUser().name,
        email: this.getUser().email
      },
      interlocutor_email: message.creator_email,
      created_at: new Date()
    };

    this.chatService.addNotification(dataFilled, message)
      .subscribe(() => {
        this.chatService.openSnackBar(
          `You sent invite for "${message.name}" user 
          and now "${message.name}" user should approved or denied your invite.
          After his any actions you get new notification.`,
          30000);
      });
  }

  public notificationList(): NotificationsModel[] {
    return this.chatService.allNotifications;
  }


  public getNotifications() {
    this.chatService.getNotifications()
      .subscribe(response => this.chatService.allNotifications = _.filter(response, {
        interlocutor_email: this.getUser().email
      }));
  }

  public existPrivateDialog(message) {
    return _.filter(this.privateDialogues(), n => {
      return n.interlocutor.email === message.creator_email || n.sender.email === message.creator_email;
    });
  }

  public privateDialogues(): PrivateDialoguesModel[] {
    return this.chatService.allPrivateDialogues;
  }

  public getPrivateDialogues() {
    this.chatService.getPrivateDialogues()
      .subscribe(response => {
        this.chatService.allPrivateDialogues =  _.filter(response, (n) => {
          return n.interlocutor.email === this.getUser().email || n.sender.email === this.getUser().email;
        });
      });
  }

  public messages(): ChatMessages[] {
    return _.filter(this.chatService.allMessages, message => !message.private_dialog_id);
  }

  public getMessages() {
    this.messagesService.getMessagesByLimit(0)
      .subscribe(response => {
        this.chatService.lackOfComment = !response.length ? true : false;
        this.chatService.allMessages = response;
      });
  }

  public send() {
    const dataFilled = {
      name: this.getUser().name,
      ava: this.getUser().ava,
      message: this.chatForm.value.message,
      creator_email: this.getUser().email,
      created_at: new Date()
    };

    if (this.dataUpdate) {
      this.messagesService.updateMessage({
        _id: this.dataUpdate._id, message: this.chatForm.value.message
      }, this.dataUpdate.index).subscribe(() => this.dataUpdate = null);
      return;
    }

    this.messagesService.addMessage(dataFilled)
      .subscribe(() => this.chatService.controlRequestScroll.scroll = false);
  }

  public editMessage(data, index) {
    this.dataUpdate = { _id: data._id, index };
    this.chatForm.setValue({message: data.message});
  }

  public deleteMessage(id, index) {
    this.messagesService.deleteMessage(id, index)
      .subscribe(() => console.log('message removed!'));
  }

  public logout() {
    this.chatService.logout();
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

  public reply(name: string) {
    this.chatForm.setValue({
      message: `${name}, `
    });
    this.messageField.nativeElement.focus();
  }
}
