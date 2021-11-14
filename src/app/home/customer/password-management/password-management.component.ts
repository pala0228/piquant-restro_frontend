import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { SharedService } from 'src/app/shared/shared.service';
import { NewPasswordUpdateResponse } from '../../../core/auth/auth.model';
import { AuthService } from '../../../core/auth/auth.service';
import { UserInfo } from '../../../core/store/models/user-info.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-password-management',
  templateUrl: './password-management.component.html',
  styleUrls: ['./password-management.component.scss']
})
export class PasswordManagementComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * Form group to regiser all required form controls
   */
  passwordManagementForm: FormGroup;
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
    private authService: AuthService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    // Reactive from -- Registering all required form controls
    this.passwordManagementForm = new FormGroup({
      firstName: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      lastName: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      email: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.email]),
      password: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
      newPassword: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
      confirmPassword: new FormControl("", [Validators.required]),
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
    if (this.passwordManagementForm.invalid) {
      return;
    }
    // Basic inititalization required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';

    // required input to hit API for updating new password.
    const updatedPasswordInfo = {
      email: this.passwordManagementForm.get('email').value,
      newPassword: this.passwordManagementForm.get('newPassword').value
    }

    this.customerService.updatePassword(updatedPasswordInfo).subscribe((httpResponse: NewPasswordUpdateResponse) => {
      if (httpResponse.status.code === 200) {
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);
        setTimeout(() => {
          this.authService.logoutUser('login');
        }, 3000);
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
    this.passwordManagementForm.get('firstName').setValue(userInfo.firstName);
    this.passwordManagementForm.get('lastName').setValue(userInfo.lastName);
    this.passwordManagementForm.get('email').setValue(userInfo.email);
    this.passwordManagementForm.get('password').setValue(userInfo.password);
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
