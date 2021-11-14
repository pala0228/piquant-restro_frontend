import { UserStorage } from '../user/user';
import { StorageType } from '../user/user.constants';

/**
 * @ignore
 * Function to create property on the object and return value
 *
 * This decorator will set the property `true` or `false` based on funcId
 * passed in as input
 */
export function PiquantHasAccess(funcId: string) {
  return (target: object, key: string) => {
    let hasAccess: boolean;
    Object.defineProperty(target, key, {
      configurable: false,
      get: () => {
        // getting user access list
        const userAccessList = UserStorage.get(StorageType.USER_ACCESS) as Array<string>;
        if (userAccessList && userAccessList.length > 0) {
          // if the user access list contains funcId, then return `true` else `false`
          hasAccess = userAccessList.indexOf(funcId) !== -1;
        } else {
          hasAccess = false;
        }
        return !!hasAccess;
      }
    });
  }
}
