import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewItemsComponent } from './view-items/view-items.component';
import { OrdersComponent } from './orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { ORDERS_ROUTING } from './orders-routing.constants';

// routes configuration
const routes: Routes = [ORDERS_ROUTING];

@NgModule({
  declarations: [
    OrdersComponent,
    ViewItemsComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    // App sub feature modules
    SharedModule
  ],
  exports: [
    RouterModule,
    OrdersComponent,
    ViewItemsComponent
  ],
  entryComponents: [
    ViewItemsComponent
  ]
})
export class OrdersModule { }
