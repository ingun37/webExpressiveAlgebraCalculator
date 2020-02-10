import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Exp, Lineage, changed } from '../exp';

@Component({
  selector: 'app-var',
  templateUrl: './var.component.html',
  styleUrls: ['./var.component.scss']
})
export class VarComponent implements OnInit {
  @Input() name:string
  @Input()
  set exp(e:Exp) {
    this.lineage = new Lineage([], e)
  }
  lineage:Lineage
  
  @Output() changed = new EventEmitter<Lineage>(); 


  constructor() { }

  ngOnInit() {
    
  }

  onChange(l:Lineage) {
    console.log("on change in VarComp")
    this.changed.emit(l)
  }
  @Output() removed = new EventEmitter<Lineage>()
  onRemove(l:Lineage) {
    this.removed.emit(l)
  }
}
