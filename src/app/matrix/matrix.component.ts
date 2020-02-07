import { Input, Component, OnInit } from '@angular/core';
import { Matrix } from '../exp';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() mat: Matrix;
  constructor() { }

  ngOnInit() {
  }

}
