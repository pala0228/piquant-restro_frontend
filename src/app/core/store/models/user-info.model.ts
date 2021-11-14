import { Restaurant } from 'src/app/home/restaurants/restaurants.model';

/**
 * @ignore
 * Data model for user info
 */
export interface UserInfo {
  userId: string;
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
