import { Injectable } from '@angular/core';
import { Exp, Var } from './exp';
import Sequence, {
  asSequence,
  sequenceOf, 
  emptySequence, 
  range,
  generateSequence,
  extendSequence
} from 'sequency';
import { BehaviorSubject, Subject } from 'rxjs';
import { createAction, createReducer, on, props, Store, select } from '@ngrx/store';
import { AppState, addVars, updateMain, selectUnusedVar, updateVars, NamedVar, undoAction, clearAction } from './reducers';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  public vars$ = this.store.pipe(
    map(x=>x.state.vars)
  )

  unusedVar = this.store.pipe(select(selectUnusedVar))
  addVariable() {
    this.store.pipe(
      select(selectUnusedVar),
      first()
      ).subscribe(newName=>{
      this.store.dispatch(addVars({var: new NamedVar(newName, new Var(newName))}))
    })
  }
  public main$ = this.store.pipe(
    map(x=>x.state.main)
  )
  
  setMainExp(exp:Exp) {
    this.store.dispatch(updateMain({exp:exp}))
  }

  constructor(private store:Store<{state:AppState}>) { }
  updateVar(name:string, e:Exp) {
    this.store.dispatch(updateVars({var: new NamedVar(name,e)}))
  }
  undo() {
    this.store.dispatch(undoAction())
  }
  clear() {
    this.store.dispatch(clearAction())
  }
}

