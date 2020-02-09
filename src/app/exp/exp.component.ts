import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';
import { MatDialog } from '@angular/material/dialog';
import { ApplyComponent } from '../apply/apply.component';
import { Observable } from 'rxjs';
import { range } from 'sequency';


@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  _lineage:E.Lineage
  @Input()
  set lineage(l:E.Lineage) {
    this._lineage = l
    
  }
  @Output() changed = new EventEmitter<E.Exp>(); 
  get exp():E.Exp {
    return this._lineage.exp
  }
  get mat():E.Matrix {
    if (this._lineage.exp instanceof E.Matrix) {
      return this._lineage.exp as E.Matrix
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
    this.openDialogFor(this._lineage).then(newExp => {
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
    let thisExp = this._lineage.exp
    let kidExp = this._lineage.exp.kids[kidIdx]
    let newLine:[E.Exp, number] = [thisExp, kidIdx]
    return new E.Lineage(this._lineage.chain.concat([newLine])  , kidExp)
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

  onMatrixResize(size:[number, number]) {
    let row = size[0]
    let col = size[1]
    let mat = this.mat
    let newElements = range(0, row-1, 1).map(r=>{
      return range(0, col-1, 1).map((c):E.Exp=>{
        if (r < mat.elements.length && c < mat.elements[0].length) {
          return mat.elements[r][c]
        } else {
          return new E.Scalar(0)
        }
      }).toArray()
    }).toArray()
    this.changed.emit(new E.Matrix(newElements))
  }
}
/*
-  onHandleMove(event: { pointerPosition: { x: number, y: number } }) {
-    let box = this.tbl.nativeElement.getBoundingClientRect()
-    // console.log(this.tbl.nativeElement.offsetTop)
-    this.highbox.nativeElement.style.top = `${this.tbl.nativeElement.offsetTop}px`
-    this.highbox.nativeElement.style.left = `${this.tbl.nativeElement.offsetLeft}px`
-    this.highbox.nativeElement.style.width = `${event.pointerPosition.x - box.left}px`
-    this.highbox.nativeElement.style.height = `${event.pointerPosition.y - box.top}px`
-    // console.log(event.pointerPosition)
-  }
*/