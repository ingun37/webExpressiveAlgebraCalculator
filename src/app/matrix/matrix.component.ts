import { Input, Component, OnInit } from '@angular/core';
import { Matrix, Lineage, Exp } from '../exp';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() lineage: Lineage;
  get mat(): Matrix {
    return this.lineage.exp as Matrix
  }
  constructor() { }

  ngOnInit() {
  }

  cellClick(ridx:number, cidx:number) {
    console.log(ridx, cidx)
  }
  makeLineageForCell(ridx:number, cidx:number): Lineage {
    let thisExp = this.lineage.exp
    let cellIdx = this.mat.elements[0].length * ridx + cidx
    let kidExp = this.lineage.exp.kids[cellIdx]
    let newLine:[Exp, number] = [thisExp, cellIdx]
    return new Lineage(this.lineage.chain.concat([newLine]), kidExp)
  }
  
}
