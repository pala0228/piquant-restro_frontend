import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { CustomerComponent } from './customer.component';
import { PasswordManagementComponent } from './password-management/password-management.component';
import { ProfileComponent } from './profile/profile.component';

// Routes configuration
export const CUSTOMER_ROUTING: Route =
{
  path: "",
  component: CustomerComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: "user-profile",
      component: ProfileComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "password-management",
      component: PasswordManagementComponent,
      canActivate: [AuthGuard],
    }
  ]
};
