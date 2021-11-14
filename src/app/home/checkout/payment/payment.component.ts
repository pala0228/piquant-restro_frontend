import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { UserInfo } from 'src/app/core/store/models/user-info.model';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from 'src/environments/environment';
import { Cart, CartResponse, Checkout } from '../checkout.model';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  /**
   * Input to the component which holds payment information
   */
  @Input() paymentProcessInput: Checkout;
  /**
   * @ignore
   * Object to hold checkout data
   */
  checkoutData: Checkout;
  /**
   * @ignore
   * Object to hold item infromation
   */
  cart: Cart;
  /**
   * @ignore
   * Object to hold strice instance
   */
  stripePromise: any;
  /**
   * @ignore
   * Object to hold strice object with test key
   */
  stripe = window.Stripe(environment.stripe_key);
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen: boolean = false;
  /**
   * @ignore
   * Message to show on the infor screen component
   */
  message = '';
  /**
   * @ignore
   * Status to change message view(error/success/info/warning)
   */
  status = '';
  /**
   * @ignore
   * Object to hold logged in user information
   */
  userInfo: UserInfo;
  /**
   * @ignore
   * subscription to subscribe store
   */
  storeSubscription: Subscription;

  constructor(
    private checkoutService: CheckoutService,
    private sharedService: SharedService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.checkoutData = this.paymentProcessInput;
    // getting user info for userId
    this.storeSubscription = this.store.select('userInfo').subscribe(userInfo => {
      this.userInfo = userInfo;
    });
  }
  /**
   * @ignore
   * Method to store order items and initiate strice for payment
   */
  onPay() {
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    // stroing cart items and creating stripe session id by calling back end API
    this.cart = {
      restaurantId: this.checkoutData.restaurantInfo.id,
      restaurantName: this.checkoutData.restaurantInfo.restaurantTitle,
      restaurantSubTitle: this.checkoutData.restaurantInfo.restaurantSubTitle,
      restaurantAddress: this.checkoutData.restaurantInfo.address,
      restaurantImage: this.checkoutData.restaurantInfo.imagePath,
      creator: this.userInfo.userId,
      discountPrice: this.checkoutData.discountPrice,
      GST: this.checkoutData.GST,
      totalPayableAmount: this.checkoutData.totalPayable,
      invoiceNumber: this.generateInvoice(),
      cartItems: this.checkoutData.cartItems.map(item => {
        return {
          itemId: item.id,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemCategory: item.itemCategory,
          itemQuantity: item.itemQuantity,
          itemTotalPrice: item.itemTotalPrice,
          createdOn: item.createdAt
        }
      }),
    }
    // calling backend to create the checkout session.
    this.checkoutService.storeCartItems(this.cart).subscribe((httpResponse: CartResponse) => {
      if (httpResponse.status.code === 201) {
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);
        // Re directing to checkout page
        this.stripe.redirectToCheckout({
          sessionId: httpResponse.response.sessionId
        })
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
  }
  /**
   * @ignore
   */
  private generateInvoice(): string {
    let min = Math.ceil(1);
    let max = Math.floor(1000000);
    const invoiceNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return invoiceNumber.toString().padStart(6, "0")
  }
  /**
   * @ignore
   * unsubscribe subscriptions before leaving the component
   */
  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }
}
