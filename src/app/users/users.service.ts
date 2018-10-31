import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import _ from 'lodash';

import { environment } from '../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UsersModel} from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient,
              private snackBar: MatSnackBar) { }

  public getUsers() {
    return this.httpClient.get<UsersModel[]>(`${this.configUrl()}/users`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private deleteById(id: string): Promise<any> {
    return new Promise(resolve => {
      this.httpClient.delete<{}>(`${this.configUrl()}/users/${id}`)
        .pipe(catchError(error => this.handleError(error)))
        .subscribe(response => resolve(response));
    });
  }

  private getMessages(): Promise<any> {
    return new Promise(resolve => {
      this.httpClient.get<any>(`${this.configUrl()}/messages`)
        .pipe(catchError(error => this.handleError(error)))
        .subscribe(response => resolve(response));
    });
  }

  public async deleteUser(user: UsersModel) {
    let messages;
    let message;
    await this.getMessages().then(response => {
      if (_.filter(response, {creator_email: user.email}).length) {
        messages = _.filter(response, {creator_email: user.email});
      }
    });
    if (messages) {
      return {
        deleted: false,
        message: `
            You can't delete "${user.name}" user because messages what was created by it that are available by dates:
              "${_.map(_.unionBy(messages, 'created_at'), 'created_at').join(', ')}".
              At first you should be remove all messages and retry delete user again
          `
      };
    }
    await this.deleteById(user._id)
      .then(() => message = 'User was deleted!');
    if (message) {
      return {
        deleted: true,
        message
      };
    }
    throw new Error('Something wrong!!!');
  }

  private configUrl() {
    return `${environment.host}/${environment.api}`;
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      this.openSnackBar(`An error occurred: ${error.error.message}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status},`,
        `body was:`, error.error);
      this.openSnackBar(
        `Backend returned code ${error.status}.
         The message: ${error.error.message}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
