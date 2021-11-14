import { NgModule } from "@angular/core";
import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatBadgeModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatSelectModule,
  MatGridListModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatMenuModule
} from "@angular/material";

const MATERIAL_COMPONENTS = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatBadgeModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatSelectModule,
  MatGridListModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatMenuModule,
];

@NgModule({
  imports: [MATERIAL_COMPONENTS],
  exports: [MATERIAL_COMPONENTS],
})
export class MaterialModule { }
