import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  /**
   * @ignore
   */
  @Input() item: any;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
  }
  /**
   * @ignore
   */
  onDecreaseQty(item) {
    item.itemQuantity--;
    if (item.itemQuantity === 0) {
      this.cartService.removeItem(item.id);
    } else {
      item.itemTotalPrice = item.itemPrice * item.itemQuantity;
    }
    this.cartService.updateItemQuantity(item.id, item.itemQuantity);
  }
  /**
   * @ignore
   */
  onIncreaseQty(item) {
    item.itemQuantity++;
    item.itemTotalPrice = item.itemPrice * item.itemQuantity;
    this.cartService.updateItemQuantity(item.id, item.itemQuantity);
  }


}
