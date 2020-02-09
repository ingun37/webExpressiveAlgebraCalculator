import { Input, Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Matrix, Lineage, Exp } from '../exp';
import { CellComponent } from '../cell/cell.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  asSequence,
  sequenceOf,
  emptySequence,
  range,
  generateSequence,
  extendSequence
} from 'sequency';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() mat: Matrix;
  @Output() cellClick: EventEmitter<[number, number]> = new EventEmitter();
  constructor(private el: ElementRef) { }

  ngOnInit() {
    //document.getElementById("myBtn").style.width = "300px";
  }

  ngAfterViewInit() {
    let loc = this.handle.moved.pipe(
      map((x: { pointerPosition: { x: number, y: number } }) => {
        return x.pointerPosition
      }))
    this.rows = loc.pipe(
      map(loc => {
        let box = this.tbl.nativeElement.getBoundingClientRect()
        let boxwidth = box.width
        let cellWidth = Math.floor(boxwidth / this.mat.elements[0].length)
        let previewWidth = loc.x - box.left
        let rownum = Math.floor(previewWidth / cellWidth)
        return range(1, rownum, 1).map(x => `${x * cellWidth}px`).toArray()
      })
    )
    this.cols = loc.pipe(
      map(loc => {
        let box = this.tbl.nativeElement.getBoundingClientRect()
        let boxheight = box.height
        let cellheight = Math.floor(boxheight / this.mat.elements.length)
        let previewheight = loc.y - box.top
        let colnum = Math.floor(previewheight / cellheight)
        return range(1, colnum, 1).map(x => `${x * cellheight}px`).toArray()
      })
    )
  }
  onCellClick(ridx: number, cidx: number) {
    this.cellClick.emit([ridx, cidx])
  }
  @ViewChild(CdkDrag, { static: false }) handle: CdkDrag;
  @ViewChild("tbl", { static: false }) tbl: ElementRef;
  @ViewChild("highlightbox", { static: false }) highbox: ElementRef;

  rows: Observable<string[]>
  cols: Observable<string[]>

  onHandleMove(event: { pointerPosition: { x: number, y: number } }) {
    let box = this.tbl.nativeElement.getBoundingClientRect()
    // console.log(this.tbl.nativeElement.offsetTop)
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


/*
[Log] Object (main.js, line 1034)

delta: {x: 1, y: 1}

distance: {x: 25, y: 23}

event: MouseEvent {isTrusted: true, screenX: 300, screenY: 341, clientX: 300, clientY: 278, …}

pointerPosition: {x: 300, y: 278}

source: CdkDrag {element: ElementRef, dropContainer: null, _document: #document, _ngZone: NgZone, _viewContainerRef: ViewContainerRef_, …}

Object Prototype
*/