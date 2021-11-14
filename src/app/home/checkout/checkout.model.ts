import { Status } from 'src/app/shared/shared.model';
import { Item, Restaurant } from '../restaurants/restaurants.model';

export interface Checkout {
  totalPayable: number;
  restaurantInfo: Restaurant;
  cartItems: Array<Item>;
  discountPrice: number;
  GST: number;
}
export interface Cart {
  restaurantId: string;
  restaurantName: string;
  restaurantSubTitle: string;
  restaurantAddress: string;
  restaurantImage: string;
  creator: string;
  discountPrice: number;
  GST: number;
  totalPayableAmount: number;
  cartItems: Array<CartItem>;
  invoiceNumber: string;
}
export interface CartItem {
  itemName: string;
  itemPrice: string;
  itemCategory: string;
  itemQuantity: number;
  itemTotalPrice: string;
  createdOn: Date;
}
export interface CartResponse {
  response: Response;
  status: Status;
}
export interface Response {
  cart: Array<any>;
  sessionId: string;
}
