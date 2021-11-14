import { Route } from "@angular/router";
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { RestaurantsResolverService } from './restaurants-resolver.service';
import { RestaurantsComponent } from "./restaurants.component";
import { UpdateRestaurantComponent } from './update-restaurant/update-restaurant.component';

// Routes registrations
export const RESTAURANTS_ROUTING: Route = {
  path: "",
  canActivate: [AuthGuard],
  children: [
    {
      path: "",
      component: RestaurantsComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "add-restaurant",
      component: AddRestaurantComponent,
      canActivate: [AuthGuard]
    },
    {
      path: "update-restaurant/:restaurantId",
      component: UpdateRestaurantComponent,
      canActivate: [AuthGuard]
    }
  ],
  resolve: { resolverData: RestaurantsResolverService }
};
