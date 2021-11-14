import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   * Object to hold pate title
   */
  title = 'piquant';
  /**
   * @ignore
   * Flag to show and hide snack bar
   */
  showSnackbar = false;
  /**
   * @ignore
   * Object to show message on snack bar
   */
  message = ''
  /**
   * @ignore
   * Flag to open type of snack bar(error/success/warning/info)
   */
  status = '';
  /**
   * @ignore
   * Subscription for snackbar observable
   */
  snackbarSubscription: Subscription;
  /**
   * @ignore
   * Subscription for partial loader observable.
   */
  partialLoaderSubscription: Subscription;
  /**
   * @ignore
   * Flag to show and hide partial loader
   */
  activePartialLoader = false;


  constructor(
    private router: Router,
    private sharedService: SharedService,
    private _translate: TranslateService
  ) {
    this._translate.setDefaultLang('en');
  }

  ngOnInit() {
    // navigating to home component when application is loaded
    this.router.navigate(['/home']);
    // snackbar subscription
    this.snackbarSubscription = this.sharedService.getSnackbarObservable().subscribe(data => {
      this.showSnackbar = data.showSnackbar;
      this.message = data.message;
      this.status = data.status;
    });
    // partial loader subscription
    this.partialLoaderSubscription = this.sharedService.getPartialLoaderObservable().subscribe((flag: boolean) => {
      this.activePartialLoader = flag;
    });
  }
  /**
   * @ignore
   * Method to navigate to portfolio
   */
  navigateTo(parentRoute, childRoute) {
    this.router.navigate([parentRoute, childRoute]);
  }
  /**
   * @ignore
   * Method to close snackbar manually
   * @param flag
   */
  close(flag) {
    this.showSnackbar = flag;
  }
  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.snackbarSubscription) {
      this.snackbarSubscription.unsubscribe();
    }
    if (this.partialLoaderSubscription) {
      this.partialLoaderSubscription.unsubscribe();
    }
  }
}
