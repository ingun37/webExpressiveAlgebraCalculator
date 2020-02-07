import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Input, Directive } from '@angular/core';
import katex from 'katex';
import { Exp } from '../exp';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  @Input() exp:Exp;

  @ViewChild("texview", {static: false}) texview: ElementRef;

  constructor() { }

  ngOnInit() {
  }
  onResized(e) {
    console.log("fuck")
    console.log(e)
  }
  ngAfterViewInit() {
    console.log(this.texview)
    katex.render(this.exp.latex, this.texview.nativeElement, {
      throwOnError: false,
      output: "mathml"
    });
  }
}
