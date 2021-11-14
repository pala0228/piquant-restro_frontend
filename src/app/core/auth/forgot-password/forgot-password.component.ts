import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import TimeCalculator from 'src/app/shared/common/util/time-calculations';
import { SharedService } from 'src/app/shared/shared.service';
import { NewPasswordInfo, NewPasswordUpdateResponse, VerificationData, VerificationInput } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  /**
   * @ignore
   * FormGroup to register all required form controls
   */
  forgotPasswordForm: FormGroup;
  /**
   * @ignore
   * toggleEye to switch between visibility and non visibility
   */
  toggleEye = false;
  /**
   * @ignore
   * Flag to show and hide fields based on user interaction
   */
  sendCode = false;
  /**
   * @ignore
   * Flag to activate resend verification logic back if user did not receive code
   */
  resendCode = false;
  /**
   * @ignore
   * Flag to activate fields based on user receiving code successfully
   */
  verifiedCode = false;
  /**
   * @ignore
   * Object to hold required input values to hit back end API to veify user data and send verification code
   */
  verificationInput: VerificationInput;
  /**
   * @ignore
   * Object to hold verification code sent to user mobile number
   */
  private verificationData: VerificationData;
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen = false;
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
   * To show time in minutes and seconds
   */
  display = '';
  /**
   * @ignore
   * Observable to stop timer if verification code is successfully verified
   */
  destroy = new Subject();
  /**
   * @ignore
   * Object to hold required information to update new password.
   */
  updatedPasswordInfo: NewPasswordInfo;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    // Reactive form - registering all required controls
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
      confirmPassword: new FormControl("", [Validators.required]),
      contactNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9 ]+$/),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      mobileCode: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9 ]+$/),
        Validators.maxLength(6),
        Validators.minLength(6),
      ])
    });
  }
  /**
   * @ignore
   * Method to verifiy user data and send verification code
   */
  onClickSendCode() {
    // Basic inititalization required
    this.verifiedCode = false;
    this.sendCode = false;
    this.showScreen = false;
    this.message = '';
    this.sharedService.activatePartialLoader(true);

    // Input required to hit back end API to send verification code
    this.verificationInput = {
      email: this.forgotPasswordForm.get('email').value,
      contactNumber: this.forgotPasswordForm.get('contactNumber').value
    }

    this.authService.sendVerificationCode(this.verificationInput).subscribe((httpResponse) => {
      if (httpResponse.status.code === 200) {
        this.verificationData = httpResponse.response.verificationData;
        this.sendCode = !this.sendCode;
        this.forgotPasswordForm.get('mobileCode').reset();
        // show timer for 2 minutes to resend verification code if user has not received it
        this.startTimer();

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
   * Method to display timer with lenght of 2 minutes
   */
  startTimer() {
    let fromDate = new Date();
    // Adding 2 minutes of time extra to current time
    fromDate.setMinutes(fromDate.getMinutes() + 2);

    fromDate.setSeconds(fromDate.getSeconds() + 1);
    /**
     * timer rxjs operator to execute at every interval(passed in value).
     * here at every 1 second with delay of 0 seconds it starts executes
     */
    timer(0, 1000).pipe(
      takeUntil(this.destroy),
    ).subscribe(seconds => {
      // Method to return time in minutes and seconds left at every second from given current time.
      this.display = TimeCalculator.minutesAndSecondsCounter(fromDate);
      // If 2 minutes are over then stop timer and activate resend code logic
      if (seconds >= 120) {
        this.resendCode = true;
        this.sendCode = false;
        this.display = '';
        // trigger destroy subject to stop timer
        this.destroy.next();
      }
    });
  }
  /**
   * @ignore
   * Method to verify verification code sent and destroy timer if submitted within 2 minutes of time
   */
  onClickVerifyCode() {
    let enteredCode: number = +this.forgotPasswordForm.get('mobileCode').value;

    if (enteredCode === this.verificationData.verificationCode) {
      // trigger destroy subject to stop time if user entered code is matched to store one in db.
      this.destroy.next();
      this.display = '';
      this.verifiedCode = !this.verifiedCode;
      this.forgotPasswordForm.get('email').disable();
      this.forgotPasswordForm.get('contactNumber').disable();
      this.forgotPasswordForm.get('mobileCode').disable();
    } else {
      this.forgotPasswordForm.get('mobileCode').setErrors({ doesNotMatch: true });
      this.verifiedCode = !!this.verifiedCode;
    }
  }
  /**
   * @ignore
   * Method to reset form to normal status back
   */
  onClear() {
    // Hide info component if activated
    if (this.showScreen) {
      this.showScreen = !this.showScreen;
      this.status = null;
      this.message = null;
    }

    this.forgotPasswordForm.enable();
    this.forgotPasswordForm.clearValidators();
    this.forgotPasswordForm.reset();
    this.sendCode = false;
    this.verifiedCode = false;
  }
  /**
   * @ignore
   * Method to close dialog model
   */
  onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }
  /**
   * @ignore
   * Method to update new password.
   */
  onUpdate() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    // Basic inititalization required
    this.showScreen = false;
    this.message = '';
    this.sharedService.activatePartialLoader(true);

    // required input to hit API for updating new password.
    this.updatedPasswordInfo = {
      email: this.forgotPasswordForm.get('email').value,
      newPassword: this.forgotPasswordForm.get('password').value
    }

    this.authService.updatePassword(this.updatedPasswordInfo).subscribe((httpResponse: NewPasswordUpdateResponse) => {
      if (httpResponse.status.code === 200) {
        this.sharedService.activatePartialLoader(false);
        this.dialogRef.close({ action: 'success' });

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
    this.showScreen = true;
    this.status = 'error';
    this.message = message;
    this.sharedService.activatePartialLoader(false);
  }
}
