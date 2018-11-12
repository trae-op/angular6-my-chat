import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {Subject, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChatMessages } from './chat.model';
import { environment } from '../../environments/environment';
import {LocalStorageService} from 'angular-2-local-storage';
import {SocketService} from '../shared/socket/socket.service';
import {NotificationsModel} from './notifications.model';
import {PrivateDialoguesModel} from './privateDialogues.model';
import {PrivateMessagesModel} from './privateMessages.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messagesSubject: Subject<any>;

  constructor(private httpClient: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router,
              private localStorage: LocalStorageService,
              private socketService: SocketService
  ) {
    this.messagesSubject = <Subject<any>>socketService
      .connect()
      .pipe(
        map((response: any): any => response)
      );
  }

  public getMessages() {
    return this.httpClient.get<ChatMessages[]>(`${this.configUrl()}/messages`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public addMessage(data: any) {
    return this.httpClient.post<ChatMessages>(`${this.configUrl()}/messages`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public updateMessage(data: any) {
    return this.httpClient.put<ChatMessages>(`${this.configUrl()}/messages`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public deleteMessage(id: string) {
    return this.httpClient.delete<{}>(`${this.configUrl()}/messages/${id}`)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public getNotifications() {
    return this.httpClient.get<NotificationsModel[]>(`${this.configUrl()}/notifications`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public addNotification(data: any) {
    return this.httpClient.post<NotificationsModel>(`${this.configUrl()}/notifications`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public deleteNotification(id: string) {
    return this.httpClient.delete<{}>(`${this.configUrl()}/notifications/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public addPrivateDialog(data: any) {
    return this.httpClient.post<PrivateDialoguesModel>(`${this.configUrl()}/privateDialogues`, data)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public getPrivateDialogues() {
    return this.httpClient.get<PrivateDialoguesModel[]>(`${this.configUrl()}/privateDialogues`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public getPrivateDialogById(id: string) {
    return this.httpClient.get<PrivateDialoguesModel>(`${this.configUrl()}/privateDialogues/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public getPrivateMessages() {
    return this.httpClient.get<PrivateMessagesModel[]>(`${this.configUrl()}/privateMessages`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public addPrivateMessage(data: any) {
    return this.httpClient.post<PrivateMessagesModel>(`${this.configUrl()}/privateMessages`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public updatePrivateMessage(data: any) {
    return this.httpClient.put<PrivateMessagesModel>(`${this.configUrl()}/privateMessages`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public deletePrivateMessage(id: string) {
    return this.httpClient.delete<{}>(`${this.configUrl()}/privateMessages/${id}`)
      .pipe(
        map(response => {
          this.messagesSubject.next(true);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  public logout() {
    this.localStorage.remove('user');
    this.localStorage.remove('Authorization');
    this.router.navigate(['/']);
  }

  private configUrl() {
    return `${environment.host}/${environment.api}`;
  }

  public openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, 'Close', { duration });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      this.openSnackBar(`An error occurred: ${error.error.message}`, 5000);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status},`,
        `body was:`, error.error);
      this.openSnackBar(
        `Backend returned code ${error.status}.
         The message: ${error.error.message}`, 5000);
      if (error.status === 401) {
        this.logout();
      }
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
