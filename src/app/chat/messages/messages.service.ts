import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ChatMessages} from './messages.model';
import {catchError, map} from 'rxjs/operators';
import {ChatService} from '../chat.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private httpClient: HttpClient,
              private chatService: ChatService) { }

  public getMessages() {
    return this.httpClient.get<ChatMessages[]>(`${this.chatService.configUrl()}/messages`)
      .pipe(
        catchError(error => this.chatService.handleError(error))
      );
  }

  public getMessagesByLimit(n: number) {
    return this.httpClient.get<ChatMessages[]>(`
        ${this.chatService.configUrl()}/messages/${n}/${this.chatService.controlRequestScroll.limit}
      `)
      .pipe(
        catchError(error => this.chatService.handleError(error))
      );
  }

  public addMessage(data: any) {
    return this.httpClient.post<ChatMessages>(`${this.chatService.configUrl()}/messages`, data)
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

  public updateMessage(data: any, index: number) {
    return this.httpClient.put<ChatMessages>(`${this.chatService.configUrl()}/messages`, data)
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

  public deleteMessage(id: string, index: number) {
    return this.httpClient.delete<{}>(`${this.chatService.configUrl()}/messages/${id}`)
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
