import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatGuard} from './chat.guard';
import {MessagesComponent} from './messages/messages.component';
import {PrivateMessagesComponent} from './private-messages/private-messages.component';

const routes: Routes = [
  {
    path: 'chat',
    component: MessagesComponent,
    canActivate: [ChatGuard]
  },
  {
    path: 'chat/private_dialog/:id',
    component: PrivateMessagesComponent,
    canActivate: [ChatGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ChatGuard]
})
export class ChatRoutingModule { }
