import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';
import { MatDialog } from '@angular/material/dialog';
import { ApplyComponent } from '../apply/apply.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  @Input() lineage: E.Lineage;
  @Output() changed = new EventEmitter<E.Exp>(); 
  get exp():E.Exp {
    return this.lineage.exp
  }
  get mat():E.Matrix {
    if (this.lineage.exp instanceof E.Matrix) {
      return this.lineage.exp as E.Matrix
    }
    return null
  }
  constructor(public dialog: MatDialog) { }

  openDialogFor(lineage:E.Lineage): Promise<E.Exp> {
    return this.dialog.open(ApplyComponent, {
      data: {lineage:lineage}
    }).afterClosed().toPromise().then(x=> {
      if (x) {
        return x as E.Exp
      }
      throw "no output from dialog";
    })
  }

  onTexClick() {
    this.openDialogFor(this.lineage).then(newExp => {
      this.changed.emit(newExp)
    })
  }

  ngOnInit() {
    
  }

  cell2kid(r:number, c:number): number {
    return r * this.mat.elements[0].length + c
  }

  onCellClick(event:[number, number]) {
    let ri = event[0]
    let ci = event[1]
    this.openDialogFor(this.makeLineageForKid(this.cell2kid(ri, ci))).then(newMatElement => {
      this.onKidChanged(this.cell2kid(ri, ci), newMatElement)
    })
  }

  makeLineageForKid(kidIdx:number): E.Lineage {
    let thisExp = this.lineage.exp
    let kidExp = this.lineage.exp.kids[kidIdx]
    let newLine:[E.Exp, number] = [thisExp, kidIdx]
    return new E.Lineage(this.lineage.chain.concat([newLine])  , kidExp)
  }

  onKidChanged(kidIdx:number, newKidExp:E.Exp) {
    let newMe = this.exp.clone(this.exp.kids.map((e, ki)=>{
      if (ki == kidIdx) {
        return newKidExp
      } else {
        return e
      }
    }))
    this.changed.emit(newMe)
  }
}
