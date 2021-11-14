import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { LoginComponent } from './core/auth/login/login.component';
import { PageNotFoundComponent } from './core/auth/page-not-found/page-not-found.component';
import { SignupComponent } from './core/auth/signup/signup.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {
    path: "login", component: LoginComponent
  },
  {
    path: "signup", component: SignupComponent
  },
  {
    path: "home", component: HomeComponent
  },
  {
    path: "site-developer-profile", loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule)
  },
  {
    path: "restaurants", loadChildren: () => import('./home/restaurants/restaurants.module').then(m => m.RestaurantsModule)
  },
  {
    path: 'customer', loadChildren: () => import('./home/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'placed-orders', loadChildren: () => import('./home/orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'checkout', loadChildren: () => import('./home/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: 'view-restaurant', loadChildren: () => import('./home/restaurants/view-restaurant/view-restaurant.module').then(m => m.ViewRestaurantModule)
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
