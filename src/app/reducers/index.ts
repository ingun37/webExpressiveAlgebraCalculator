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
import { Exp, Var, Scalar, Add, Matrix, Mul } from '../exp';
import Sequence, { asSequence, sequenceOf, generateSequence } from 'sequency';

export class NamedVar{
  constructor(
    public name:string,
    public exp:Exp
  ) {}
}

export class AppState {
  constructor(
    public main:Exp,
    public vars:NamedVar[],
    public prev:AppState
  ) {}
}

export const updateMain = createAction("[Main Component] Update", props<{exp:Exp}>())
export const updateVars = createAction("[Vars Component] Update", props<{var:NamedVar}>())
export const addVars = createAction("[Vars Component] Add", props<{var:NamedVar}>())
export const removeVars = createAction("[Vars Component] Remoe", props<{name:string}>())
export const undoAction = createAction("[State Component] Undo")
export const clearAction = createAction("[State Component] Clear")

const n1 = new Scalar(1)
const n0 = new Scalar(0)
const vA = new Var("A")
const vZ = new Var("Z")
const sampleAdd = new Add(n1, n0)
const initialMain = new Add(vZ, new Matrix([[n1, vA], [sampleAdd, n1]]))
const initialVars = [new NamedVar("X", new Var("Y"))]
const initialState = new AppState(initialMain, initialVars, null)

const _stateReducer = createReducer(initialState,
  on(updateMain, (state, prop) => {
    return new AppState(prop.exp || new Var("X"), state.vars, state)
  }),
  on(updateVars, (state, prop) => {
    return new AppState(state.main, state.vars.map(x=>{
      if(x.name == prop.var.name) {
        return new NamedVar(prop.var.name, prop.var.exp || new Var(prop.var.name))
      } else {
        return x
      }
    }), state)
  }),
  on(addVars, (state, prop)=>{
    return new AppState(state.main, state.vars.concat([prop.var]), state)
  }),
  on(undoAction, (state) => {
    if (state.prev) {
      return state.prev
    } else {
      return initialState
    }
  }),
  on(clearAction, (state) => {
    return new AppState(new Var("X"), [], state)
  }),
  on(removeVars, (state, props) => {
    let name = props.name
    return new AppState(state.main, state.vars.filter(x=>x.name != name), state)
  })
);

export function stateReducer(state, action) {
  return _stateReducer(state, action);
}


export const selectPredefinedVars = (state:{state:AppState})=>{
  let varNames = state.state.vars.map(v=>v.name)
  return varNames
}
export const selectUsedVar = (state:{state:AppState})=>{
  let ofMain = usedVars(state.state.main)
  let ofVars = asSequence(state.state.vars.map(pair=>pair.exp)).flatMap(x=>usedVars(x))
  let varNames = state.state.vars.map(v=>v.name)
  return ofMain.toArray().concat(ofVars.toArray(), varNames)
}

export const selectUnusedVar = createSelector(
  selectUsedVar,
  (usedVars:string[])=>{
    let name = freeMonoid().filter(name=>usedVars.findIndex(x=> name == x) == -1).first()
    return name
  }
);

export const selectFinalEvaluation = (state:{state:AppState})=>{
  let vars = state.state.vars
  let main = state.state.main
  let substituded = vars.reduce((l,r)=>{
    let varname = r.name
    let varexp = r.exp
    return changed(l, new Var(varname), varexp)
  }, main)
  return "= " + evaluate(substituded).latex
}

function caretesian(xs:Sequence<string>, ys:Sequence<string>): Sequence<string> {
  return xs.flatMap(x=> ys.map(y=>x.concat(y)))
}

function freeMonoid(): Sequence<string> {
  let gen = asSequence("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
  return generateSequence(0, n=>n+1).map(n => {
    var prod = gen
    for (let index = 0; index < n; index++) {
      prod = caretesian(prod, gen)
    }
    return prod
  }).flatten()
}
function usedVars(e:Exp):Sequence<string> {
  if (e instanceof Var) {
    return sequenceOf(e.name)
  }
  return asSequence(e.kids).flatMap(kid => usedVars(kid))
}
function changed(e: Exp, from: Exp, to: Exp): Exp {
  if (e.isEq(from)) {
      return to
  }
  let newKids = e.kids.map(x => changed(x, from, to))
  return e.clone(newKids)
}
function distributeFlat(e:Exp):Exp[] {
  if (e instanceof Add) {
    return distributeFlat(e.l).concat(distributeFlat(e.r))
  } else if (e instanceof Mul) {
    let prod = asSequence(distributeFlat(e.l)).flatMap(x=>{
      return asSequence(distributeFlat(e.r)).map(y=>{
        return new Mul(x,y)
      })
    }).toArray()
    if (prod.length > 1) {
      let aa = asSequence(prod).flatMap(x=>asSequence(distributeFlat(x)))
      return aa.toArray()
    } else {
      return [e]
    }
  } else {
    return [e]
  }
}
function evaluate(e:Exp):Exp {
  let xs = distributeFlat(e.eval())
  let added = xs.reduce((l,r)=>new Add(l,r))
  return added.eval()
}