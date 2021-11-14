import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketIoService } from 'src/app/home/websocket-io.service';
import { ACTION_TYPE, CONNECTION_TYPE, ITEM_CATEGORY } from 'src/app/shared/common/constants';
import { SharedService } from 'src/app/shared/shared.service';
import { Item } from '../../../restaurants.model';
import { RestaurantsService } from '../../../restaurants.service';
import { CartService } from '../../cart.service';
import { FetchItemsResponse, ItemCRUDResponse } from '../../view-restaurant.model';
import { ViewRestaurantService } from '../../view-restaurant.service';

@Component({
  selector: 'app-biryanis',
  templateUrl: './biryanis.component.html',
  styleUrls: ['./biryanis.component.scss']
})
export class BiryanisComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  idSubscription: Subscription;
  /**
   * @ignore
   */
  restaurantId: string;
  /**
   * @ignore
   */
  biryanis: Array<Item> = [];
  /**
   * @ignore
   */
  public get ITEM_CATEGORY(): typeof ITEM_CATEGORY {
    return ITEM_CATEGORY;
  }
  /**
   * @ignore
   */
  qtySubscription: Subscription;
  /**
   * @ignore
   */
  cartItemsMap = new Map();
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
    private restaurantsService: RestaurantsService,
    private websocketIoService: WebsocketIoService,
    private viewRestaurantService: ViewRestaurantService,
    private cartService: CartService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // get restaurant Id
    this.idSubscription = this.restaurantsService.getRestaurantId().subscribe((id) => {
      this.restaurantId = id;
    });
    // get biryanis by restaurant Id
    if (this.restaurantId) {
      this.getBiryanis(this.restaurantId, ITEM_CATEGORY.BIRYANIES);
    }
    // listen to server and get data based on connection and action type (web socket server)
    this.websocketIoService.listenToServer(CONNECTION_TYPE.ITEM).subscribe((data) => {
      if (data.item.itemCategory === ITEM_CATEGORY.BIRYANIES) {
        switch (data.action) {
          case ACTION_TYPE.CREATE:
            this.addItem(data.item);
            break;
          case ACTION_TYPE.UPDATE:
            this.updateItem(data.item);
            break;
        }
      }
    });
    // update qty as per action made in cart item for quantity
    this.qtySubscription = this.cartService.getUpdatedQtyListener().subscribe((data) => {
      this.biryanis.map((item) => {
        if (item.id === data.itemId) {
          item.itemQuantity = data.quantity;
        }
      })
    });
    // update biryanis quantity and total price as per cart items if exist
    this.cartItemsMap = this.cartService.getitems();
    let cartItems = [];
    if (this.cartItemsMap.size > 0) {
      for (let [key, value] of this.cartItemsMap) {
        if (value.itemCategory === ITEM_CATEGORY.BIRYANIES) {
          cartItems.push(value);
        }
      }
      if (cartItems.length > 0) {
        setTimeout(() => {
          cartItems.forEach(item => {
            let index = this.biryanis.findIndex(object => object.id === item.id);
            if (index !== -1) {
              this.biryanis[index].itemQuantity = item.itemQuantity;
              this.biryanis[index].itemTotalPrice = item.itemTotalPrice;
            }
          });
        }, 1000);
      }
    }
  }
  /**
   * @ignore
   */
  onDeleteItem(itemId) {
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.viewRestaurantService.deleteItem(itemId, this.restaurantId).subscribe((httpResponse: ItemCRUDResponse) => {
      if (httpResponse.status.code === 200) {
        this.biryanis = this.biryanis.filter(object => object.id !== itemId);
        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        // Activating snack bar through service
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
   */
  onChangedItemCategory(itemId) {
    this.biryanis = this.biryanis.filter((item) => item.id !== itemId);
  }
  /**
   * @ignore
   * method to get biryanis available from database.
   */
  getBiryanis(restaurantId: string, itemCategory: string) {
    // Basic initializations required
    this.activeFullLoader = true;
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.biryanis = [];
    this.viewRestaurantService.getFoodItems(restaurantId, itemCategory).subscribe((httpResponse: FetchItemsResponse) => {
      if (httpResponse.status.code === 200) {
        httpResponse.response.items.forEach((item) => {
          let updatedItem = this.getUpdatedItem(item);
          this.biryanis.push(updatedItem);
        });
        this.activeFullLoader = false;
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
   * method to add item added without re-loading(web socket server).
   */
  private addItem(item) {
    let updatedItem = this.getUpdatedItem(item);
    this.biryanis = [...this.biryanis, ...[updatedItem]];
  }
  /**
   * @ignore
   */
  updateItem(item) {
    let updatedItem = this.getUpdatedItem(item);
    this.biryanis.map((item) => {
      if (item.id === updatedItem.id) {
        item.id = updatedItem.id,
          item.itemName = updatedItem.itemName,
          item.itemPrice = updatedItem.itemPrice,
          item.itemTotalPrice = updatedItem.itemPrice;
        item.offerCode = updatedItem.offerCode,
          item.offerCode = updatedItem.offerCode,
          item.offerPercent = updatedItem.offerPercent,
          item.itemCategory = updatedItem.itemCategory,
          item.restaurant = updatedItem.restaurant,
          item.creator = updatedItem.creator,
          item.createdAt = updatedItem.createdAt,
          item.updatedAt = updatedItem.updatedAt
      }
    });
  }
  /**
   * @ignore
   * method to get updated object
   */
  getUpdatedItem(item): Item {
    let updatedItem = {
      id: item._id,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: 0,
      itemTotalPrice: item.itemPrice,
      offerCode: item.offerCode,
      offerPercent: item.offerPercent,
      itemCategory: item.itemCategory,
      restaurant: item.restaurant,
      creator: item.creator,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
    return updatedItem;
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
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.qtySubscription) {
      this.qtySubscription.unsubscribe();
    }
  }

}
