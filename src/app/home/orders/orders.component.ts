import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AccessMatrixConstants } from 'src/app/core/access-matrix/access-matrix.constants';
import { PiquantHasAccess } from 'src/app/core/auth/authorization.decorator';
import { SharedService } from 'src/app/shared/shared.service';
import { ORDERS_PER_PAGE, TABLE_STATE } from './orders.constants';
import { InvoiceData, Order } from './orders.model';
import { OrdersService } from './orders.service';
import { ViewItemsComponent } from './view-items/view-items.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  /**
   * @ignore
   */
  dataSource = new MatTableDataSource();
  /**
   * @ignore
   */
  displayedColumns: Array<string> = ['restaurantName', 'address', 'items', 'totalItemsCost', 'GST', 'createdOn', 'createdBy', 'paymentStatus', 'viewItems', 'action']
  /**
   * @ignore
   */
  ordersList: Array<Order> = [];
  /**
   * @ignore
   */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /**
   * @ignore
   */
  pageSize = ORDERS_PER_PAGE;
  /**
   * @ignore
   */
  currentPage: number = 1;
  /**
   * @ignore
   */
  pageSizeOptions: Array<number> = [];
  /**
   * @ignore
   */
  totalOrders: number;
  /**
   * @ignore
   */
  public TABLE_STATE(): typeof TABLE_STATE {
    return TABLE_STATE;
  }
  /**
   * @ignore
   */
  tableState: number = TABLE_STATE.LOADING;
  /**
   * @ignore
   */
  invoiceData: InvoiceData;
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
  /**
   * @ignore
   * Checking access
   */
  @PiquantHasAccess(AccessMatrixConstants.DOWNLOAD_INVOICE)
  hasDownloadInvoiceAccess: boolean;

  constructor(
    private dialog: MatDialog,
    private ordersService: OrdersService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // activating loader inside table
    this.tableState = TABLE_STATE.LOADING;

    // getting orders placed for user to review
    this.getOrders(this.currentPage, this.pageSize, true);
  }
  /**
   * @ignore
   * Method to download invoice
   */
  onDownloadInvoice(row: Order) {
    // Basic initializations required
    this.sharedService.activatePartialLoader(true);
    this.showScreen = false;
    this.message = '';
    this.status = '';

    // required input to hit API
    this.invoiceData = {
      cartId: row.id,
      items: row.items.map(object => {
        return {
          itemName: object.itemName,
          quantity: object.itemQuantity,
          totalItemsCost: object.itemTotalPrice
        }
      }),
      subtotal: row.totalItemsCost,
      GST: row.GST,
      paid: row.totalItemsCost,
      invoiceNumber: row.invoiceNumber,
      createdOn: row.createdOn
    }

    this.ordersService.downloadInvoice(this.invoiceData).subscribe((httpResponse: any) => {
      if (httpResponse.type === HttpEventType.Response) {

        this.sharedService.activatePartialLoader(false);
        let input = {
          showSnackbar: true,
          message: 'Download of an invoice has started.',
          status: 'success'
        }
        // Activating snack bar through service
        this.sharedService.activateSnackbar(input);

        const hiddenElement = document.createElement('a');
        hiddenElement.href = window.URL.createObjectURL(httpResponse.body);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Invoice_' + this.invoiceData.invoiceNumber + '.pdf';
        hiddenElement.click();
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
   * Method to get orders list
   */
  private getOrders(currentPage, pageSize, flag?: boolean) {
    // Basic initializations required
    this.ordersList = [];
    this.showScreen = false;
    this.message = '';
    this.status = '';

    this.ordersService.getOrders(currentPage, pageSize).subscribe((httpResponse: any) => {
      if (httpResponse.status.code === 200) {
        this.ordersList = httpResponse.response.ordersList;
        this.totalOrders = httpResponse.response.totalOrders;
        if (this.ordersList.length > 0) {
          this.tableState = TABLE_STATE.DATAFOUND;
        } else {
          this.tableState = TABLE_STATE.NODATAFOUND;
        }

        // constructing page size options
        if (this.totalOrders && flag) {
          let itemsforPage = ORDERS_PER_PAGE;
          if ((this.totalOrders / itemsforPage) < 1) {
            this.pageSizeOptions.push(this.totalOrders);
          } else {
            for (let i = 1; itemsforPage <= this.totalOrders; i++) {
              this.pageSizeOptions.push(itemsforPage);
              itemsforPage += (itemsforPage);
            }
          }
        }
        this.dataSource.data = this.ordersList;

        // Activating snack bar through service
        let input = {
          showSnackbar: true,
          message: httpResponse.status.message,
          status: 'success'
        }
        this.sharedService.activateSnackbar(input);
      }
    }, (error) => {
      if (error.error && error.error.status) {
        this.errorMessage(error.error.status.message);
      } else {
        this.errorMessage(null);
      }
    })
  }
  /**
   * @ignore
   */
  onViewItems(row) {
    this.dialog.open(ViewItemsComponent, {
      width: '900px',
      height: 'fit-content',
      data: {
        items: row.items
      }
    }).afterClosed().subscribe(result => {
      // TODO: logic to handle closing model view based on action made by user
    });
  }
  /**
   * @ignore
   * method to trigger pagination data and load restaurants accordingly.
   */
  onChangePage(event: PageEvent) {
    this.dataSource.data = [];
    // activating loader inside table
    this.tableState = TABLE_STATE.LOADING;

    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrders(this.currentPage, this.pageSize);
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

}
