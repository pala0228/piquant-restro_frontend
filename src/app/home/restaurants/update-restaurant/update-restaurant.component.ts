import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantsService } from '../restaurants.service';
import { Restaurant } from '../restaurants.model';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';

@Component({
  selector: 'app-update-restaurant',
  templateUrl: './update-restaurant.component.html',
  styleUrls: ['./update-restaurant.component.scss']
})
export class UpdateRestaurantComponent implements OnInit {
  /**
   * @ignore
   * restaurantInfo to hold all info based on id received in by route.
   */
  restaurantInfo: Restaurant;
  /**
   * @ignore
   * View child of add restaurant component
   */
  @ViewChild('addRestaurant', { static: false }) addRestaurant: AddRestaurantComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantsService: RestaurantsService
  ) { }

  ngOnInit() {
    // Accessing restaurant id from activate route
    const restaurantId = this.activatedRoute.snapshot.paramMap.get('restaurantId');
    if (restaurantId) {
      this.restaurantInfo = this.restaurantsService.getRestaurantById(restaurantId);
    }
  }
  /**
   * @ignore
   */
  onUpdate() {
    if (this.addRestaurant.addRestaurantFrom.invalid) {
      return;
    }
    this.addRestaurant.onAdd();
  }

}
