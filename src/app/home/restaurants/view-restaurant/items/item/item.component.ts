import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccessMatrixConstants } from 'src/app/core/access-matrix/access-matrix.constants';
import { PiquantHasAccess } from 'src/app/core/auth/authorization.decorator';
import { Item } from '../../../restaurants.model';
import { AddItemComponent } from '../../add-item/add-item.component';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  /**
   * input to the component
   */
  @Input() item: Item;
  /**
   * @ignore
   */
  @Output() onDeletedItem = new EventEmitter<string>();
  /**
   * @ignore
   */
  @Output() onChangedItemCategory = new EventEmitter<string>();
  /**
   * @ignore
   * Access to be granted or not
   */
  @PiquantHasAccess(AccessMatrixConstants.EDIT_ITEM)
  hasEditItemAccess: boolean;
  @PiquantHasAccess(AccessMatrixConstants.DELETE_ITEM)
  hasDeleteItemAccess: boolean;


  constructor(
    private dialog: MatDialog,
    private cartService: CartService
  ) { }

  ngOnInit() {
  }
  /**
   * @ignore
   * @param itemId
   */
  onDeleteItem(itemId) {
    if (itemId) {
      this.onDeletedItem.emit(itemId);
      this.cartService.removeItem(itemId);
    }
  }
  /**
   * @ignore
   * @param item
   */
  onEditItem(item) {
    this.dialog.open(AddItemComponent, {
      width: '900px',
      height: 'fit-content',
      data: {
        itemInfo: item,
        type: 'edit'
      }
    }).afterClosed().subscribe((result) => {
      if (result.status === 'edit') {
        if (item.itemCategory !== result.item.itemCategory) {
          this.onChangedItemCategory.emit(result.item._id);
        }
      }
    });
  }
  /**
   * @ignore
   * method to add number of quantity for an item
   */
  onItemAdd(item) {
    item.itemQuantity = 1;
    item.itemTotalPrice = item.itemPrice * item.itemQuantity;
    this.cartService.setItem(item.id, item);
  }
  /**
   * @ignore
   */
  onIncreaseQty(item) {
    item.itemQuantity++;
    item.itemTotalPrice = item.itemPrice * item.itemQuantity;
    this.cartService.setItem(item.id, item);
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
      this.cartService.setItem(item.id, item);
    }
  }
}
