import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { ITEMS_ROUTING } from './items/items-routing.constants';
import { ViewRestaurantComponent } from './view-restaurant.component';

// Route registrations
export const VIEW_RESTAURANT_ROUTING: Route = {
  path: '',
  children: [
    {
      path: ':restaurantId',
      component: ViewRestaurantComponent,
      canActivate: [AuthGuard],
      children: [
        ITEMS_ROUTING
      ]
    }
  ]
};
