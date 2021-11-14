import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cart, CartResponse } from './checkout.model';

const BACKEND_URL = environment.apiUrl + "/api/";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private http: HttpClient
  ) { }
  /**
   * http method to store cart items
   */
  storeCartItems(cartInfo: Cart): Observable<CartResponse> {
    return this.http.post<CartResponse>(BACKEND_URL + "cart/create-checkout", cartInfo)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
}
