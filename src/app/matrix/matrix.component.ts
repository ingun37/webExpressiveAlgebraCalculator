import { Input, Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Matrix, Lineage, Exp } from '../exp';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() mat: Matrix;
  @Output() cellClick:EventEmitter<[number, number]> = new EventEmitter();
  constructor(private el:ElementRef) { }

  ngOnInit() {
    //document.getElementById("myBtn").style.width = "300px";
  }

  ngAfterViewInit() {
  }
  onCellClick(ridx:number, cidx:number) {
    this.cellClick.emit([ridx, cidx])
  }
  @ViewChild("handle", {static: false}) handle: ElementRef;
  @ViewChild("tbl", {static: false}) tbl: ElementRef;
  @ViewChild("highlightbox", {static: false}) highbox: ElementRef;
  onHandleMove(event:{pointerPosition:{x:number, y:number}}) {
    let box = this.tbl.nativeElement.getBoundingClientRect()
    console.log(this.tbl.nativeElement.offsetTop)
    this.highbox.nativeElement.style.top = `${this.tbl.nativeElement.offsetTop}px`
    this.highbox.nativeElement.style.left = `${this.tbl.nativeElement.offsetLeft}px`
    this.highbox.nativeElement.style.width = `${event.pointerPosition.x - box.left}px`
    this.highbox.nativeElement.style.height = `${event.pointerPosition.y - box.top}px`
    // console.log(event.pointerPosition)
  }
}
// [Log] DOMRect (main.js, line 1035)

// bottom: 255.1875
// height: 82
// left: 137.5625
// right: 275.5625
// top: 173.1875
// width: 138
// x: 137.5625
// y: 173.1875
// DOMRect Prototype
