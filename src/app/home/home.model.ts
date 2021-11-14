import { Status } from '../shared/shared.model';

/**
 * @ignore
 */
export interface RestaurantsListResponse {
  response: RestaurantList;
  status: Status;
}
/**
 * @ignore
 */
export interface RestaurantList {
  restaurants: Restaurant[];
  totalRestaurants: string;
}
/**
 * @ignore
 */
export interface Restaurant {
  id: string;
  restaurantTitle: string;
  restaurantSubTitle: string;
  image?: string;
  imagePath: string;
  rating: number;
  deliveryTime: string;
  offerPercent: string;
  offerCode: string;
  address: string;
  items: Item[];
  creator: object
}
/**
 * food item model
 */
export interface Item {
  id: string;
  itemName: string;
  itemPrice: string;
  offerCode: string;
  offerPercent: string;
  itemCategory: string;
  restaurant: string;
  creator: object;
  createdAt: Date;
  updatedAt: Date;
  itemQuantity?: number;
  itemTotalPrice?: string;
}
