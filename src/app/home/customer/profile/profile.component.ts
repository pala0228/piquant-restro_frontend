import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { UserInfo } from 'src/app/core/store/models/user-info.model';
import { SharedService } from 'src/app/shared/shared.service';
import { UserProfileUpdateResponse } from '../customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * Form group to register all required form controls
   */
  userProfile: FormGroup;
  /**
   * @ignore
   * toggleEye to switch between visibility and non visibility
   */
  toggleEye = false;
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen: boolean = false;
  /**
   * @ignore
   * Message to show on the infor screen component
   */
  message = '';
  /**
   * @ignore
   * Status to change message view(error/success/info/warning)
   */
  status = '';
  /**
   * @ignore
   */
  storeSubscription: Subscription;
  /**
   * @ignore
   * It holds logged in user info
   */
  user: UserInfo;

  constructor(
    private sharedService: SharedService,
    private store: Store<AppState>,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    // Reactive from -- Registering all required form controls
    this.userProfile = new FormGroup({
      firstName: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),

      ]),
      lastName: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      dob: new FormControl({ value: "", disabled: true }),
      email: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
      password: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
      contactNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9 ]+$/),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      address: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
    });
    // Subscribing store subscription to access user information saved
    this.storeSubscription = this.store.select('userInfo').subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loadUserData(this.user);
      }
    });
  }
  /**
   * @ignore
   */
  onSave() {
    if (this.userProfile.invalid) {
      return;
    }
    // Basic inititalization required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';

    // required input to hit API for updating new password.
    const userProfile = {
      userId: this.user.userId,
      contactNumber: this.userProfile.get('contactNumber').value,
      address: this.userProfile.get('address').value
    }

    this.customerService.updateUserProfile(userProfile).subscribe((httpResponse: UserProfileUpdateResponse) => {
      if (httpResponse.status.code === 200) {
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);
      }
    }, (error) => {
      if (error.error && error.error.status) {
        this.errorMessage(error.error.status.message);
      } else {
        this.errorMessage(null);
      }
    });
  }
  /**
   * @ignore
   * Method to display error message
   */
  private errorMessage(message) {
    this.sharedService.activatePartialLoader(false);
    this.showScreen = true;
    this.status = 'error';
    this.message = message;
  }
  /**
   * @ignore
   */
  private loadUserData(userInfo: UserInfo) {
    this.userProfile.get('firstName').setValue(userInfo.firstName);
    this.userProfile.get('lastName').setValue(userInfo.lastName);
    this.userProfile.get('dob').setValue(userInfo.DOB);
    this.userProfile.get('email').setValue(userInfo.email);
    this.userProfile.get('password').setValue(userInfo.password);
    this.userProfile.get('contactNumber').setValue(userInfo.contactNumber);
    this.userProfile.get('address').setValue(userInfo.address);
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

}
