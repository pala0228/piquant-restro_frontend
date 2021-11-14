import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessMatrixConstants } from '../core/access-matrix/access-matrix.constants';
import { AuthService } from '../core/auth/auth.service';
import { PiquantHasAccess } from '../core/auth/authorization.decorator';
import { LogoutComponent } from '../core/auth/logout/logout.component';
import { RestaurantsService } from '../home/restaurants/restaurants.service';
import { CartService } from '../home/restaurants/view-restaurant/cart.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  userIsAuthenticated = false;
  /**
   * @ignore
   */
  subScription: Subscription;
  /**
   * @ignore
   */
  cartItemsCounter: number = 0;
  /**
   * @ignore
   */
  restaurantIdSubscription: Subscription;
  /**
   * @ignore
   */
  restaurantId: string;
  /**
   * @ignore
   */
  cartItemsScription: Subscription;
  /**
   * @ignore
   */
  @Output() closeSidenav = new EventEmitter();
  /**
   * @ignore
   */
  routeSubscription: Subscription;
  /**
   * @ignore
   */
  activeRoute = '';
  /**
   * @ignore
   * Access to be granted or not
   */
  @PiquantHasAccess(AccessMatrixConstants.ADD_RESTAURANT)
  hasAddRestaurantAcess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.RESTAURANTS)
  hasRestaurantsAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.ORDERS)
  hasOrdersAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.CART)
  hasCartAccess: boolean;

  constructor(
    private authService: AuthService,
    private dailog: MatDialog,
    private cartService: CartService,
    private restaurantsService: RestaurantsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // getting active route url
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        this.activeRoute = event.url;
    });
    // checking user is authenticated or not
    this.subScription = this.authService.getAuthStatusListener().subscribe((isAuthenticated: boolean) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    // storing cart items count
    this.cartItemsScription = this.cartService.getItemsListener().subscribe(itemsMap => {
      if (itemsMap.size > 0) {
        this.cartItemsCounter = itemsMap.size;
      } else {
        this.cartItemsCounter = 0;
      }
    });
    // getting restaurant id by subject
    this.restaurantIdSubscription = this.restaurantsService.getRestaurantId().subscribe(id => {
      this.restaurantId = id;
    });
  }
  /**
   * @ignore
   */
  onLogout() {
    this.closeSidenav.emit();
    this.dailog.open(LogoutComponent, {
      width: '380px',
      height: 'fit-content'
    }).afterClosed().subscribe((result) => {
      if (result.action === 'logout') {
        this.authService.logoutUser();
      }
    });
  }
  /**
   * @ignore
   * Method to navigate to checkout component with restaurant Id
   * ex: checkout/restaurantId (here id can be accessed through 'activatedRoute.snapshot.paramMap');
   */
  navigateToCheckout() {
    this.closeSidenav.emit();
    this.router.navigate(['/checkout', this.restaurantId]);
  }
  /**
   * @ignore
   * Method to navigate to respective child route under parent route
   */
  navigateTo(parentRoute, childRoute) {
    this.router.navigate([parentRoute, childRoute], { relativeTo: this.activatedRoute });
    this.closeSideNav();
  }
  /**
   * @ignore
   */
  closeSideNav() {
    this.closeSidenav.emit();
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.cartItemsScription) {
      this.cartItemsScription.unsubscribe();
    }
    if (this.restaurantIdSubscription) {
      this.restaurantIdSubscription.unsubscribe();
    }
  }
}
