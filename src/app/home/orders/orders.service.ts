import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { InvoiceData } from './orders.model';

const BACKEND_URL = environment.apiUrl + "/api/orders/";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient
  ) { }
  /**
   * http method to get all available cart orders
   */
  getOrders(currentPage: number, itemsPerPage: number): Observable<any> {
    // adding query params to route.
    const queryParams = `?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`
    return this.http.get<any>(BACKEND_URL + "search" + queryParams)
      .pipe(map((data) => data), catchError((error) => throwError(error)));
  }
  /**
   * method to download invoice pdf
   */
  downloadInvoice(invoiceData: InvoiceData): Observable<any> {
    return this.http.post(BACKEND_URL + "download-invoice", invoiceData,
      {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
        headers: new HttpHeaders({
          'Content-type': 'application/json'
        })
      }
    ).pipe(catchError((error) => throwError(error)))
  }
}
