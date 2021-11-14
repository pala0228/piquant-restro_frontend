import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Restaurant, RestaurantsListResponse, RestaurantCrudResponse } from "./restaurants.model";
import { RestaurantsService } from "./restaurants.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { WebsocketIoService } from '../websocket-io.service';
import { ACTION_TYPE, CONNECTION_TYPE } from 'src/app/shared/common/constants';
import { SharedService } from 'src/app/shared/shared.service';
import { UserInfo } from 'src/app/core/store/models/user-info.model';
import { PiquantHasAccess } from 'src/app/core/auth/authorization.decorator';
import { AccessMatrixConstants } from 'src/app/core/access-matrix/access-matrix.constants';
import { BasicDialogComponent } from 'src/app/shared/common/dialogs/basic-dialog/basic-dialog.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/environments/environment';
import { IdleEvents } from 'src/app/core/user-idle/user-idle.constants';
import { UserIdleService } from 'src/app/core/user-idle/user-idle.service';
import TimeCalculator from 'src/app/shared/common/util/time-calculations';
import { SessionTimeoutComponent } from 'src/app/core/auth/session-timeout/session-timeout.component';

@Component({
  selector: "app-restaurants",
  templateUrl: "./restaurants.component.html",
  styleUrls: ["./restaurants.component.scss"],
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * View child of paginator
   */
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  /**
   * @ignore
   * It holds all available restaurants in the database.
   */
  restaurantsData: Restaurant[] = [];
  /**
   * @ignore
   * To show no of total restaurants available in the database.
   */
  totalRestaurants: number;
  /**
   * @ignore
   * To show limited number of items per page
   */
  restaurantsPerPage = 8;
  /**
   * @ignore
   * To provide user for selecting restaurants as bulk number
   */
  pageSizeOptions: Array<number> = [];
  /**
   * @ignore
   * To have current page number
   */
  currentPage = 1;
  /**
   * @ignore
   * It subscribe store subscription
   */
  storeSubscription: Subscription;
  /**
   * @ignore
   * It holds logged in user info
   */
  user: UserInfo = null;
  /**
   * @ignore
   */
  public get CONNECTION_TYPE(): typeof CONNECTION_TYPE {
    return CONNECTION_TYPE;
  }
  /**
   * @ignore
   */
  public get ACTION_TYPE(): typeof ACTION_TYPE {
    return ACTION_TYPE;
  }
  /**
   * @ignore
   * tooltip information
   */
  toolTip: string = 'Add food items';
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen: boolean = false;
  /**
   * @ignore
   * To show messsage on the info screen component
   */
  message = '';
  /**
   * @ignore
   * To change message view(error/success/info/warning)
   */
  status = '';
  /**
   * @ignore
   * Flag to switch full loader on/off
   */
  activeFullLoader = false;
  /**
   * @ignire
   */
  userAuthenticated = false;
  /**
   * @ignore
   */
  userIdleSubscriptions: Subscription[] = [];
  /**
   * @ignore
   *
   */
  sessionTimeoutData: any = {};
  /**
   * @ignore
   */
  sessionTimeoutDataDailogRef: any;
  /**
   * @ignore
   * Access to be granted or not
   */
  @PiquantHasAccess(AccessMatrixConstants.EDIT_RESTAURANT)
  hasEditRestaurantAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.ADD_ITEMS)
  hasAddItemsAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.VIEW_ITEMS)
  hasViewItemsAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.DELETE_RESTAURANT)
  hasDeleteRestaurant: boolean;

  constructor(
    private restaurantsService: RestaurantsService,
    private router: Router,
    private store: Store<AppState>,
    private websocketIoService: WebsocketIoService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userIdleService: UserIdleService,
  ) { }

  ngOnInit() {
    // Accessing resolver service data and set user idle and timeout times
    const userIdleTimeoutDetails = this.activatedRoute.snapshot.data.resolverData.timeoutDetails;
    this.setUserIdleTimeout(userIdleTimeoutDetails.response);

    // Subscribing store subscription to access user information saved
    this.storeSubscription = this.store.select('userInfo').subscribe(user => {
      this.user = user;
      if (this.user && this.user.userType === 'User') {
        this.toolTip = 'View food items'
      }
    });
    // Get all available restaurants data
    this.getRestaurants(this.currentPage, this.restaurantsPerPage, true);

    // Listen to web socket server and get data based on connection and action type
    this.websocketIoService.listenToServer(CONNECTION_TYPE.RESTAURANT).subscribe((data) => {
      switch (data.action) {
        case ACTION_TYPE.CREATE:
          this.addRestaurant(data.restaurant);
          break;
        case ACTION_TYPE.UPDATE:
          this.updateRestaurant(data.restaurant);
          break;
        case ACTION_TYPE.DELETE:
          this.deleteRestaurant(data.restaurantId);
      }
    });
    // to enable view items button when user is not authenticated
    this.userAuthenticated = this.authService.isAuthenticated();
    if (!this.userAuthenticated) {
      this.toolTip = "View food items"
    }
  }
  /**
   * @ignore
   * Method to navigate to update restaurant component
   */
  onEdit(object) {
    this.sharedService.activatePartialLoader(true);
    this.router.navigate(['/restaurants', 'update-restaurant', object.id], { relativeTo: this.activatedRoute });
  }
  /**
   * @ignore
   * Method to delete restaurant
   */
  onDelete(object) {
    this.dialog.open(BasicDialogComponent,
      {
        width: '380px',
        height: 'fit-content',
        autoFocus: false,
        data: {
          message: 'Are you sure want to remove the restaurant?',
          actionButton: 'Delete',
          cancelButton: 'Cancel'
        }
      }
    ).afterClosed().subscribe((result) => {
      if (result.status === 'cancel') {
        // TODO: logic to implement cancel action type if any
      }
      if (result.status === 'proceed') {
        // Basic initializations required
        this.sharedService.activatePartialLoader(true);
        this.showScreen = false;
        this.message = '';
        this.status = '';

        this.restaurantsService.deleteRestaurant(object.id).subscribe((httpResponse: RestaurantCrudResponse) => {
          if (httpResponse.status.code === 200) {
            this.sharedService.activatePartialLoader(false);
            // Activating snack bar through service
            let input = {
              showSnackbar: true,
              message: httpResponse.status.message,
              status: 'success'
            }
            this.sharedService.activateSnackbar(input);
            // fetching restaurants
            this.getRestaurants(this.currentPage, this.restaurantsPerPage);
          }
        }, (error) => {
          if (error.error && error.error.status) {
            this.errorMessage(error.error.status.message);
          } else {
            this.errorMessage(null);
          }
        });
      }
    });
  }
  /**
   * @ignore
   * Method to view restaurant and their items list and to add items
   */
  onAddViewItems(object) {
    this.sharedService.activatePartialLoader(true);
    this.router.navigate(['/view-restaurant', object.id]);
  }
  /**
   * @ignore
   * Method to trigger pagination data and load restaurants accordingly.
   */
  onChangePage(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.restaurantsPerPage = event.pageSize;
    let message = 'Restaurants are loaded successfully';
    this.getRestaurants(this.currentPage, this.restaurantsPerPage, false, message);
  }
  /**
   * @ignore
   * method to add restaurant added without re-loading(web socket server).
   */
  private addRestaurant(restaurant) {
    let updatedRestaurant = this.getUpdatedRestaurant(restaurant);
    this.restaurantsData = [...this.restaurantsData, ...[updatedRestaurant]];
  }
  /**
   * @ignore
   * method to update restaurant without re-loading(web socket server)
   */
  private updateRestaurant(restaurant) {
    let updatedRestaurant = this.getUpdatedRestaurant(restaurant);
    this.restaurantsData.map((object: Restaurant) => {
      if (object.id === updatedRestaurant.id) {
        object.id = updatedRestaurant.id,
          object.restaurantTitle = updatedRestaurant.restaurantTitle,
          object.restaurantSubTitle = updatedRestaurant.restaurantSubTitle,
          object.image = environment.apiUrl + updatedRestaurant.imagePath,
          object.imagePath = updatedRestaurant.imagePath,
          object.rating = updatedRestaurant.rating,
          object.deliveryTime = updatedRestaurant.deliveryTime,
          object.offerPercent = updatedRestaurant.offerPercent,
          object.offerCode = updatedRestaurant.offerCode,
          object.address = updatedRestaurant.address,
          object.creator = updatedRestaurant.creator
      }
    });
  }
  /**
   * @ignore
   * method to delete restaurant without re-loading (web socker server)
   */
  private deleteRestaurant(restaurantId) {
    // If current page holds only one item then reduce currentPage by 1 while fetching available restaurants
    if (this.restaurantsData.length === 1) {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginator.previousPage()
      }
    }
    this.restaurantsData = this.restaurantsData.filter((object: Restaurant) => object.id !== restaurantId);
  }
  /**
   * @ignore
   * method to return updated restaurant data
   */
  private getUpdatedRestaurant(restaurant) {
    let updatedRestaurant =
    {
      id: restaurant._id,
      restaurantTitle: restaurant.restaurantTitle,
      restaurantSubTitle: restaurant.restaurantSubTitle,
      image: environment.apiUrl + restaurant.imagePath,
      imagePath: restaurant.imagePath,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
      offerPercent: restaurant.offerPercent,
      offerCode: restaurant.offerCode,
      address: restaurant.address,
      items: restaurant.items,
      creator: restaurant.creator
    }
    return updatedRestaurant;
  }
  /**
   * @ignore
   * method to get all restaurants data
   */
  private getRestaurants(currentPage: number, itemsPerPage: number, flag?: boolean, message: string = null) {
    // Basic initializations required
    this.activeFullLoader = true;
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.restaurantsService.getRestaurants(currentPage, itemsPerPage, this.user.userType)
      .subscribe((httpResponse: RestaurantsListResponse) => {
        if (httpResponse.status.code === 200) {
          this.activeFullLoader = false;

          this.restaurantsData = httpResponse.response.restaurants;
          this.totalRestaurants = +httpResponse.response.totalRestaurants;

          // Constructing page size options
          if (this.totalRestaurants && flag) {
            let itemsforPage = 8;
            if ((this.totalRestaurants / itemsforPage) < 1) {
              this.pageSizeOptions.push(this.totalRestaurants);
            } else {
              for (let i = 1; itemsforPage <= this.totalRestaurants; i++) {
                this.pageSizeOptions.push(itemsforPage);
                itemsforPage += (itemsforPage);
              }
            }
          }
          // Activating snack bar through service
          let input = {
            showSnackbar: true,
            message: message ? message : httpResponse.status.message,
            status: 'success'
          }
          this.sharedService.activateSnackbar(input);
        }
      }, (error) => {
        if (error.error && error.error.status) {
          this.errorMessage(error.error.status.message);
        } else {
          this.errorMessage(null);
        }
      });
  }
  /**
   * @ignore
   * Method to set up user idle and timeout times and start monitoring
   */
  setUserIdleTimeout(userIdleTime) {
    if (userIdleTime) {
      const config = {
        idle: Number(userIdleTime.idleSeconds),
        timeout: Number(userIdleTime.timeoutSeconds),
        ping: 60,
        interruptEvents: [
          IdleEvents.CLICK,
          IdleEvents.KEYDOWN,
          IdleEvents.MOUSEMOVE,
          IdleEvents.RESIZE,
          IdleEvents.TOUCHEND,
          IdleEvents.TOUCHSTART
        ]
      };
      this.userIdleService.setConfigValues(config);

      // Initiate user idle timeout
      this.userIdleService.startWatching();

      // Callback will be triggered when user idle warning starts
      this.userIdleSubscriptions.push(
        this.userIdleService.onTimerStart().subscribe((timer) => {
          const remainingTime = config.timeout - timer;
          this.sessionTimeoutData.timer = TimeCalculator.convertToMinsAndReturnsMinsAndSeconds(
            remainingTime
          );
          if (!this.sessionTimeoutDataDailogRef) {
            this.sessionTimeoutData.idleTime = config.idle;
            this.sessionTimeoutDataDailogRef = this.dialog.open(
              SessionTimeoutComponent,
              {
                data: this.sessionTimeoutData,
                disableClose: true,
                width: "450px",
                panelClass: "session-timeout-container",
              }
            );
            this.userIdleSubscriptions.push(
              this.sessionTimeoutDataDailogRef
                .afterClosed()
                .subscribe((data) => {
                  if (data) {
                    this.continuesession();
                  }
                })
            );
          }
        })
      );
      // callback will be triggered when user idle timed out
      this.userIdleSubscriptions.push(
        this.userIdleService.onTimeout().subscribe(() => {
          this.logout();
        })
      );
    }
  }
  /**
   * @ignore
   * Reset user idle timer
   */
  private continuesession() {
    this.userIdleService.resetTimer();
    this.sessionTimeoutDataDailogRef = null;
  }
  /**
   * @ignore
   * Logout the user from the application
   */
  private logout() {
    this.dialog.closeAll();
    this.destroysessiontimer();
    this.authService.logoutUser();
  }
  /**
   * @ignore
   * destroy timers
   */
  private destroysessiontimer() {
    this.userIdleService.stopTimer();
    this.userIdleService.stopWatching();
    this.userIdleSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }
  /**
   * @ignore
   * Method to display error message
   */
  private errorMessage(message) {
    this.showScreen = true;
    this.status = 'error';
    this.message = message;
    this.sharedService.activatePartialLoader(false);
    this.activeFullLoader = false;
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    this.sharedService.activatePartialLoader(false);
  }
}
