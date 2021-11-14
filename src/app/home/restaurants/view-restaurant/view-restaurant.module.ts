import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { VIEW_RESTAURANT_ROUTING } from './view-restaurant-routing.constants';
import { ViewRestaurantComponent } from './view-restaurant.component';
import { AddItemComponent } from './add-item/add-item.component';
import { MenuTypesComponent } from './menu-types/menu-types.component';
import { CartModule } from './cart/cart.module';
import { ItemsModule } from './items/items.module';

// Routes configuration
const routes: Routes = [VIEW_RESTAURANT_ROUTING];

@NgModule({
  declarations: [
    ViewRestaurantComponent,
    AddItemComponent,
    MenuTypesComponent,
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
    CartModule,
    ItemsModule
  ],
  exports: [
    RouterModule,
    ViewRestaurantComponent,
    AddItemComponent,
    MenuTypesComponent,
  ],
  entryComponents: [
    AddItemComponent
  ],
})
export class ViewRestaurantModule { }
