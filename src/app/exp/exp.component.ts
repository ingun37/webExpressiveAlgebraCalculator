import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';
import { MatDialog } from '@angular/material/dialog';
import { ApplyComponent } from '../apply/apply.component';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  @Input() lineage: E.Lineage;
  mat:E.Matrix = null
  constructor(public dialog: MatDialog) { }

  openDialogFor(lineage:E.Lineage) {
    this.dialog.open(ApplyComponent, {
      data: {lineage:lineage}
    })
  }
  onTexClick() {
    this.openDialogFor(this.lineage)
  }

  ngOnInit() {
    if (this.lineage.exp instanceof E.Matrix) {
      this.mat = this.lineage.exp as E.Matrix
    }
  }

  cell2kid(r:number, c:number): number {
    return r * this.mat.elements[0].length + c
  }

  onCellClick(event:[number, number]) {
    console.log(event)
  }

  makeLineageForKid(kidIdx:number): E.Lineage {
    let thisExp = this.lineage.exp
    let kidExp = this.lineage.exp.kids[kidIdx]
    let newLine:[E.Exp, number] = [thisExp, kidIdx]
    return new E.Lineage(this.lineage.chain.concat([newLine])  , kidExp)
  }
}
