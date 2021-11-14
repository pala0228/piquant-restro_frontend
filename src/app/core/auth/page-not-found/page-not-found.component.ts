import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.redirect();
  }
  /**
   * @ignore
   * method to re-direct user to restaurants page if authenticated
   * or else home page by logging off.
   */
  private redirect() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/restaurants']);
      return;
    }
    this.authService.logoutUser();
    this.router.navigate(['/home']);
  }

}
