import { Inject } from '@angular/core';
import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import TimeCalculator from 'src/app/shared/common/util/time-calculations';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dailogRef: MatDialogRef<SessionTimeoutComponent>
  ) {
    this.dailogRef.disableClose = true;
  }

  ngOnInit() {
    this.data.idleTime = TimeCalculator.convertToMins(this.data.idleTime);
  }
  public continue() {
    this.dailogRef.close(true);
  }

}
