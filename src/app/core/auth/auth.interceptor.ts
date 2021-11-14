import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageType } from '../user/user.constants';
import { UserToken } from '../user/user.model';
import { UserService } from '../user/user.service';
import { SessionExpiryComponent } from './session-expiry/session-expiry.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private dialog: MatDialog) { }

  /**
   * @ignore
   * Method to add authorization token to every http request being sent
   * to back end server.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let authRequest = request;
    const userToken: UserToken = this.userService.get(StorageType.USER_TOKEN);
    // we can edit url by clone method of request
    // let clonedRequest;
    // if (request.url.startsWith('iserve/')) {
    //   clonedRequest = request.clone({
    //     url: `api/isrg/${request.url}`
    //   });
    // }
    if (userToken.token && request.url !== '/login') {
      authRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + userToken.token)
      })
    }
    return next.handle(authRequest).pipe(catchError(x => this.handleAuthError(x)));
  }
  /**
   * @ignore
   * we handle specific errors like if user is logged in more than one device
   * we can get show pop up and not allow user to navigate based on error code
   * we receive from back end we can valiadate here.
   */
  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 409) {
      this.dialog.open(SessionExpiryComponent, {
        data: null,
        disableClose: true,
        width: '37.3rem'
      });
    }
    return throwError(error)
  }
}
