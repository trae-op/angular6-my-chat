import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './chat.component';
import {ChatGuard} from './chat.guard';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [ChatGuard]
  },
  {
    path: 'chat/private_dialog/:id',
    component: ChatComponent,
    canActivate: [ChatGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ChatGuard]
})
export class ChatRoutingModule { }
