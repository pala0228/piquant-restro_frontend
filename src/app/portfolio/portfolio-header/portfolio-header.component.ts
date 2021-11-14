import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio-header',
  templateUrl: './portfolio-header.component.html',
  styleUrls: ['./portfolio-header.component.scss']
})
export class PortfolioHeaderComponent implements OnInit, OnDestroy {
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
   * Event emmitter to trigger event to outside world
   */
  @Output() activateSidenav = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
  navigateTo(childRoute) {
    this.router.navigate([childRoute], { relativeTo: this.activatedRoute });
  }
  /**
   * @ignore
   * Method to open side nav
   */
  openSideNav() {
    this.activateSidenav.emit(true);
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
