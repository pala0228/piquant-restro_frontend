import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError, Subject, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { CartService } from 'src/app/home/restaurants/view-restaurant/cart.service';
import { environment } from 'src/environments/environment';
import { UpdateUserInfo } from '../store/actions/user-info.action';
import { StorageType } from '../user/user.constants';
import { UserService } from '../user/user.service';
import { LoginInput, LoginResponse, NewPasswordInfo, NewPasswordUpdateResponse, SignUpInput, SignUpResponse, VerificationInput, VerificationResponse } from './auth.model';

const BACKEND_URL = environment.apiUrl + "/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * @ignore
   */
  private AuthenticationStatus = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
    private store: Store<AppState>
  ) { }
  /**
   * Method to create user
   * @param user contains user data required
   */
  singupUser(user: SignUpInput): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(BACKEND_URL + "signup", user)
      .pipe(map((data) => data), catchError((error) => throwError(error)))
  }
  /**
   * Method to check user credentials and allow to login
   */
  loginUser(loginInput: LoginInput): LoginResponse | any {
    return this.http.post<LoginResponse>(BACKEND_URL + "login", loginInput)
      .pipe(map((data) => {
        if (data && data.response.token) {
          /**
           * Saving user token which can be accessable
           * throught out an application
           */
          this.userService.set(StorageType.USER_TOKEN, data.response);
          this.AuthenticationStatus.next(true);
          const user = {
            userId: data.response.user._id,
            email: data.response.user.email,
            password: data.response.user.password,
            firstName: data.response.user.firstName,
            lastName: data.response.user.lastName,
            userType: data.response.user.userType,
            DOB: data.response.user.DOB,
            contactNumber: data.response.user.contactNumber,
            address: data.response.user.address,
            restaurants: data.response.user.restaurants
          }
          /**
           * Dispatching user profile to store which can be accessable
           * through out an application
           */
          this.store.dispatch(new UpdateUserInfo(user));
          /**
           * Saving user access list which can be accessable
           * through out an application
           */
          this.userService.set(StorageType.USER_ACCESS, data.response.user.funcIds);
          /**
           * Returning response data received
           */
          return {
            response: data.response,
            status: data.status
          }
        }
        return false;
      }),
        // below code is to hit another API once login and token receiving successfull
        // switchMap((tokenAvailable) => {
        //   if (tokenAvailable) {
        //     return this.http.get('URL to get access matrix or some other API').pipe(
        //       map((data) => {
        //         if (data) {
        //           // logic to save data in user storage
        //           return true;
        //         }
        //         return false;
        //       }), catchError((error: any) => throwError(error)));
        //   } else {
        //     // token not available so return false directly.
        //     return of(false);
        //   }
        // }),
        catchError((error) => throwError(error)))
  }
  /**
   * Method to validate user credentials and send verification code
   */
  sendVerificationCode(verificationInput: VerificationInput): Observable<VerificationResponse> {
    return this.http.post<VerificationResponse>(BACKEND_URL + "forgot-password/verification-code", verificationInput)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * Metho to update new password in the database
   */
  updatePassword(updatedPasswordInfo: NewPasswordInfo): Observable<NewPasswordUpdateResponse> {
    return this.http.post<NewPasswordUpdateResponse>(BACKEND_URL + "update-password", updatedPasswordInfo)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * Method to logout user and clear all required data set up made at the time of logging in user
   */
  logoutUser(route: string = '') {
    if (this.isAuthenticated()) {
      this.userService.removeAll();
      this.cartService.removeAllItems();
      this.store.dispatch(new UpdateUserInfo(null));
      this.AuthenticationStatus.next(false);
      if (route) {
        this.router.navigate(['/', route]);
        return;
      }
      this.router.navigate(['/home'])
    }
  }
  /**
   * Method to return subject observable to check user authentication
   */
  getAuthStatusListener() {
    return this.AuthenticationStatus.asObservable();
  }
  /**
   * Method to check user is authenticated or not based on token availability
   */
  isAuthenticated() {
    return !!this.userService.get(StorageType.USER_TOKEN);
  }
}


