import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from '@ngrx/store';
import { UserInfoReducer } from './store/reducers/user-info.reducer';


@NgModule({
  declarations: [],
  imports: [
    // Angular built in modules
    CommonModule,
    // App sub feature modules
    StoreModule.forRoot({ userInfo: UserInfoReducer })
  ],
  exports: [],
  entryComponents: [],
})
export class CoreModule { }
