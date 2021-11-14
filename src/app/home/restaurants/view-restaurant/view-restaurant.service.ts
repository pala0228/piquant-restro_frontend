import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddItem, ItemCRUDResponse, FetchItemsResponse } from './view-restaurant.model';

const BACKEND_URL = environment.apiUrl + "/api/item/";

@Injectable({
  providedIn: 'root'
})
export class ViewRestaurantService {

  constructor(private http: HttpClient) { }
  /**
   * http method to add item to the restaurant
   */
  addItem(itemInfo: AddItem): Observable<ItemCRUDResponse> {
    return this.http.post<ItemCRUDResponse>(BACKEND_URL + "add", itemInfo)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * http method to get food items based on restaurantId and item category
   */
  getFoodItems(restaurantId: string, itemCategory: string): Observable<FetchItemsResponse> {
    const queryParams = `?restaurantId=${restaurantId}&itemCategory=${itemCategory}`
    return this.http.get<any>(BACKEND_URL + "search" + queryParams)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * http method to update item by id
   */
  updateItem(itemInfo: AddItem, itemId: string): Observable<ItemCRUDResponse> {
    return this.http.put<ItemCRUDResponse>(BACKEND_URL + "update/" + itemId, itemInfo)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * method to delete item by id
   */
  deleteItem(itemId: string, restaurantId: string): Observable<ItemCRUDResponse> {
    const queryParams = `?itemId=${itemId}&restaurantId=${restaurantId}`;
    return this.http.delete<ItemCRUDResponse>(BACKEND_URL + "delete" + queryParams)
      .pipe(map((data) => data), catchError((error) => throwError(error)))
  }
}
