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
  declarations: [ChatComponent, ChatDirective, ChatPipe]
})
export class ChatModule { }
