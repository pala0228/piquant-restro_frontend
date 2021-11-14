import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { OrdersComponent } from './orders.component';

// routes registrations
export const ORDERS_ROUTING: Route =
{
  path: '',
  component: OrdersComponent,
  canActivate: [AuthGuard]
};
