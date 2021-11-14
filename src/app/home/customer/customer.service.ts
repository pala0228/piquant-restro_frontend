import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { NewPasswordInfo, NewPasswordUpdateResponse } from 'src/app/core/auth/auth.model';
import { UpdateUserInfo } from 'src/app/core/store/actions/user-info.action';
import { environment } from 'src/environments/environment';
import { UserProfile, UserProfileUpdateResponse } from './customer.model';

const BACKEND_URL = environment.apiUrl + "/customer/";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

  /**
   * Method to update user profile and update store with updated user data.
   */
  updateUserProfile(userProfile: UserProfile): UserProfileUpdateResponse | any {
    return this.http.post<UserProfileUpdateResponse | any>(BACKEND_URL + "update-profile", userProfile)
      .pipe(map((data) => {
        if (data && data.response.user) {
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
          // updating user data to store
          this.store.dispatch(new UpdateUserInfo(user));
        }
        return {
          response: data.response,
          status: data.status
        }
      }), catchError((error) => throwError(error)))
  }
  /**
   * Metho to update new password in the database
   */
  updatePassword(updatedPasswordInfo: NewPasswordInfo): Observable<NewPasswordUpdateResponse> {
    return this.http.post<NewPasswordUpdateResponse>(BACKEND_URL + "update-password", updatedPasswordInfo)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
}
