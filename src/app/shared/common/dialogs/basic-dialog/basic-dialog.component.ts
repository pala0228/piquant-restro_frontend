import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.scss']
})
export class BasicDialogComponent implements OnInit {
  /**
   * @ignore
   * Object to show action button
   */
  actionButton = '';
  /**
   * @ignore
   * Object to show cancel button
   */
  cancelButton = '';
  /**
   * @ignore
   * Object to show message
   */
  message = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<BasicDialogComponent>
  ) {
    this.dialogRef.disableClose = true;
    if (this.data) {
      this.message = this.data.message;
      this.actionButton = this.data.actionButton;
      this.cancelButton = this.data.cancelButton;
    }
  }

  ngOnInit() {
  }
  /**
   * @ignore
   * Method to close dialog with status as cancel
   */
  onCancel() {
    this.dialogRef.close({ status: 'cancel' });
  }
  /**
   * @ignore
   * Method to close dialog with status as proceed.
   */
  onAction() {
    this.dialogRef.close({ status: 'proceed' });
  }
}
