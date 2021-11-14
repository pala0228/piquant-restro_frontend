import { Component, OnInit } from "@angular/core";
import { IMAGES } from "src/app/shared/common/constants";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SignUpInput, SignUpResponse } from '../auth.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { USER_TYPES } from './signup.constants';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  /**
   * @ignore
   * background image accessing dynamically.
   */
  backgroundImage = IMAGES.background;
  /**
   * @ignore
   * signupForm to hold all required controls
   */
  signupForm: FormGroup;
  /**
   * @ignore
   * toggleEye to switch between visibility and non visibility
   */
  toggleEye = false;
  /**
   * @ignore
   * user to hold all required info about singing up user
   */
  signUpInput: SignUpInput;
  /**
   * @ignore
   * Object to show tooptip information for user types
   */
  userTooltip: string;
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // Reactive from -- Registering all required form controls
    this.signupForm = new FormGroup({
      firstName: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      ]),
      userType: new FormControl("", [Validators.required]),
      dob: new FormControl("", [Validators.required]),
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
      address: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
    });
  }
  /**
   * @ignore
   * Method to reset form back to normal mode
   */
  onClear() {
    // Hide info component if activated
    if (this.showScreen) {
      this.showScreen = !this.showScreen;
      this.status = null;
      this.message = null;
    }

    this.signupForm.reset();
  }
  /**
   * @ignore
   * Method to sign up user newly.
   */
  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    // required input for signup
    this.signUpInput = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      userType: this.signupForm.value.userType,
      DOB: this.signupForm.value.dob ? this.signupForm.value.dob.toISOString() : '',
      contactNumber: this.signupForm.value.contactNumber,
      address: this.signupForm.value.address,
      restaurants: []
    }

    this.authService.singupUser(this.signUpInput).subscribe((httpResponse: SignUpResponse) => {
      if (httpResponse.status.code === 201) {
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);
        // Navigating user to login page.
        this.router.navigate(['/login']);
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
   * Method to create tooltip info for different user types
   */
  getUserTypeTooltip(type) {
    this.userTooltip = '';
    switch (type) {
      case 'user':
        USER_TYPES.CUSTOUMER.forEach((accessLevel, index) => {
          this.userTooltip += (index + 1) + ". " + accessLevel + '\n\n';
        });
        break;
      case 'admin':
        USER_TYPES.ADMIN.forEach((accessLevel, index) => {
          this.userTooltip += (index + 1) + ". " + accessLevel + '\n\n';
        });
        break;
      case 'superAdmin':
        USER_TYPES.SUPERADMIN.forEach((accessLevel, index) => {
          this.userTooltip += (index + 1) + ". " + accessLevel + '\n\n';
        });
        break;
    }
    return this.userTooltip;
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
