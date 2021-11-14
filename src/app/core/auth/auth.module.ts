import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SessionExpiryComponent } from './session-expiry/session-expiry.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    ForgotPasswordComponent,
    SessionTimeoutComponent,
    PageNotFoundComponent,
    SessionExpiryComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    ForgotPasswordComponent,
    SessionTimeoutComponent,
    PageNotFoundComponent,
    SessionExpiryComponent
  ],
  entryComponents: [
    LogoutComponent,
    ForgotPasswordComponent,
    SessionTimeoutComponent,
    SessionExpiryComponent
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AuthModule { }
