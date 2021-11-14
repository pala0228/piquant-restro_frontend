import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material/material.module";
import { ConfirmPasswordValidatorDirective } from "./common/directives/confirm-password-validator.directive";
import { PartialComponent } from './common/loaders/partial/partial.component';
import { FullComponent } from './common/loaders/full/full.component';
import { InfoComponent } from './common/screens/info/info.component';
import { SnackbarComponent } from './common/screens/snackbar/snackbar.component';
import { FlexLayoutModule, LayoutGapStyleBuilder } from '@angular/flex-layout';
import { CustomLayoutGapStyleBuilder } from './custom-layout-gap-builder';
import { BasicDialogComponent } from './common/dialogs/basic-dialog/basic-dialog.component';
import { StatusViewPipe } from './common/pipes/status-view.pipe';


@NgModule({
  declarations: [
    ConfirmPasswordValidatorDirective,
    PartialComponent,
    FullComponent,
    InfoComponent,
    SnackbarComponent,
    BasicDialogComponent,
    StatusViewPipe
  ],
  imports: [
    // Angular built in modules
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // Material module
    MaterialModule
  ],
  exports: [
    ConfirmPasswordValidatorDirective,
    PartialComponent,
    FullComponent,
    InfoComponent,
    SnackbarComponent,
    BasicDialogComponent,
    MaterialModule,
    // pipes
    StatusViewPipe
  ],
  entryComponents: [
    BasicDialogComponent
  ],
  providers: [
    { provide: LayoutGapStyleBuilder, useClass: CustomLayoutGapStyleBuilder },
  ]
})
export class SharedModule { }
