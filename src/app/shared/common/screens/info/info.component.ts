import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  /**
   * @ignore
   * message input to component to display information on screen
   */
  @Input() message = null;
  /**
   * @ignore
   * showMessage flag as input to component to activate content
   */
  @Input() showScreen = false;
  /**
   * @ignore
   * screenType to activate respective type of screen. can be error, success, warning, info
   */
  @Input() status: "info" | "success" | "warning" | "error" = undefined;
  constructor() { }

  ngOnInit() {
    if (!this.message) {
      this.message = "Internal server error. Please contact support team";
    }
  }
  /**
   * @ignore
   */
  onClear() {
    this.showScreen = false;
  }
}
