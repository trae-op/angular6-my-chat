import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsersGuard} from './users.guard';
import {UsersComponent} from './users.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [UsersGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UsersGuard]
})
export class UsersRoutingModule { }
