import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { CHECKOUT_ROUTING } from './checkout-routing.constants';
import { CheckoutComponent } from './checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { CartModule } from '../restaurants/view-restaurant/cart/cart.module';

// Routes configuration
const routes: Routes = [CHECKOUT_ROUTING];

@NgModule({
  declarations: [
    CheckoutComponent,
    PaymentComponent,
    CartItemsComponent,
    SuccessComponent,
    FailureComponent,
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    CartModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    CheckoutComponent,
    PaymentComponent,
    CartItemsComponent,
    SuccessComponent,
    FailureComponent,
  ],
  entryComponents: [],
})
export class CheckoutModule { }
