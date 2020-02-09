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
    
    let info = this.handle.moved.pipe(
      map((x: { pointerPosition: { x: number, y: number } }) => {
        return x.pointerPosition
      }),
      map(loc => {
        let box = this.tbl.nativeElement.getBoundingClientRect()
        let boxheight = box.height
        let boxwidth = box.width
        let cellheight = Math.floor(boxheight / this.mat.elements.length)
        let cellWidth = Math.floor(boxwidth / this.mat.elements[0].length)

        let previewWidth = loc.x - box.left
        let previewheight = loc.y - box.top
        let horinum = Math.floor(previewheight / cellheight)
        let vertnum = Math.floor(previewWidth / cellWidth)
        return { previewWidth, previewheight, vertnum, horinum, cellheight, cellWidth }
      })
    );

    this.verts = info.pipe(
      map(info => {
        if (info.vertnum == 0) {
          return []
        }
        return range(1, info.vertnum, 1).map(x => new Divisor(info.cellheight * info.horinum, x * info.cellWidth)).toArray()
      })
    )
    this.horis = info.pipe(
      map(info => {
        if (info.horinum == 0) {
          return []
        }
        return range(1, info.horinum, 1).map(x => new Divisor(info.cellWidth * info.vertnum, info.cellheight * x)).toArray()
      })
    )

    // this.rows = ctx.pipe(
    //   map(info => {
    //     return range(1, rownum, 1).map(x => `${x * cellWidth}px`).toArray())
    //   })
    // )
    // this.cols = ctx.pipe(
    //   map(loc => {
    //     return range(1, colnum, 1).map(x => new Divisor(`${rownum * cellheight}px`, `${x * cellheight}px`)).toArray()
    //   })
    // )
  }
  onCellClick(ridx: number, cidx: number) {
    this.cellClick.emit([ridx, cidx])
  }
  @ViewChild(CdkDrag, { static: false }) handle: CdkDrag;
  @ViewChild("tbl", { static: false }) tbl: ElementRef;
  @ViewChild("highlightbox", { static: false }) highbox: ElementRef;

  horis: Observable<Divisor[]>
  verts: Observable<Divisor[]>

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

class Divisor {
  constructor(
    public length: number,
    public pos: number
  ) { }
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