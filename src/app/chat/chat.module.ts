import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { ChatRoutingModule } from './chat-routing.module';
import {SharedModule} from '../shared/shared.module';

import {ChatService} from './chat.service';
import { ChatDirective } from './chat.directive';
import { ChatPipe } from './chat.pipe';
import {NotificationPopupComponent} from './notification-popup/notification-popup.component';
import {PrivateDialoguesBottomSheetComponent} from './private-dialogues-bottom-sheet/private-dialogues-bottom-sheet.component';
import {MessagesComponent} from './messages/messages.component';
import {PrivateMessagesComponent} from './private-messages/private-messages.component';
import {MessagesService} from './messages/messages.service';
import {PrivateMessagesService} from './private-messages/private-messages.service';
import { TypeMessagePipe } from './type-message.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChatRoutingModule,
    SharedModule
  ],
  providers: [
    ChatService,
    MessagesService,
    PrivateMessagesService
  ],
  entryComponents: [
    NotificationPopupComponent,
    PrivateDialoguesBottomSheetComponent
  ],
  declarations: [
    MessagesComponent,
    PrivateMessagesComponent,
    ChatDirective,
    ChatPipe,
    NotificationPopupComponent,
    PrivateDialoguesBottomSheetComponent,
    TypeMessagePipe
  ]
})
export class ChatModule { }
