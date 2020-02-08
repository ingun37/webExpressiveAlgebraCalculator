import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Input, Directive } from '@angular/core';
import katex from 'katex';
import { Exp, Lineage } from '../exp';
import { ApplyComponent } from '../apply/apply.component';

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
  ngAfterViewInit() {
    katex.render(this.exp.latex, this.texview.nativeElement, {
      throwOnError: false,
      output: "mathml"
    });
  }
}
