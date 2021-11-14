import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { UserInfo } from '../models/user-info.model';

/**
 * @ignore
 * While selecting user infor we can simply use 'selectUserInfo' to subscribe and get data
 * ex: this.store.select(selectUserInfo).subscribe(data => {console.log(data)})
 */
export const selectUserInfoState = (state: AppState) => state.userInfo;

export const selectUserInfo = createSelector(selectUserInfoState, (state: UserInfo) => state)
