import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { RouterModule, Routes } from '@angular/router';
import { CUSTOMER_ROUTING } from './customer-routing.constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordManagementComponent } from './password-management/password-management.component';
import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';

// Routes configurations
const routes: Routes = [CUSTOMER_ROUTING];

@NgModule({
  declarations: [
    ProfileComponent,
    PasswordManagementComponent,
    CustomerComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule,
  ],
  exports: [
    RouterModule,
    ProfileComponent,
    PasswordManagementComponent,
    CustomerComponent
  ],
  entryComponents: [],
  providers: []
})
export class CustomerModule { }
