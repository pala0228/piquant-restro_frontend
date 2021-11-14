import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Restaurant } from './home.model';

const BACKEND_URL = environment.apiUrl + "/api/restaurants/";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  /**
   * @ignore
   * Restaurants data will be usefull to get restaurant by its id.
   */
  restaurantsData: Array<Restaurant> = [];

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Method to get all available restaurants from database.
   */
  getRestaurants(currentPage: number, itemsPerPage: number, userType: string): Observable<any> {
    const queryParams = `?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`

    return this.http.post<any>(BACKEND_URL + "available" + queryParams, { userType: userType })
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
}
