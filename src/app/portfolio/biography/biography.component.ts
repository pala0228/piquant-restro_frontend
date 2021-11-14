import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biography',
  templateUrl: './biography.component.html',
  styleUrls: ['./biography.component.scss']
})
export class BiographyComponent implements OnInit {
  /**
   * @ignore
   */
  totalRelevantYears: number;
  /**
   * @ignore
   */
  totalITExperience: number;
  /**
   * @ignore
   */
  routeSubsription: Subscription;

  constructor(
  ) { }

  ngOnInit() {
    // total IT experience
    this.totalITExperience = new Date().getFullYear() - 2014;
    // total relevant experience
    this.totalRelevantYears = new Date().getFullYear() - 2018;
  }

}
