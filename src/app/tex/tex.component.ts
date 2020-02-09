import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Input, Directive } from '@angular/core';
import katex from 'katex';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tex',
  templateUrl: './tex.component.html',
  styleUrls: ['./tex.component.scss']
})
export class TexComponent implements OnInit {
  _tex:string = null
  @Input()
  set tex(tex: string) {
    this._tex = tex
    this.renderMath()
  }
  renderMath() {
    if (this.texview) {
      katex.render(this._tex, this.texview.nativeElement, {
        throwOnError: false,
        output: "mathml"
      });
    }
  }

  @ViewChild("texview", {static: false}) texview: ElementRef;

  constructor() {
  }
  
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.renderMath()
  }
}
