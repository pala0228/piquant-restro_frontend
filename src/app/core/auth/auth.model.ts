import { Restaurant } from 'src/app/home/restaurants/restaurants.model';
import { Status } from 'src/app/shared/shared.model';
import { User, UserToken } from '../user/user.model';

/**
 * @ignore
 */
export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  DOB: Date;
  contactNumber: string;
  address: string;
  restaurants?: Array<Restaurant>;
  createdAt?: Date;
  updatedAt?: Date;
}
/**
 * @ignore
 */
export interface SignUpResponse {
  response: SignUpResponseData;
  status: Status;
}
/**
 * @ignore
 */
export interface SignUpResponseData {
  user: User;
}
/**
 * @ignore
 */
export interface LoginInput {
  email: string;
  password: string;
}
/**
 * @ignore
 */
export interface LoginResponse {
  response: UserToken;
  status: Status;
}
/**
 * @ignore
 */
export interface VerificationInput {
  email: string;
  contactNumber: number;
}
/**
 * @ignore
 */
export interface VerificationResponse {
  response: Response;
  status: Status;
}
/**
 * @ignore
 */
export interface Response {
  verificationData: VerificationData
}
/**
 * @ignore
 */
export interface VerificationData {
  verificationCode: number;
  updatedOn: Date;
}
/**
 * @ignore
 */
export interface NewPasswordInfo {
  email: string;
  newPassword: string;
}
/**
 * @ignore
 */
export interface NewPasswordUpdateResponse {
  response: {
    message: string;
  },
  status: Status;
}
