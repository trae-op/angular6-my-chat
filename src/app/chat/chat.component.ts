import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import {LocalStorageService} from 'angular-2-local-storage';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatMenuTrigger} from '@angular/material/menu';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import _ from 'lodash';

import {ChatService} from './chat.service';

import { NotificationsModel } from './notifications.model';

import {NotificationPopupComponent} from './notification-popup/notification-popup.component';
import {PrivateDialoguesBottomSheetComponent} from './private-dialogues-bottom-sheet/private-dialogues-bottom-sheet.component';
import {PrivateDialoguesModel} from './privateDialogues.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  public chatForm: FormGroup;
  public searchMessagesForm: FormGroup;
  public messages = [];
  public searchQuery: string;
  public notificationList: NotificationsModel[] = [];
  public privateDialogues: PrivateDialoguesModel[] = [];
  public privateDialog: PrivateDialoguesModel;
  public activeSearchBar = false;
  private dataUpdate: { _id: string, index: number };
  private prevRouteParams: string;

  @ViewChild('message') messageField;
  @ViewChild('search') searchBarInput;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private localStorage: LocalStorageService,
              public dialog: MatDialog,
              private bottomSheet: MatBottomSheet,
              private route: ActivatedRoute,
              private router: Router) {}

  async ngOnInit() {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });

    this.searchMessagesForm = this.fb.group({
      search: ['', [Validators.required]]
    });



    if (this.idPrivateDialog()) {
      await this.getPrivateDialogById(this.idPrivateDialog())
        .then(response => this.privateDialog = response);

      this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .map(() => this.router.routerState.root)
        .subscribe(() => {
          if (this.idPrivateDialog() !== this.prevRouteParams) {
            this.getPrivateDialogById(this.idPrivateDialog())
              .then(response => {
                this.privateDialog = response;
                this.prevRouteParams = this.idPrivateDialog();
                this.getMessages();
              });
          }
        });
    }

    this.chatService.messagesSubject
      .subscribe(() => {
        this.getMessages();
        this.getNotifications();
        this.getPrivateDialogues();
      });

    this.getMessages();
    this.getNotifications();
    this.getPrivateDialogues();

    // this.trigger.menuOpened
    //   .subscribe(() => this.getPrivateDialogues());
  }

  public idPrivateDialog() {
    return this.route.snapshot.params.id;
  }

  public showSeatchBar() {
    this.activeSearchBar = true;
    this.searchBarInput.nativeElement.focus();
  }

  public openPrivateDialogues() {
    this.bottomSheet.open(PrivateDialoguesBottomSheetComponent,{
      data: {
        privateDialogs: this.privateDialogues,
        routeParams: this.route.snapshot.params
      }
    });
  }

  public openNotifications() {
    this.dialog.open(NotificationPopupComponent, {
      width: '350px',
      data: this.notificationList
    });
  }

  public async faceToFace(message) {
    const dataFilled = {
      type: 'face-to-face-invite',
      user: {
        name: this.getUser().name,
        email: this.getUser().email
      },
      interlocutor_email: message.creator_email
    };
    this.chatService.addNotification(dataFilled)
      .subscribe(response => {
        if (this.getUser().name === message.name) {
          this.notificationList.push(response);
        }
        this.chatService.openSnackBar(
          `You send invite for "${message.name}" user 
          and now "${message.name}" user should approved or denied your invite.
          After his any actions you get new notification.`,
          30000);
      });
  }

  public getNotifications() {
    this.chatService.getNotifications()
      .subscribe(response => this.notificationList = _.filter(response, {
        interlocutor_email: this.getUser().email
      }));
  }

  public existPrivateDialog(message) {
    return _.filter(this.privateDialogues, {
      users: [
        {
          name: message.name,
          email: message.creator_email
        }
      ]
    });
  }

  public getPrivateDialogues() {
    this.chatService.getPrivateDialogues()
      .subscribe(response => this.privateDialogues =  _.filter(response, {
        users: [
          {
            name: this.getUser().name,
            email: this.getUser().email
          }
        ]
      }));
  }

  public getPrivateDialogById(id: string): Promise<any> {
    return new Promise(resolve => {
      this.chatService.getPrivateDialogById(id)
        .subscribe(response => resolve(response));
    });

  }

  public getMessages() {
    this.chatService[this.idPrivateDialog() ? 'getPrivateMessages' : 'getMessages']()
      .subscribe(response => {
        this.messages = this.idPrivateDialog() ? _.filter(response, n => n.private_dialog_id === this.idPrivateDialog()) : response;
      });
  }

  public send() {
    const dataFilled = {
      name: this.getUser().name,
      ava: this.getUser().ava,
      private_dialog_id: this.idPrivateDialog(),
      message: this.chatForm.value.message,
      creator_email: this.getUser().email
    };

    if (this.dataUpdate) {
      this.chatService[this.idPrivateDialog() ? 'updatePrivateMessage' : 'updateMessage']({
        _id: this.dataUpdate._id, message: this.chatForm.value.message
      }).subscribe(response => {
          this.messages[this.dataUpdate.index] = response;
          this.dataUpdate = null;
        });
      return;
    }

    this.chatService[this.idPrivateDialog() ? 'addPrivateMessage' : 'addMessage'](dataFilled)
      .subscribe(response => this.messages.push(response));
  }

  public editMessage(data, index) {
    this.dataUpdate = { _id: data._id, index };
    this.chatForm.setValue({message: data.message});
  }

  public deleteMessage(id, index) {
    this.chatService[this.idPrivateDialog() ? 'deletePrivateMessage' : 'deleteMessage'](id)
      .subscribe(() => this.messages.splice(index, 1));
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
