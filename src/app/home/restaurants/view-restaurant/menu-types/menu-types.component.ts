import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITEM_CATEGORY } from 'src/app/shared/common/constants';

@Component({
  selector: 'app-menu-types',
  templateUrl: './menu-types.component.html',
  styleUrls: ['./menu-types.component.scss']
})
export class MenuTypesComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  subScriptions: Array<Subscription> = [];
  /**
   * @ignore
   */
  routeUrl: string;
  /**
   * @ignore
   */
  menuTypes = [
    ITEM_CATEGORY.STARTERS.charAt(0).toUpperCase() + ITEM_CATEGORY.STARTERS.slice(1),
    ITEM_CATEGORY.BIRYANIES.charAt(0).toUpperCase() + ITEM_CATEGORY.BIRYANIES.slice(1),
    ITEM_CATEGORY.DESSERTS.charAt(0).toUpperCase() + ITEM_CATEGORY.DESSERTS.slice(1)
  ]
  /**
   * @ignore
   */
  public get ITEM_CATEGORY(): typeof ITEM_CATEGORY {
    return ITEM_CATEGORY;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // by default navigate to starters once component is loaded
    this.prepareRoute('starters');
  }
  /**
   * @ignore
   */
  onClickMenuType(menuType) {
    switch (menuType) {
      case ITEM_CATEGORY.STARTERS:
        this.prepareRoute('starters');
        break;
      case ITEM_CATEGORY.BIRYANIES:
        this.prepareRoute('biryanis');
        break;
      case ITEM_CATEGORY.DESSERTS:
        this.prepareRoute('desserts');
        break;
    }
  }
  /**
   * @ignore
   */
  private prepareRoute(url: string) {
    this.router.navigate(['items', url], { relativeTo: this.route });
    this.getActiveRouteClass();
  }
  /**
   * @ignore
   */
  private getActiveRouteClass() {
    this.subScriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.routeUrl = event.url;
      }
    }));
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subScriptions.length > 0) {
      this.subScriptions.forEach(subscription => {
        subscription.unsubscribe();
      })
    }
  }
}
