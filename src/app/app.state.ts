import { UserInfo } from './core/store/models/user-info.model';

/**
 * This is main state for whole application
 * As of now it will consist of UserInfo state, if any new state
 * comes in future then they have to be added here
 */
export interface AppState {
  readonly userInfo: UserInfo;
}
