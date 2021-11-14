import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessMatrixConstants } from 'src/app/core/access-matrix/access-matrix.constants';
import { PiquantHasAccess } from 'src/app/core/auth/authorization.decorator';
import { IMAGES } from 'src/app/shared/common/constants';
import { Restaurant } from '../restaurants.model';
import { RestaurantsService } from '../restaurants.service';
import { AddItemComponent } from './add-item/add-item.component';
import { CartService } from './cart.service';

@Component({
  selector: 'app-view-restaurant',
  templateUrl: './view-restaurant.component.html',
  styleUrls: ['./view-restaurant.component.scss']
})
export class ViewRestaurantComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * restaurantInfo to hold all info based on id received in by route.
   */
  restaurantInfo: Restaurant;
  /**
   * @ignore
   */
  imagePreview: string = IMAGES.background.url;
  /**
   * @ignore
   */
  cartItemsScription: Subscription;
  /**
   * @ignore
   */
  cartItemsCounter: number = 0;
  /**
   * @ignore
   */
  restaurantId: string;
  /**
   * @ignore
   * Access to be granted or not
   */
  @PiquantHasAccess(AccessMatrixConstants.ADD_ITEM)
  hasAddItemAccess: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantsService: RestaurantsService,
    private dailog: MatDialog,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.restaurantId = this.activatedRoute.snapshot.paramMap.get('restaurantId');
    if (this.restaurantId) {
      this.restaurantInfo = this.restaurantsService.getRestaurantById(this.restaurantId);
    }
    // storing cart items count
    this.cartItemsScription = this.cartService.getItemsListener().subscribe(itemsMap => {
      if (itemsMap.size > 0) {
        this.cartItemsCounter = itemsMap.size;
      } else {
        this.cartItemsCounter = 0;
      }
    });
  }
  /**
   * @ignore
   */
  navigateToCheckout() {
    this.router.navigate(['/checkout', this.restaurantId]);
  }
  /**
   * @ignore
   * method to open dailog model for adding item
   */
  onAddItem() {
    this.dailog.open(AddItemComponent, {
      width: '900px',
      height: 'fit-content',
      data: {
        restaurantInfo: this.restaurantInfo,
        type: 'add'
      }
    }).afterClosed().subscribe((result) => {
      if (result.status === 'success') {
        // Add logic to handle success case if any in future
      }
    });
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.cartItemsScription) {
      this.cartItemsScription.unsubscribe();
    }
  }
}
