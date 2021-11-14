import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { HOME_ROUTING } from "./home-routing.constants";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

// Routes configurations
const routes: Routes = [HOME_ROUTING];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // App sub feature modules
    SharedModule
  ],
  exports: [
    RouterModule,
    HomeComponent
  ],
  entryComponents: [],
  providers: []
})
export class HomeModule { }
