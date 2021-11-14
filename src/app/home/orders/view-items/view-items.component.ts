import { Optional } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_STATE } from '../orders.constants';
import { OrderItem } from '../orders.model';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss']
})
export class ViewItemsComponent implements OnInit {
  /**
   * @ignore
   * Mat table date source to feed data to table
   */
  dataSource = new MatTableDataSource();
  /**
   * @ignore
   * Array to hold column names
   */
  displayedColumns: Array<string> = ['srNo', 'itemName', 'itemPrice', 'itemQuantity', 'itemTotalPrice'];
  /**
   * @ignore
   * Array to hold ordered items information
   */
  orderItems: Array<OrderItem> = [];
  /**
   * @ignore
   * Object to decided table state(loading, data loaded, no data found)
   */
  tableState: number = TABLE_STATE.LOADING;
  /**
   * @ignore
   */
  public TABLE_STATE(): typeof TABLE_STATE {
    return TABLE_STATE;
  }
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
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ViewItemsComponent>
  ) {
    this.dialogRef.disableClose = true;
    this.orderItems = this.data.items;
  }

  ngOnInit() {
    // update table state based on orderitems availability
    if (this.orderItems.length > 0) {
      this.tableState = TABLE_STATE.DATAFOUND;
    } else {
      this.tableState = TABLE_STATE.NODATAFOUND;
    }
    // update serial numbers to each item
    this.orderItems.forEach((orderItem, index) => {
      orderItem.srNo = index + 1;
    });
    // feed data to mat table
    this.dataSource.data = this.orderItems;
  }
  /**
   * @ignore
   * Method to close dialog model
   */
  onClose() {
    this.dialogRef.close({ action: 'close' });
  }
  /**
   * @ignore
   * Method to get total cost of ordered items
   */
  getTotalCostSum() {
    return this.orderItems.reduce((preValue, currValue) => preValue + currValue.itemTotalPrice, 0);
  }

}
