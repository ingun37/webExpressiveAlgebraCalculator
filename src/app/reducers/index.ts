import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createAction,
  props,
  createReducer,
  on
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Exp, Var, Scalar, Add, Matrix } from '../exp';
import Sequence, { asSequence, sequenceOf, generateSequence } from 'sequency';

export class NamedVar{
  constructor(
    public name:string,
    public exp:Exp
  ) {}
}

class StateSnapShot {
  constructor(
    public main:Exp,
    public vars:NamedVar[]
  ) {}
}
export class AppState {
  history: StateSnapShot[]
  get head():StateSnapShot {
    return this.history[this.history.length-1]
  }
  get main():Exp {return this.head.main}
  get vars():NamedVar[] {return this.head.vars}
  constructor(
    main:Exp,
    vars:NamedVar[]
  ) {
    this.history = [new StateSnapShot(main, vars)]
  }
}

export const updateMain = createAction("[Main Component] Update", props<{exp:Exp}>())
export const updateVars = createAction("[Vars Component] Update", props<{var:NamedVar}>())
export const addVars = createAction("[Vars Component] Add", props<{var:NamedVar}>())

const n1 = new Scalar(1)
const n0 = new Scalar(0)
const vA = new Var("A")
const vZ = new Var("Z")
const sampleAdd = new Add(n1, n0)
const initialMain = new Add(vZ, new Matrix([[n1, vA], [sampleAdd, n1]]))
const initialVars = [new NamedVar("X", new Var("Y"))]

const _stateReducer = createReducer(new AppState(initialMain, initialVars),
  on(updateMain, (state, prop) => {
    return new AppState(prop.exp, state.vars)
  }),
  on(updateVars, (state, prop) => {
    return new AppState(state.main, state.vars.map(x=>{
      if(x.name == prop.var.name) {
        return prop.var
      } else {
        return x
      }
    }))
  }),
  on(addVars, (state, prop)=>{
    return new AppState(state.main, state.vars.concat([prop.var]))
  }),
);

export function stateReducer(state, action) {
  return _stateReducer(state, action);
}

function usedVars(e:Exp):Sequence<string> {
  if (e instanceof Var) {
    return sequenceOf(e.name)
  }
  return asSequence(e.kids).flatMap(kid => usedVars(kid))
}
export const selectUsedVar = createSelector(
  (state:{state:AppState})=>{
    let a = this.store

    let ofMain = usedVars(this.main$.value)
    let ofVars = asSequence(state.state.vars.map(pair=>pair.exp)).flatMap(x=>usedVars(x))
    let varNames = state.state.vars.map(v=>v.name)

    return ofMain.toArray().concat(ofVars.toArray(), varNames)
  },
  (vars) => vars
);
export const selectUnusedVar = createSelector(
  selectUsedVar,
  (usedVars:string[])=>{
    return freeMonoid().filter(name=>usedVars.findIndex(x=> name == x) == -1).first()
  }
);
function caretesian(xs:string[], ys:string[]): string[] {
  return asSequence(xs).flatMap(x=> asSequence(ys).map(y=>x.concat(y))).toArray()
}

function freeMonoid(): Sequence<string> {
  let gen = asSequence("ABCDEFGHIJKLMNOPQRSTUVWXYZ").toArray()
  return generateSequence(0, n=>n+1).map(n => {
    var prod = gen
    for (let index = 0; index < n; index++) {
      prod = caretesian(prod, gen)
    }
    return prod
  }).flatten()
}