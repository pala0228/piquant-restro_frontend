import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-loader',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  /**
   * @ignore
   */
  @Input() loading = false;

  constructor() { }

  ngOnInit() {
  }

}
