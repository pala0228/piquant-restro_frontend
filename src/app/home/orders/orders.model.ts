import { Status } from 'src/app/shared/shared.model';

/**
 * @ignore
 */
export interface Order {
  id: string;
  restaurantName: string;
  restaurantId: string;
  address: string;
  restaurantImage: string;
  items: OrderItem[];
  totalItemsCost: number;
  discountedCost: number;
  GST: number;
  invoiceNumber: string;
  createdOn: Date;
  createdBy: string;
  paymentStatus: string;
}
/**
 * @ignore
 */
export interface OrderItem {
  srNo?: number;
  id: string;
  itemName: string;
  itemPrice: number;
  itemCategory: string;
  itemQuantity: number;
  itemTotalPrice: number;
}
/**
 * @ignore
 */
export interface OrdersListResponse {
  response: OrdersList;
  status: Status;
}
/**
 * @ignore
 */
export interface OrdersList {
  ordersList: Array<Order>;
  totalOrders: number;
}
/**
 * @ignore
 */
export interface InvoiceData {
  cartId: string;
  items: Array<PurchedItem>;
  subtotal: number;
  paid: number;
  GST: number;
  invoiceNumber: string;
  createdOn: Date;
}
/**
 * @ignore
 */
export interface PurchedItem {
  itemName: string;
  quantity: number;
  totalItemsCost: number;
}
