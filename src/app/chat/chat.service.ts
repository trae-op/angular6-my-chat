import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {Subject, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {LocalStorageService} from 'angular-2-local-storage';
import {SocketService} from '../shared/socket/socket.service';
import {NotificationsModel} from './notifications.model';
import {PrivateDialoguesModel} from './privateDialogues.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messagesSubject: Subject<any>;
  public allMessages = [];
  public allNotifications: NotificationsModel[] = [];
  public allPrivateDialogues: PrivateDialoguesModel[] = [];
  public currentRouteId: any;
  public lackOfComment: boolean;

  // options request by scroll
  public controlRequestScroll = {
    limitDefault: 20,
    scroll: false,
    limit: 20,
    limitActive: false
  };

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

    this.messagesSubject.subscribe(data => {
      const jsonData = JSON.parse(data);
      switch (jsonData.type) {
        case 'message':
            this.allMessages.push(jsonData.data);
            this.lackOfComment = false;
          break;
        case 'update-message':
            this.allMessages[jsonData.index] = jsonData.data;
          break;
        case 'delete-message':
            this.allMessages.splice(jsonData.index, 1);
            this.lackOfComment = !this.allMessages.length ? true : false;
          break;
        case 'notification':
            if (this.getUser().name === jsonData.interlocutorName) {
              this.allNotifications.push(jsonData.data);
            }
          break;
        default:
          return;
      }
    });
  }

  public getNotifications() {
    return this.httpClient.get<NotificationsModel[]>(`${this.configUrl()}/notifications`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  public addNotification(data: any, interlocutor: any) {
    return this.httpClient.post<NotificationsModel>(`${this.configUrl()}/notifications`, data)
      .pipe(
        map(response => {
          this.messagesSubject.next({
            type: 'notification',
            interlocutorName: interlocutor.name,
            data: response
          });
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

  public logout() {
    this.localStorage.remove('user');
    this.localStorage.remove('Authorization');
    this.router.navigate(['/']);
  }

  public configUrl() {
    return `${environment.host}/${environment.api}`;
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

  public openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, 'Close', { duration });
  }

  public handleError(error: HttpErrorResponse) {
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
