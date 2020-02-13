import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Exp, Lineage } from '../exp';
import { AppState, removeVars } from '../reducers';
import { Store } from '@ngrx/store';

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


  constructor(
    private store:Store<{state:AppState}>
  ) { }

  ngOnInit() {
    
  }

  onChange(l:Lineage) {
    this.changed.emit(l)
  }
  @Output() removed = new EventEmitter<Lineage>()
  onRemove(l:Lineage) {
    this.removed.emit(l)
  }

  onRemoveAll() {
    this.store.dispatch(removeVars({name:this.name}))
  }
  onEditName() {
    
  }
}
