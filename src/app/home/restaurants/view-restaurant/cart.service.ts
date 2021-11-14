import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  /**
   * @ignore
   */
  itemsMap = new Map();
  /**
   * @ignore
   */
  items = new Subject<any>();
  /**
   * @ignore
   */
  itemQuantity = new Subject<{ itemId: string, quantity: number }>();

  constructor() { }
  /**
   * @ignore
   */
  setItem(itemId, item) {
    this.itemsMap.set(itemId, item);
    this.items.next(this.itemsMap);
  }
  /**
   * @ignore
   */
  getitems() {
    this.items.next(this.itemsMap);
    return this.itemsMap;
  }
  /**
   * @ignore
   */
  removeItem(itemId) {
    if (this.itemsMap.has(itemId)) {
      this.itemsMap.delete(itemId);
      this.items.next(this.itemsMap);
    }
  }
  /**
   * @ignore
   */
  removeAllItems() {
    this.itemsMap.clear();
    this.items.next(this.itemsMap);
  }
  /**
   * @ignore
   */
  getItemsListener() {
    return this.items.asObservable();
  }
  /**
   * @ignore
   */
  updateItemQuantity(itemId, quantity) {
    this.itemQuantity.next({ itemId: itemId, quantity: quantity });
  }
  /**
   * @ignore
   */
  getUpdatedQtyListener() {
    return this.itemQuantity.asObservable();
  }
}
