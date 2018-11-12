import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { ChatRoutingModule } from './chat-routing.module';
import {SharedModule} from '../shared/shared.module';

import {ChatComponent} from './chat.component';

import {ChatService} from './chat.service';
import { ChatDirective } from './chat.directive';
import { ChatPipe } from './chat.pipe';
import {NotificationPopupComponent} from './notification-popup/notification-popup.component';
import {PrivateDialoguesBottomSheetComponent} from './private-dialogues-bottom-sheet/private-dialogues-bottom-sheet.component';

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
    ChatService
  ],
  entryComponents: [
    NotificationPopupComponent,
    PrivateDialoguesBottomSheetComponent
  ],
  declarations: [
    ChatComponent,
    ChatDirective,
    ChatPipe,
    NotificationPopupComponent,
    PrivateDialoguesBottomSheetComponent
  ]
})
export class ChatModule { }
