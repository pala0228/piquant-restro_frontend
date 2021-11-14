import { Action } from "@ngrx/store";
import { UserInfo } from '../models/user-info.model';
/**
 * @ignore
 * Declaring the action type
 */
export const UPDATE_USER_INFO = "[USER_INFO] Update";
/**
 * @ignore
 * Class which update User payload data when data passed in.
 */
export class UpdateUserInfo implements Action {
  readonly type = UPDATE_USER_INFO;
  constructor(public payload: UserInfo) { }
}
/**
 * @ignore
 * Declaring the all actions into type Actions to be accessed in reducer section easilly
 */
export type Actions = UpdateUserInfo;
