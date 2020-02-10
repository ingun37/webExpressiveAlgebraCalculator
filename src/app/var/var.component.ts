import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Exp, Lineage, changed } from '../exp';

@Component({
  selector: 'app-var',
  templateUrl: './var.component.html',
  styleUrls: ['./var.component.scss']
})
export class VarComponent implements OnInit {
  @Input() name:string
  @Input() exp:Exp
  @Output() changed = new EventEmitter<Lineage>(); 

  get lineage():Lineage {return new Lineage([], this.exp)}

  constructor() { }

  ngOnInit() {
    
  }

  onChange(l:Lineage) {
    this.changed.emit(l)
  }
}
