import { UserInfo } from '../models/user-info.model';

/**
 * @ignore
 * Initializing default state of user info model
 */
export const InitialState: UserInfo = {
  userId: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  userType: "",
  DOB: "",
  contactNumber: "",
  address: "",
  restaurants: []
}
