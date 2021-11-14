import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITEMS_ROUTING } from './items-routing.constants';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemsComponent } from './items.component';
import { StartersComponent } from './starters/starters.component';
import { DessertsComponent } from './desserts/desserts.component';
import { BiryanisComponent } from './biryanis/biryanis.component';
import { ItemComponent } from './item/item.component';


// Routes configurations
const routes: Routes = [ITEMS_ROUTING];

@NgModule({
  declarations: [
    ItemComponent,
    ItemsComponent,
    StartersComponent,
    DessertsComponent,
    BiryanisComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule
  ],
  exports: [
    RouterModule,
    ItemComponent,
    ItemsComponent,
    StartersComponent,
    DessertsComponent,
    BiryanisComponent
  ],
  entryComponents: [],
})
export class ItemsModule { }
