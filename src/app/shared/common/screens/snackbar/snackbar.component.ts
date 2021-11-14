import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  /**
     * showSnackbar input to component to activate snack bar
     */
  @Input() showSnackbar = false;
  /**
   * status input to component to activate type of snack bar icon
   */
  @Input() status: "info" | "success" | "warning" | "error" = undefined;
  /**
   * message input to component to show message on snack bar
   */
  @Input() message = "";
  /**
   * onUpdateStatus output to outside world to set showSnackbar as false from parent.
   */
  @Output() onUpdateStatus = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    // Setting timer to close snack bar after 6 seconds automatically.
    setTimeout(() => {
      this.onClear();
    }, 5000);
  }
  /**
   * @ignore
   * Method to close snack bar manually. Trigger event by which showSnackbar flag will
   * be set as false.
   */
  onClear() {
    this.onUpdateStatus.emit(false);
  }

}
