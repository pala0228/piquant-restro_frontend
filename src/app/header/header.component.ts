import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessMatrixConstants } from '../core/access-matrix/access-matrix.constants';
import { AuthService } from '../core/auth/auth.service';
import { PiquantHasAccess } from '../core/auth/authorization.decorator';
import { LogoutComponent } from '../core/auth/logout/logout.component';
import { RestaurantsService } from '../home/restaurants/restaurants.service';
import { CartService } from '../home/restaurants/view-restaurant/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * Subscription for checking user authentication
   */
  userAuthenticatedSub: Subscription;
  /**
   * @ignore
   * Subscription for total items added to cart
   */
  cartItemsScription: Subscription;
  /**
   * @ignore
   * Flat to see user is authenticated or not
   */
  userIsAuthenticated = false;
  /**
   * @ignore
   * Object to hold number of items added to cart
   */
  cartItemsCounter: number = 0;
  /**
   * @ignore
   * Subscription for getting restaurant Id which is viewed by user currently
   */
  restaurantIdSubscription: Subscription;
  /**
   * @ignore
   * Object to hold restaurant Id
   */
  restaurantId: string;
  /**
   * @ignore
   * Event emmitter to trigger event to outside world
   */
  @Output() activateSidenav = new EventEmitter<boolean>();
  /**
   * @ignore
   * Subscription for getting activated route events
   */
  routeSubscription: Subscription;
  /**
   * @ignore
   * Object to hold current route activated
   */
  activeRoute = '';
  /**
   * @ignore
   * Access to be granted or not
   */
  @PiquantHasAccess(AccessMatrixConstants.ADD_RESTAURANT)
  hasAddRestaurantAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.RESTAURANTS)
  hasRestaurantsAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.ORDERS)
  hasOrdersAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.CART)
  hasCartAccess: boolean;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService,
    private restaurantsService: RestaurantsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Getting active route url
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        this.activeRoute = event.url;
    });
    // Checking user is authenticated or not
    this.userAuthenticatedSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated: boolean) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    // Storing cart items count
    this.cartItemsScription = this.cartService.getItemsListener().subscribe(itemsMap => {
      if (itemsMap.size > 0) {
        this.cartItemsCounter = itemsMap.size;
      } else {
        this.cartItemsCounter = 0;
      }
    });
    // Getting restaurant id by subject
    this.restaurantIdSubscription = this.restaurantsService.getRestaurantId().subscribe(id => {
      this.restaurantId = id;
    });
  }
  /**
   * @ignore
   * Method to open side nav
   */
  openSideNav() {
    this.activateSidenav.emit(true);
  }
  /**
   * @ignore
   */
  onLogout() {
    this.dialog.open(LogoutComponent, {
      width: '380px',
      height: 'fit-content',
      autoFocus: false,
    }).afterClosed().subscribe((result) => {
      if (result.action === 'logout') {
        // log out user
        this.authService.logoutUser();
      }
    });
  }
  /**
   * @ignore
   * Method to navigate to home page.
   */
  naviageToHome() {
    if (this.userIsAuthenticated) {
      this.router.navigate(['/restaurants']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  /**
   * @ignore
   * Method to navigate to checkout component with restaurant Id
   * ex: checkout/restaurantId (here id can be accessed through 'activatedRoute.snapshot.paramMap');
   */
  navigateToCheckout() {
    this.router.navigate(['/checkout', this.restaurantId]);
  }
  /**
   * @ignore
   * Method to navigate to respective child route under parent route
   */
  navigateTo(parentRoute, childRoute) {
    this.router.navigate([parentRoute, childRoute], { relativeTo: this.activatedRoute });
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.userAuthenticatedSub) {
      this.userAuthenticatedSub.unsubscribe();
    }
    if (this.cartItemsScription) {
      this.cartItemsScription.unsubscribe();
    }
    if (this.restaurantIdSubscription) {
      this.restaurantIdSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
