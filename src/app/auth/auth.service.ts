import { Injectable } from '@angular/core';;
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';
import {LocalStorageService} from 'angular-2-local-storage';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {AuthModel} from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private localStorage: LocalStorageService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  public register(data: any) {
    return this.httpClient.post<AuthModel>(`${this.configUrl()}/users`, data)
      .pipe(
        map(response => {
          this.localStorage.set('user', response.user);
          this.localStorage.set('Authorization', response.token);
          this.router.navigate(['/chat']);
          return response;
        }),
        catchError(error => this.handleError(error))
      );
  }

  private configUrl() {
    return `${environment.host}/${environment.api}`;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
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
