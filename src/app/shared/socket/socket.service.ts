import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io(environment.host);
    const observable = new Observable(observer => {
      this.socket.on('UpdateMessage', (data) => {
        console.log('Received message from WebSocket Server')
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    const observer = {
      next: (data: Object) => {
        this.socket.emit('NewMessage', JSON.stringify(data));
      },
    };
    return Rx.Subject.create(observer, observable);
  }

 }
