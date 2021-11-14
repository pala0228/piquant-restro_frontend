import { User } from 'src/app/core/user/user.model';
import { Status } from 'src/app/shared/shared.model';

/**
 * @ignore
 */
export interface UserProfile {
  userId: string;
  contactNumber: number;
  address: string;
}
/**
 * @ignore
 */
export interface UserProfileUpdateResponse {
  response: UserProfileResponse;
  status: Status;
}
/**
 * @ignore
 */
export interface UserProfileResponse {
  user: User;
}
