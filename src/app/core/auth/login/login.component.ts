import { Component, OnDestroy, OnInit } from "@angular/core";
import { IMAGES } from "src/app/shared/common/constants";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from '../auth.service';
import { LoginInput, LoginResponse } from '../auth.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * background image accessing dynamically.
   */
  backgroundImage = IMAGES.background;
  /**
   * @ignore
   * FormGroup to register all required form controls
   */
  loginForm: FormGroup;
  /**
   * @ignore
   * Flag to switch between visibility and non visibility cases
   */
  toggleEye = false;
  /**
   * @ignore
   * Object to hold input data for logging user
   */
  loginInput: LoginInput;
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // Reactive form to register required form controls
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.email]),
      password: new FormControl("", [
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
    });
  }
  /**
   * @ignore
   * Method to open dialog model for resetting password.
   */
  onClickForgotPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '600px',
      height: 'fit-content',
      data: {}
    }).afterClosed().subscribe(result => {
      if (result.action === 'success') {
        // TODO: logic to be included after successfully reset password is finished.
      }
    });
  }
  /**
   * @ignore
   * Method to check user credentials with back end database.
   */
  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    // required input data to hit API
    this.loginInput = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.loginUser(this.loginInput).subscribe((httpResponse: LoginResponse) => {
      if (httpResponse.status.code === 200) {
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);
        // Navigate to restaurants component
        this.router.navigate(['/restaurants']);
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
   * Method to reset login form form controls
   */
  onClear() {
    // Hide info component if activated
    if (this.showScreen) {
      this.showScreen = !this.showScreen;
      this.status = null;
      this.message = null;
    }

    this.loginForm.reset();
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
  /**
   * @ignore
   * method to destroy all emailSubscription to be unsubscribed before leaving component
   */
  ngOnDestroy() {
  }
}
