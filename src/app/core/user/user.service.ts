import { Injectable } from '@angular/core';
import { UserStorage } from './user';
import { StorageType } from './user.constants';
import { User, UserToken, UserAccessList } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  /**
   * Method to set key and value.
   * @param key
   * @param value
   */
  set(key: StorageType, value: User | UserToken | UserAccessList): boolean {
    return UserStorage.set(key, value);
  }
  /**
   * Method to get value based on key.
   * @param key
   */
  get(key: StorageType): User | UserToken | UserAccessList | any {
    return UserStorage.get(key);
  }
  /**
   * Method to remove value based on key.
   * @param key
   */
  remove(key: StorageType): User | UserToken | UserAccessList | any {
    return UserStorage.remove(key);
  }
  /**
   * Method to remove all key and value pairs for userMap.
   */
  removeAll() {
    return UserStorage.removeAll()
  }
}
