import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { CheckoutComponent } from './checkout.component';
import { FailureComponent } from './failure/failure.component';
import { SuccessComponent } from './success/success.component';

// Routes registrations
export const CHECKOUT_ROUTING: Route = {
  path: "",
  children: [
    {
      path: ':restaurantId',
      component: CheckoutComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'success',
      component: SuccessComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'failure',
      component: FailureComponent,
      canActivate: [AuthGuard]
    }
  ]
};

