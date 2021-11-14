import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Restaurant } from '../../restaurants/restaurants.model';
import { CartService } from '../../restaurants/view-restaurant/cart.service';
import { CHECKOUT_CONSTANTS } from '../checkout.constants';
import { Checkout } from '../checkout.model';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit, OnDestroy {
  /**
   * Input to component which holds restaurant information
   */
  @Input() restaurantInfo: Restaurant;
  /**
   * Output will be sent to the outside world
   */
  @Output() paymentProcessInput = new EventEmitter<Checkout>();
  /**
   * @ignore
   * Array to hold items information which are added to cart
   */
  cartItems: Array<any> = [];
  /**
   * @ignore
   * Map to get items infor from service
   */
  cartItemsMap = new Map();
  /**
   * @ignore
   * Formgroup to register all required form controls
   */
  billingForm: FormGroup;
  /**
   * @ignore
   * Object to hold items total price
   */
  itemsTotal: number = 0;
  /**
   * @ignore
   * Object to hold tax charges
   */
  taxCharges: number = 0;
  /**
   * @ignore
   * Constants to access tax percent value..etc
   */
  public get CHECKOUT_CONSTANTS(): typeof CHECKOUT_CONSTANTS {
    return CHECKOUT_CONSTANTS;
  }
  /**
   * @ignore
   * Object to hold total payable amount
   */
  payableAmount: number = 0;
  /**
   * @ignore
   * Object to hold disconted amount
   */
  discountedPrice: number = 0;
  /**
   * @ignore
   * Subscription to subscribe updated quantity observable
   */
  qtySubscription: Subscription;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    // getting cart items from service
    this.cartItemsMap = this.cartService.getitems();
    if (this.cartItemsMap.size > 0) {
      for (let [key, value] of this.cartItemsMap) {
        this.cartItems.push(value);
      }
    }
    // calculations needed for cart items received
    if (this.cartItems.length > 0) {
      this.sumItemsTotal();
      this.calTaxCharges();
      this.calPayableAmount();
      this.calOfferedPrice();
    }
    // update qty as per action made on item for quantity on live
    this.qtySubscription = this.cartService.getUpdatedQtyListener().subscribe((data) => {
      this.cartItems.map((item) => {
        if (item.id === data.itemId) {
          item.itemQuantity = data.quantity;
          if (item.itemQuantity === 0) {
            // remove item from the cart. it has been updated in memory variables already.
            this.cartItems = this.cartItems.filter(object => object.id !== data.itemId);
          }
          this.updatePrices();
        }
      });
    });
  }
  /**
   * @ignore
   * Method to update prices, tax charges and offered price as part of discount
   */
  updatePrices() {
    this.sumItemsTotal();
    this.calTaxCharges();
    this.calPayableAmount();
    if (this.restaurantInfo.offerPercent) {
      this.calOfferedPrice();
    }
  }
  /**
   * @ignore
   * Method to sum up prices
   */
  sumItemsTotal() {
    this.itemsTotal = this.cartItems.reduce((prevValue, currentValue) => prevValue + currentValue.itemTotalPrice, 0);
  }
  /**
   * @ignore
   * Method to calculate tax charges
   */
  calTaxCharges() {
    this.taxCharges = 0;
    if (this.itemsTotal > 0) {
      this.taxCharges = this.itemsTotal * CHECKOUT_CONSTANTS.TAX_CHARGE_PERCENT / 100;
    }
  }
  /**
   * @ignore
   * Method to calculate total payable amount
   */
  calPayableAmount() {
    this.payableAmount = this.itemsTotal + this.taxCharges;
  }
  /**
   * @ignore
   * Method to calculate offered price on totals
   */
  calOfferedPrice() {
    this.discountedPrice = this.itemsTotal * (+this.restaurantInfo.offerPercent / 100);
  }
  /**
   * @ignore
   * Method to trigger event to outside world with payment information
   */
  onProceedToPay() {
    this.paymentProcessInput.emit({
      totalPayable: this.payableAmount,
      GST: this.taxCharges,
      restaurantInfo: this.restaurantInfo,
      cartItems: this.cartItems,
      discountPrice: this.discountedPrice
    });
  }
  /**
   * @ignore
   * unsubscribe subscriptions before leaving the component
   */
  ngOnDestroy() {
    if (this.qtySubscription) {
      this.qtySubscription.unsubscribe();
    }
  }
}
