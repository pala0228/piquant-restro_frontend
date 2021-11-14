import { Restaurant } from 'src/app/home/restaurants/restaurants.model';

/**
 * @ignore
 */
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  DOB: string;
  contactNumber: string;
  address: string;
  restaurants: Array<Restaurant>;
}
/**
 * @ignore
 */
export interface UserToken {
  token: string;
  user: any;
}
/**
 * @ignore
 */
export interface UserAccessList {
  accessList: Array<string>;
}
