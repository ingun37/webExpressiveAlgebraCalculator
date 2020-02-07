import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  @Input() exp: E.Exp;
  mat:E.Matrix = null
  constructor() { }

  ngOnInit() {
    if (this.exp instanceof E.Matrix) {
      this.mat = this.exp
    }
  }

}
