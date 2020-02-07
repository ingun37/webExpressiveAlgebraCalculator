import { Component, OnInit, Input } from '@angular/core';
import { Exp } from '../exp';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowComponent implements OnInit {
  @Input() exps: Exp[];

  constructor() { }

  ngOnInit() {
  }

}
