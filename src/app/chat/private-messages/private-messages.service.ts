import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PrivateMessagesModel} from './privateMessages.model';
import {catchError, map} from 'rxjs/operators';
import {ChatService} from '../chat.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessagesService {

  constructor(private httpClient: HttpClient,
              private chatService: ChatService) { }

  public getPrivateMessagesByLimit(n: number, id: string) {
    return this.httpClient.get<PrivateMessagesModel[]>(`
      ${this.chatService.configUrl()}/privateMessages/${n}/${this.chatService.controlRequestScroll.limit}/${id}
    `)
      .pipe(
        catchError(error => this.chatService.handleError(error))
      );
  }

  public getPrivateMessages() {
    return this.httpClient.get<PrivateMessagesModel[]>(`${this.chatService.configUrl()}/privateMessages`)
      .pipe(
        catchError(error => this.chatService.handleError(error))
      );
  }

  public addPrivateMessage(data: any) {
    return this.httpClient.post<PrivateMessagesModel>(`${this.chatService.configUrl()}/privateMessages`, data)
      .pipe(
        map(response => {
          this.chatService.messagesSubject.next({
            type: 'message',
            data: response
          });
          return response;
        }),
        catchError(error => this.chatService.handleError(error))
      );
  }

  public updatePrivateMessage(data: any, index: number) {
    return this.httpClient.put<PrivateMessagesModel>(`${this.chatService.configUrl()}/privateMessages`, data)
      .pipe(
        map(response => {
          this.chatService.messagesSubject.next({
            type: 'update-message',
            index,
            data: response
          });
          return response;
        }),
        catchError(error => this.chatService.handleError(error))
      );
  }

  public deletePrivateMessage(id: string, index: number) {
    return this.httpClient.delete<{}>(`${this.chatService.configUrl()}/privateMessages/${id}`)
      .pipe(
        map(response => {
          this.chatService.messagesSubject.next({
            type: 'delete-message',
            index
          });
          return response;
        }),
        catchError(error => this.chatService.handleError(error))
      );
  }
}
