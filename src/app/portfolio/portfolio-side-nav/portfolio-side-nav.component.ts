import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio-side-nav',
  templateUrl: './portfolio-side-nav.component.html',
  styleUrls: ['./portfolio-side-nav.component.scss']
})
export class PortfolioSideNavComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  activeRoute = '';
  /**
   * @ignore
   */
  routeSubsription: Subscription;
  /**
   * @ignore
   */
  @Output() closeSidenav = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // by default activate home router name
    this.activeRoute = "biography";
    // getting active route url
    this.routeSubsription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }
  /**
   * @ignore
   */
  closeSideNav() {
    this.closeSidenav.emit();
  }
  /**
   * @ignore
   */
  navigateTo(childRoute) {
    this.closeSideNav();
    this.router.navigate([childRoute], { relativeTo: this.activatedRoute });
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.routeSubsription) {
      this.routeSubsription.unsubscribe();
    }
  }

}
