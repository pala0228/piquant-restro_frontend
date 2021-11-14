import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { Restaurant } from '../../restaurants.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  @Input() restaurantInfo: Restaurant;
  /**
   * @ignore
   */
  cartItems: Array<any> = [];
  /**
   * @ignore
   */
  subScription: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.subScription = this.cartService.getItemsListener().subscribe(itemsMap => {
      this.cartItems = [];
      for (let [key, value] of itemsMap) {
        // if item is from same restaurant then add it to cartItems list.
        if (value.restaurant === this.restaurantInfo.id) {
          this.cartItems.push(value);
        }
      }
      if (this.cartItems.length === 0 && itemsMap.size > 0) {
        setTimeout(() => {
          let input = {
            showSnackbar: true,
            message: "Items added from another restaurant are discarded.",
            status: 'warning'
          }
          // Activating snack bar through service
          this.sharedService.activateSnackbar(input);
          this.cartService.removeAllItems();
        }, 1000);
      }
    });
  }
  /**
   * @ignore
   */
  onCheckout() {
    this.router.navigate(['/checkout', this.restaurantInfo.id])
  }
  ngOnDestroy() {
    if (this.subScription) {
      this.subScription.unsubscribe();
    }
  }

}
