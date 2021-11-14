import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITEM_CATEGORY } from 'src/app/shared/common/constants';
import { SharedService } from 'src/app/shared/shared.service';
import { Item, Restaurant } from '../../restaurants.model';
import { AddItem, ItemCRUDResponse } from '../view-restaurant.model';
import { ViewRestaurantService } from '../view-restaurant.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  /**
   * @ignore
   */
  addItemForm: FormGroup;
  /**
   * @ignore
   */
  restaurantInfo: Restaurant;
  /**
   * @ignore
   */
  itemInfo: AddItem;
  /**
   * @ignore
   */
  public get ITEM_CATEGORY(): typeof ITEM_CATEGORY {
    return ITEM_CATEGORY;
  }
  /**
   * @ignore
   */
  type: string = '';
  /**
   * @ignore
   */
  item: Item;
  /**
   * @ignore
   * Flag to activate partial loader
   */
  activePartialLoader = true;
  /**
   * @ignore
   * Flag to show info screen component
   */
  showScreen = false;
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

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddItemComponent>,
    private viewRestaurantService: ViewRestaurantService,
    private sharedService: SharedService
  ) {
    this.dialogRef.disableClose = true;
    this.type = this.data.type;
    switch (this.type) {
      case 'add':
        this.restaurantInfo = this.data.restaurantInfo;
        break;
      case 'edit':
        this.item = this.data.itemInfo;
        break;
    }
  }

  ngOnInit() {
    // form controls registrations
    this.addItemForm = new FormGroup({
      itemName: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ]+$/)
      ]),
      itemPrice: new FormControl("", [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern(/^[0-9]+$/)
      ]),
      offerCode: new FormControl({ value: this.type === 'edit' ? this.item.offerCode : this.restaurantInfo.offerCode, disabled: true }),
      offerPercent: new FormControl({ value: this.type === 'edit' ? this.item.offerPercent : this.restaurantInfo.offerPercent, disabled: true }, [
        Validators.maxLength(2),
        Validators.pattern(/^[0-9]+$/)
      ]),
      itemCategory: new FormControl("", [Validators.required])
    });
    // Activating partial loader
    this.activePartialLoader = true;
    // update form with data received on edit and add mode
    switch (this.type) {
      case 'add':
        this.updateForm(this.restaurantInfo)
        break;
      case 'edit':
        this.updateFormData(this.item);
        break;
    }
    // Stopping partial loader
    this.activePartialLoader = false;
  }
  /**
   * @ignore
   * on click of reset()
   */
  onClear() {
    // Hide info component if activated
    if (this.showScreen) {
      this.showScreen = !this.showScreen;
      this.status = null;
      this.message = null;
    }

    this.addItemForm.reset();
    // update form with data received
    let activeItemData = this.type === 'edit' ? this.item : this.restaurantInfo;
    this.updateForm(activeItemData);
  }
  /**
   * @ignore
   * on click of addItem
   */
  onAddItem() {
    if (this.addItemForm.invalid) {
      return;
    }
    // Basic initializations required
    this.activePartialLoader = true;
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.itemInfo = {
      itemName: this.addItemForm.value.itemName.charAt(0).toUpperCase() + this.addItemForm.value.itemName.slice(1),
      itemPrice: this.addItemForm.value.itemPrice,
      offerCode: this.addItemForm.get('offerCode').value,
      offerPercent: this.addItemForm.get('offerPercent').value,
      itemCategory: this.addItemForm.value.itemCategory,
      restaurantId: this.type === 'edit' ? this.item.restaurant : this.restaurantInfo.id,
      restaurantImagePath: this.type === 'add' ? this.restaurantInfo.imagePath : ''
    };

    if (this.type === 'add') {
      this.viewRestaurantService.addItem(this.itemInfo).subscribe((httpResponse: ItemCRUDResponse) => {
        if (httpResponse.status.code === 201) {
          this.activePartialLoader = false;
          let input = {
            showSnackbar: true,
            message: httpResponse.status.message,
            status: 'success'
          }
          // Activating snack bar through service
          this.sharedService.activateSnackbar(input);
          this.dialogRef.close({ status: 'add', item: httpResponse.response.item });
        }
      }, (error) => {
        if (error.error && error.error.status) {
          this.errorMessage(error.error.status.message);
        } else {
          this.errorMessage(null);
        }
      });
    } else if (this.type === 'edit') {
      this.viewRestaurantService.updateItem(this.itemInfo, this.item.id).subscribe((httpResponse: ItemCRUDResponse) => {
        if (httpResponse.status.code === 200) {
          this.activePartialLoader = false;
          let input = {
            showSnackbar: true,
            message: httpResponse.status.message,
            status: 'success'
          }
          // Activating snack bar through service
          this.sharedService.activateSnackbar(input);
          this.dialogRef.close({ status: 'edit', item: httpResponse.response.item });
        }
      }, (error) => {
        if (error.error && error.error.status) {
          this.errorMessage(error.error.status.message);
        } else {
          this.errorMessage(null);
        }
      });
    }
  }
  /**
   * @ignore
   * method to cancel action
   */
  onCancel() {
    this.dialogRef.close({ status: 'cancel' });
  }
  /**
   * @ignore
   */
  updateFormData(item) {
    this.addItemForm.get('itemName').setValue(item.itemName);
    this.addItemForm.get('itemPrice').setValue(item.itemPrice);
    this.addItemForm.get('itemCategory').setValue(item.itemCategory);
    this.updateForm(item);
  }
  /**
   * @ignore
   * method to update form data
   */
  updateForm(restaurantInfo: Restaurant | Item) {
    this.addItemForm.get('offerCode').setValue(restaurantInfo.offerCode);
    this.addItemForm.get('offerPercent').setValue(restaurantInfo.offerPercent);
  }
  /**
   * @ignore
   * Method to display error message
   */
  private errorMessage(message) {
    this.showScreen = true;
    this.status = 'error';
    this.message = message;
    this.activePartialLoader = false;
  }

}
