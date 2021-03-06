import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Input } from '@angular/core';
import * as E from '../exp';
import { MatDialog } from '@angular/material/dialog';
import { ApplyComponent } from '../apply/apply.component';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { range, asSequence } from 'sequency';


@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss']
})
export class ExpComponent implements OnInit {
  _lineage: E.Lineage
  @Input()
  set lineage(l: E.Lineage) {
    this._lineage = l

    if (this.exp instanceof E.Add) {
      this.subviewLineages = associativeKidsOfAdd(l)
    } else if (this.exp instanceof E.Mul) {
      this.subviewLineages = associativeKidsOfMul(l)
    } else {
      this.subviewLineages = this.exp.kids.map((x, i) => this.makeLineageForKid(i))
    }

  }

  subviewLineages: E.Lineage[]

  @Output() changed = new EventEmitter<E.Lineage>();

  get exp(): E.Exp {
    return this._lineage.exp
  }
  get mat(): E.Matrix {
    if (this._lineage.exp instanceof E.Matrix) {
      return this._lineage.exp as E.Matrix
    }
    return null
  }
  constructor(public dialog: MatDialog) { }

  @Output() removed = new EventEmitter<E.Lineage>();
  onRemove(lineage: E.Lineage) {
    this.removed.emit(lineage)
  }
  openDialogFor(lineage: E.Lineage): Promise<E.Exp> {
    return this.dialog.open(ApplyComponent, {
      data: { lineage: lineage }
    }).afterClosed().toPromise().then(x => {
      if (x === "remove") {
        this.removed.emit(lineage)
        throw "removing"
      }
      if (x) {
        return x as E.Exp
      }
      throw "no output from dialog";
    })
  }

  onTexClick() {
    this.openDialogFor(this._lineage).then(newExp => {
      this.changed.emit(new E.Lineage(this._lineage.chain, newExp))
    })
  }

  ngOnInit() {

  }

  cell2kid(r: number, c: number): number {
    return r * this.mat.elements[0].length + c
  }

  onCellClick(event: [number, number]) {
    let ri = event[0]
    let ci = event[1]
    let kidLineage = this.makeLineageForKid(this.cell2kid(ri, ci))
    this.openDialogFor(kidLineage).then(newMatElement => {
      let l = new E.Lineage(kidLineage.chain, newMatElement)
      this.onKidChanged(l)
    })
  }

  makeLineageForKid(kidIdx: number): E.Lineage {
    let thisExp = this._lineage.exp
    let kidExp = this._lineage.exp.kids[kidIdx]
    return new E.Lineage(this._lineage.chain.concat([kidIdx]), kidExp)
  }

  onKidChanged(lineage: E.Lineage) {
    this.changed.emit(lineage)
  }

  onMatrixResize(size: [number, number]) {
    let row = size[0]
    let col = size[1]
    let mat = this.mat
    let newElements = E.rng(row).map(r => {
      return E.rng(col).map((c): E.Exp => {
        if (r < mat.elements.length && c < mat.elements[0].length) {
          return mat.elements[r][c]
        } else {
          return new E.Scalar(0)
        }
      }).toArray()
    }).toArray()
    console.log(newElements)
    let l = new E.Lineage(this._lineage.chain, new E.Matrix(newElements))
    this.changed.emit(l)
  }
  @ViewChildren("subview", { read: ElementRef }) subviews: QueryList<ElementRef>;

  noti = new Subject<number>()
  centers: number[]
  end: number
  ngAfterViewInit() {
    this.subviews.changes.subscribe((subviews:QueryList<ElementRef>) => {
      setTimeout(() => {
        let a = subviews.reduce((l: number[], r) => {
          return l.concat([
            l[l.length - 1] + r.nativeElement.getBoundingClientRect().width
          ])
        }, [0])
        if (a.length > 1) {
  
          let newCenters = range(0, a.length - 2, 1).map(n => Math.floor((a[n] + a[n + 1]) / 2)).toArray()
          this.centers = (newCenters)
          this.end = (newCenters[newCenters.length - 1])
          this.noti.next(newCenters.length)
        } else {
          this.centers = []
        }
      }, 1);
    })
    this.subviews.notifyOnChanges()
    // setTimeout(() => {

    //   }
    // }, 1);
  }
}

function associativeKidsOfAdd(l: E.Lineage): E.Lineage[] {
  if (l.exp instanceof E.Add) {
    let ffa = l.exp.kids.map((k, i) => {
      return associativeKidsOfAdd(new E.Lineage(l.chain.concat([i]), k))
    })
    return asSequence(ffa).flatMap(x => asSequence(x)).toArray()
  } else {
    return [l]
  }
}

function associativeKidsOfMul(l: E.Lineage): E.Lineage[] {
  if (l.exp instanceof E.Mul) {
    let ffa = l.exp.kids.map((k, i) => {
      return associativeKidsOfMul(new E.Lineage(l.chain.concat([i]), k))
    })
    return asSequence(ffa).flatMap(x => asSequence(x)).toArray()
  } else {
    return [l]
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