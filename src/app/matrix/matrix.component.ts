import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Matrix, Lineage, Exp } from '../exp';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() mat: Matrix;
  @Output() cellClick:EventEmitter<[number, number]> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onCellClick(ridx:number, cidx:number) {
    this.cellClick.emit([ridx, cidx])
  }
}
