import { Status } from "src/app/shared/shared.model";

/**
 * @ignore
 * Input model for add restaurant
 */
export interface AddRestaurant {
  restaurantTitle: string;
  restaurantSubTitle: string;
  image: any;
  rating: number;
  deliveryTime: string;
  offerPercent: string;
  offerCode: string;
  address: string;
}
/**
 * @ignore
 * add restaurant http response model
 */
export interface RestaurantCrudResponse {
  response: RestaurantData;
  status: Status;
}
/**
 * @ignore
 */
interface RestaurantData {
  restaurant: Restaurant
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
