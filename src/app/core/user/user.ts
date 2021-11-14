import { StorageType } from './user.constants';
import { User, UserToken, UserAccessList } from './user.model';

export class UserStorage {
  private static userMap = new Map();
  /**
   * @ignore
   * Method to set map values
   * @param key
   * @param value
   */
  static set(key: StorageType, value: User | UserToken | UserAccessList): boolean {
    this.userMap.set(key, value);
    return true;
  }
  /**
   * @ignore
   * Method to get key value
   * @param key
   */
  static get(key: StorageType): any {
    if (this.userMap.has(key)) {
      const data = this.userMap.get(key);
      if (data) {
        return data;
      }
    }
    return false;
  }
  /**
   * @ignore
   * Method to remove key values
   * @param key
   */
  static remove(key: StorageType): boolean {
    if (this.userMap.has(key)) {
      this.userMap.delete(key);
      return true;
    }
    return false;
  }
  /**
   * @ignore
   * Method to remove all keys from userMap
   */
  static removeAll() {
    this.userMap.clear();
    return true;
  }
}
