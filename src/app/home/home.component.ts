import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Restaurant, RestaurantsListResponse } from './home.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    // getting available restaurants
    this.getRestaurants(this.currentPage, this.restaurantsPerPage, true);
  }
  /**
   * @ignore
   * Method to view restaurant and their items list and to add items
   */
  onViewItems(object) {
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
   * method to get all restaurants data
   */
  private getRestaurants(currentPage: number, itemsPerPage: number, flag: boolean = false, message: string = null) {
    // Basic initializations required
    this.activeFullLoader = true;
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.homeService.getRestaurants(currentPage, itemsPerPage, 'User').subscribe((httpResponse: RestaurantsListResponse) => {
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
    this.sharedService.activatePartialLoader(false);
  }
}
