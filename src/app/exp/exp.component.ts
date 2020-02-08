import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  @Input() lineage: E.Lineage;
  mat:E.Matrix = null
  constructor() { }

  ngOnInit() {
    if (this.lineage.exp instanceof E.Matrix) {
      this.mat = this.lineage.exp as E.Matrix
    }
  }

  chainLineage(kidIdx:number): E.Lineage {
    let thisExp = this.lineage.exp
    let kidExp = this.lineage.exp.kids[kidIdx]
    let newLine:[E.Exp, number] = [thisExp, kidIdx]
    return new E.Lineage(this.lineage.chain.concat([newLine])  , kidExp)
  }
}
