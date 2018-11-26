import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ChatService} from '../chat.service';
import {PrivateMessagesService} from './private-messages.service';
import {NotificationsModel} from '../notifications.model';
import {PrivateDialoguesModel} from '../privateDialogues.model';
import {NotificationPopupComponent} from '../notification-popup/notification-popup.component';
import {PrivateDialoguesBottomSheetComponent} from '../private-dialogues-bottom-sheet/private-dialogues-bottom-sheet.component';
import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html'
})
export class PrivateMessagesComponent implements OnInit, OnDestroy {

  public chatForm: FormGroup;
  public searchMessagesForm: FormGroup;
  public searchQuery: string;
  public notificationList: NotificationsModel[] = [];
  public privateDialog: PrivateDialoguesModel;
  public activeSearchBar = false;
  private dataUpdate: { _id: string, index: number };
  private routeParamsChangesById: string;

  private routerNavigation;


  @ViewChild('search') searchBarInput;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private privateMessagesService: PrivateMessagesService,
              private localStorage: LocalStorageService,
              public dialog: MatDialog,
              private bottomSheet: MatBottomSheet,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });

    this.searchMessagesForm = this.fb.group({
      search: ['', [Validators.required]]
    });

    this.routerNavigation = this.router.events
      .filter(event => event instanceof ActivationEnd)
      .subscribe((data: any) => {
        if (data.snapshot.params.id) {
          this.routeParamsChangesById = data.snapshot.params.id;
          this.chatService.currentRouteId = data.snapshot.params.id;
          this.chatService.controlRequestScroll.limitActive = true;
          this.chatService.controlRequestScroll.limit = this.chatService.controlRequestScroll.limitDefault;
          this.getMessages();
        }
      });

    this.chatService.controlRequestScroll.limit = this.chatService.controlRequestScroll.limitDefault;
    this.chatService.controlRequestScroll.limitActive = true;
    this.chatService.currentRouteId = this.route.snapshot.params.id;

    this.trigger.menuOpened
      .subscribe(() => this.getPrivateDialogues());

    this.getMessages();
    this.getNotifications();
    this.getPrivateDialogues();
  }

  ngOnDestroy() {
    if (this.routerNavigation) {
      this.routerNavigation.unsubscribe();
    }
  }

  public noComments() {
    return this.chatService.lackOfComment;
  }

  public idPrivateDialog() {
    return this.route.snapshot.params.id;
  }

  public showSearchBar() {
    this.activeSearchBar = true;
    this.searchBarInput.nativeElement.focus();
  }

  public openPrivateDialogues() {
    this.bottomSheet.open(PrivateDialoguesBottomSheetComponent,{
      data: {
        privateDialogs: this.privateDialogues(),
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


  public getNotifications() {
    this.chatService.getNotifications()
      .subscribe(response => this.notificationList = _.filter(response, {
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

  public messages() {
    return _.filter(this.chatService.allMessages, message => message.private_dialog_id);
  }

  public getMessages() {
    this.privateMessagesService.getPrivateMessagesByLimit(0, this.routeParamsChangesById || this.idPrivateDialog())
      .subscribe(response => {
        this.chatService.lackOfComment = !response.length ? true : false;
        this.chatService.allMessages = response;
      });
  }

  public send() {
    const dataFilled = {
      name: this.getUser().name,
      ava: this.getUser().ava,
      private_dialog_id: this.idPrivateDialog(),
      message: this.chatForm.value.message,
      creator_email: this.getUser().email,
      created_at: new Date()
    };

    if (this.dataUpdate) {
      this.privateMessagesService.updatePrivateMessage({
        _id: this.dataUpdate._id, message: this.chatForm.value.message
      }, this.dataUpdate.index).subscribe(() => this.dataUpdate = null);
      return;
    }

    this.privateMessagesService.addPrivateMessage(dataFilled)
      .subscribe(() => this.chatService.controlRequestScroll.scroll = false);
  }

  public editMessage(data, index) {
    this.dataUpdate = { _id: data._id, index };
    this.chatForm.setValue({message: data.message});
  }

  public deleteMessage(id, index) {
    this.privateMessagesService.deletePrivateMessage(id, index)
      .subscribe(() => console.log('message removed!'));
  }

  public logout() {
    this.chatService.logout();
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

}
