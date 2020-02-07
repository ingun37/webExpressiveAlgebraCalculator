import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Input, Directive } from '@angular/core';
import katex from 'katex';

@Component({
  selector: 'app-tex',
  templateUrl: './tex.component.html',
  styleUrls: ['./tex.component.scss']
})
export class TexComponent implements OnInit {
  @Input() tex:string;
  @ViewChild("texview", {static: false}) texview: ElementRef;

  constructor() { }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
    console.log(this.texview)
    katex.render(this.tex, this.texview.nativeElement, {
      throwOnError: false,
      output: "mathml"
    });
  }
}
