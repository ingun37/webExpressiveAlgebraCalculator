import { Input, Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Matrix, Lineage, Exp } from '../exp';
import { CellComponent } from '../cell/cell.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { map, withLatestFrom } from 'rxjs/operators';
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
  @Output() resized: EventEmitter<[number, number]> = new EventEmitter();
  ngOnInit() {
    //document.getElementById("myBtn").style.width = "300px";
  }
  moving: Observable<any>
  ngAfterViewInit() {
    this.moving = this.handle.moved
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
        return { box, previewWidth, previewheight, vertnum, horinum, cellheight, cellWidth, loc }
      })
    );
    info.subscribe(info => {
      if(this.highbox) {
        this.highbox.nativeElement.style.top = `${this.tbl.nativeElement.offsetTop}px`
        this.highbox.nativeElement.style.left = `${this.tbl.nativeElement.offsetLeft}px`
        this.highbox.nativeElement.style.width = `${info.loc.x - info.box.left}px`
        this.highbox.nativeElement.style.height = `${info.loc.y - info.box.top}px`
      }
    })
    this.handle.released.pipe(
      withLatestFrom(info, (x, y): [number, number] => {
        return [y.horinum, y.vertnum]
      })
    ).subscribe(newSize => {
      console.log("new siz",newSize)
      this.resized.emit(newSize)
    })

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
  }
  onCellClick(ridx: number, cidx: number) {
    this.cellClick.emit([ridx, cidx])
  }
  @ViewChild(CdkDrag, { static: false }) handle: CdkDrag;
  @ViewChild("tbl", { static: false }) tbl: ElementRef;
  @ViewChild("highlightbox", { static: false }) highbox: ElementRef;

  horis: Observable<Divisor[]>
  verts: Observable<Divisor[]>

}

class Divisor {
  constructor(
    public length: number,
    public pos: number
  ) { }
}