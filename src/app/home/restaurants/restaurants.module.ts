import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestaurantsComponent } from "./restaurants.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RESTAURANTS_ROUTING } from "./restaurants-routing.constants";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { UpdateRestaurantComponent } from './update-restaurant/update-restaurant.component';

// Routes configuration
const routes: Routes = [RESTAURANTS_ROUTING];

@NgModule({
  declarations: [
    RestaurantsComponent,
    AddRestaurantComponent,
    UpdateRestaurantComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule,
  ],
  exports: [
    RouterModule,
    RestaurantsComponent,
    AddRestaurantComponent,
    UpdateRestaurantComponent
  ],
  entryComponents: [],
})
export class RestaurantsModule { }
