import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { BiryanisComponent } from './biryanis/biryanis.component';
import { DessertsComponent } from './desserts/desserts.component';
import { ItemsComponent } from './items.component';
import { StartersComponent } from './starters/starters.component';

// Routes registrations
export const ITEMS_ROUTING: Route = {
  path: 'items',
  component: ItemsComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'biryanis',
      component: BiryanisComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'starters',
      component: StartersComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'desserts',
      component: DessertsComponent,
      canActivate: [AuthGuard],
    }
  ]
};

