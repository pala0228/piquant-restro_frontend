import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { Constants } from './restaurants.constants';
import { RestaurantsService } from './restaurants.service';

@Injectable({
  providedIn: "root",
})
export class RestaurantsResolverService implements Resolve<any> {
  constructor(private restaurantsService: RestaurantsService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const observableArray: Observable<any>[] = [];
    /**
     * By this approach, we can subscribe to more than one API calls
     * and get results
     */
    observableArray.push(
      this.restaurantsService.getUserIdleAndTimeoutDetails(
        Constants.LOGOUT_TIME_CODE_ID
      )
    );

    return forkJoin(observableArray).pipe(
      map((result) => {
        return {
          timeoutDetails: result[0],
        };
      })
    );
  }
}
