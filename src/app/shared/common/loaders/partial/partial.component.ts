import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-partial-loader',
  templateUrl: './partial.component.html',
  styleUrls: ['./partial.component.scss']
})
export class PartialComponent implements OnInit {
  /**
   * @ignore
   */
  @Input() loading = false;

  constructor() { }

  ngOnInit() {
  }

}
