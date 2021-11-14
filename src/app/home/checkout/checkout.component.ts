import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../restaurants/restaurants.model';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  /**
   * @ignore
   * Object to hold payment information
   */
  paymentProcessInput: any = null;
  /**
   * @ignore
   * To toggle between components
   */
  toggleContent: boolean = false;
  /**
   * @ignore
   * Object to hold restaurant information
   */
  restaurantInfo: Restaurant;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantsService: RestaurantsService
  ) { }

  ngOnInit() {
    // getting restaurant id from the activated route snapshot
    let restaurantId = this.activatedRoute.snapshot.paramMap.get('restaurantId');

    // fetching restaurant information based on restaurant id
    if (restaurantId) {
      this.restaurantInfo = this.restaurantsService.getRestaurantById(restaurantId);
    }
  }
  /**
   * @ignore
   * Method to activate payment component
   */
  activatePayment(event) {
    this.paymentProcessInput = null;
    setTimeout(() => {
      this.paymentProcessInput = event;
      this.showPaymentProcess();
    });
  }
  /**
   * @ignore
   * Method to activate cart items component
   */
  showCartItems() {
    if (this.toggleContent) {
      this.toggleContent = !this.toggleContent;
    }
  }
  /**
   * @ignore
   * Method to activate payment component
   */
  showPaymentProcess() {
    if (!this.toggleContent) {
      this.toggleContent = !this.toggleContent;
    }
  }
}
