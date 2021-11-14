import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMAGES } from '../shared/common/constants';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  /**
   * @ignore
   */
  portfolioImagePath = IMAGES.portfolio.url;
  /**
   * @ignore
   */
  portfolioImageTitle = IMAGES.portfolio.title;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // by default load home router
    this.router.navigate(['biography'], { relativeTo: this.activatedRoute });

  }

}
