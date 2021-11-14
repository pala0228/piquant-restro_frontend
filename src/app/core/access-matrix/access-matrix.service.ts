import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BasicDialogComponent } from 'src/app/shared/common/dialogs/basic-dialog/basic-dialog.component';
import { StorageType } from '../user/user.constants';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccessMatrixService {

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) { }
  /**
   * Method to check access is granted or not for passed in access Id.
   * @param accessId
   */
  hasAccess(accessId: string) {
    // getting user access list stored at the time of login success.
    const userAccessList = this.userService.get(StorageType.USER_ACCESS) as Array<string>;
    if (userAccessList && userAccessList.length > 0) {
      /**
       * return true if accessId found from the user access list saved,
       * otherwise returns false.
       */
      return userAccessList.indexOf(accessId) !== -1;
    }
    return false;
  }
  /**
   * @ignore
   * Method to show popup if page is not allowed to access by the user
   */
  showAccessGurardPopup() {
    this.dialog.open(BasicDialogComponent, {
      width: '400px',
      height: 'fit-content',
      data: {
        message: 'Sorry, You are not allowed to view this page!',
        actionButton: 'Ok',
        cancelButton: null
      }
    });
  }

}
