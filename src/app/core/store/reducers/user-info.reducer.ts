import * as UserInfoActions from '../actions/user-info.action';
import { UserInfo } from '../models/user-info.model';
import { InitialState } from '../state/user-info.state';

/**
 * @ignore
 * Reducers takes the incoming action and decide what to do with it.
 */
export function UserInfoReducer(state = InitialState, action: UserInfoActions.Actions): UserInfo {
  switch (action.type) {
    case UserInfoActions.UPDATE_USER_INFO:
      return {
        userId: action.payload && action.payload.userId || "",
        email: action.payload && action.payload.email || "",
        password: action.payload && action.payload.password || "",
        firstName: action.payload && action.payload.firstName || "",
        lastName: action.payload && action.payload.lastName || "",
        userType: action.payload && action.payload.userType || "",
        DOB: action.payload && action.payload.DOB || "",
        contactNumber: action.payload && action.payload.contactNumber || "",
        address: action.payload && action.payload.address || "",
        restaurants: action.payload && action.payload.restaurants || []
      }
    default:
      return state;
  }
}
