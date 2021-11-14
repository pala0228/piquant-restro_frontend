import { Status } from 'src/app/shared/shared.model';
import { Item } from '../restaurants.model';

/**
 * @ignore
 */
export interface AddItem {
  itemName: string;
  itemPrice: number;
  offerCode?: string;
  offerPercent?: string;
  itemCategory: string;
  restaurantId: string;
  restaurantImagePath: string;
}
export interface ItemCRUDResponse {
  response: ItemData;
  status: Status;
}
export interface ItemData {
  item: Item;
}
export interface FetchItemsResponse {
  response: ItemsData;
  status: Status;
}
export interface ItemsData {
  items: Array<Item>;
}
