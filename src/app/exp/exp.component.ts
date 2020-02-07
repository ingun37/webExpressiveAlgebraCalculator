import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Exp } from '../exp';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  @Input() exp: Exp;

  constructor() { }

  ngOnInit() {
    console.log(this.exp);
  }

}
