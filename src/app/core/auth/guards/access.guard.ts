import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccessMatrixService } from '../../access-matrix/access-matrix.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(
    private accessMatrixService: AccessMatrixService
  ) { }

  /**
   * @ignore
   * Method to allow user to visit page or not based on access Id passed in.
   */
  canActivate(
    activatedRouteSnacpshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // This will be passed from the route config on the data property
    const accessId = activatedRouteSnacpshot.data.accessId;
    // if no accessId provided, consider access is granted(true) else check access
    // throught access matrix service
    const hasAccess = !accessId || this.accessMatrixService.hasAccess(accessId);
    // if access not allowed, show dialog with message
    if (!hasAccess) {
      this.accessMatrixService.showAccessGurardPopup();
      return false;
    }
    return true;
  }

}
