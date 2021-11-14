import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    public dailogRef: MatDialogRef<LogoutComponent>
  ) {
    this.dailogRef.disableClose = true;
  }

  ngOnInit() {
  }
  /**
   * @ignore
   * Method to close dialog model without any action
   */
  onCancel() {
    this.dailogRef.close({ action: 'cancel' });
  }
  /**
   * @ignore
   * Method to perform logout action and logout user to home page
   */
  onLogout() {
    this.dailogRef.close({ action: 'logout' });
  }
}
