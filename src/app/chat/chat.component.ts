import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import _ from 'lodash';

import {ChatService} from './chat.service';

import { ChatMessages } from './chat.model';
import {LocalStorageService} from 'angular-2-local-storage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public chatForm: FormGroup;
  public searchMessagesForm: FormGroup;
  public messages: ChatMessages[] = [];
  private dataUpdate: any = null;
  public searchQuery: string;

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private localStorage: LocalStorageService) { }


  ngOnInit() {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });

    this.searchMessagesForm = this.fb.group({
      search: ['', [Validators.required]]
    });

    this.chatService.messagesSubject
      .subscribe(() => this.getMessages());

    this.getMessages();
  }

  public getMessages() {
    this.chatService.getMessages()
      .subscribe(response => this.messages = response);
  }

  public logout() {
    this.chatService.logout();
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

  public send() {
    const dataFilled = {
      name: this.getUser().name,
      ava: this.getUser().ava,
      message: this.chatForm.value.message,
      creator_email: this.getUser().email
    };

    if (this.dataUpdate) {
      this.chatService.updateMessage({
        _id: this.dataUpdate._id, message: this.chatForm.value.message
      })
        .subscribe(response => {
          this.messages[this.dataUpdate.index] = response;
          this.dataUpdate = null;
        });
      return;
    }

    this.chatService.addMessage(dataFilled)
      .subscribe(response => this.messages.push(response));
  }

  public editMessage(data, index) {
    this.dataUpdate = {
      _id: data._id,
      index
    };
    this.chatForm.setValue({message: data.message});
  }

  public deleteMessage(id, index) {
    this.chatService.deleteMessage(id).subscribe(() => this.messages.splice(index, 1));
  }

}
