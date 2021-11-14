import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, Observable, BehaviorSubject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { RestaurantCrudResponse, Restaurant, AddRestaurant } from "./restaurants.model";
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/api/restaurants/";

@Injectable({
  providedIn: "root",
})
export class RestaurantsService {
  /**
   * @ignore
   * Restaurants data will be usefull to get restaurant by its id.
   */
  restaurantsData: Array<Restaurant> = [];
  /**
   * @ignore
   * Subject to emit restaurant Id when restaurant information is fetched by its id.
   */
  private restaurantIdSubject = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient,
  ) { }
  /**
   * Method to get all available restaurants from database.
   * if user type is - User or super admin (get all available restaurants)
   * if user type is - Admin (get only restaurants added by him/her)
   */
  getRestaurants(currentPage: number, itemsPerPage: number, userType: string): Observable<any> {
    const queryParams = `?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`

    return this.http.post<any>(BACKEND_URL + "search" + queryParams, { userType: userType })
      .pipe(map((data) => {
        this.restaurantsData = data.response.restaurants.map(obj => {
          return {
            id: obj._id,
            restaurantTitle: obj.restaurantTitle,
            restaurantSubTitle: obj.restaurantSubTitle,
            image: environment.apiUrl + obj.imagePath,
            imagePath: obj.imagePath,
            rating: obj.rating,
            deliveryTime: obj.deliveryTime,
            offerPercent: obj.offerPercent,
            offerCode: obj.offerCode,
            items: obj.items,
            address: obj.address,
            creator: obj.creator
          }
        });
        return {
          response: {
            restaurants: this.restaurantsData,
            totalRestaurants: data.response.totalRestaurants
          },
          status: data.status
        }
      }), catchError((error) => throwError(error)));
  }
  /**
   * @ignore
   * Method to return restaurant based on restaurant Id.
   */
  getRestaurantById(restaurantId: string) {
    this.restaurantIdSubject.next(restaurantId);
    const restaurantInfo = this.restaurantsData.find(object => object.id === restaurantId);
    return restaurantInfo || null;
  }
  /**
   * @ignore
   * Method to return restaurant to outside world.
   */
  getRestaurantId() {
    return this.restaurantIdSubject.asObservable();
  }
  /**
   * Method to add new restaurant information to database.
   */
  addRestaurant(restaurantData: AddRestaurant | FormData): Observable<RestaurantCrudResponse> {
    return this.http.post<RestaurantCrudResponse>(BACKEND_URL + "add", restaurantData)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * Method to update restaurant by id.
   */
  updateRestaurant(restaurantData: AddRestaurant | FormData, restaurantId: string): Observable<RestaurantCrudResponse> {
    return this.http.put<RestaurantCrudResponse>(BACKEND_URL + "update/" + restaurantId, restaurantData)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * Method to delete restaurant by id.
   */
  deleteRestaurant(restaurantId: string): Observable<RestaurantCrudResponse> {
    return this.http.delete<RestaurantCrudResponse>(BACKEND_URL + "delete/" + restaurantId)
      .pipe(map((data) => data), catchError((error) => throwError(error)))
  }
  /**
   * Method to get user idle and time out details based on which
   * user will be auto logged out
   * @param type
   */
  getUserIdleAndTimeoutDetails(type: string) {
    return this.http.get(BACKEND_URL + type)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }

}
