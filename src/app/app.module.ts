import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';

import {LoginModule} from './login/login.module';
import {AuthModule} from './auth/auth.module';
import {ChatModule} from './chat/chat.module';
import {UsersModule} from './users/users.module';
import {PageNotFoundModule} from './page-not-found/page-not-found.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'app-my-chat',
      storageType: 'localStorage'
    }),
    RouterModule.forRoot([
      { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
    ]),
    LoginModule,
    AuthModule,
    ChatModule,
    UsersModule,
    PageNotFoundModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
