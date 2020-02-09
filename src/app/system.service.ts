import { Injectable } from '@angular/core';
import { sampleMat, sampleX, Exp, Var, sampleY } from './exp';
import Sequence, {
  asSequence,
  sequenceOf, 
  emptySequence, 
  range,
  generateSequence,
  extendSequence
} from 'sequency';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private initialVars = [new NamedVar("X", sampleY)]
  public vars$ = new BehaviorSubject<NamedVar[]>(this.initialVars)
  private vars:NamedVar[] = this.initialVars
  get variables() {
    return this.vars
  }
  addVariable() {
    let newVarName = this.unusedVar
    this.vars = this.vars.concat([
      new NamedVar(newVarName, new Var(newVarName))
    ])
    this.vars$.next(this.vars)
  }
  private initialMain =  sampleMat
  public main$ = new BehaviorSubject<Exp>(this.initialMain)
  private main:Exp = this.initialMain
  get mainExp():Exp {
    return this.main
  }
  setMainExp(exp:Exp) {
    this.main = exp
    this.main$.next(exp)
  }
  get usedVars():string[] {
    let ofMain = usedVars(this.main)
    let ofVars = flatMap(this.vars.map(pair=>pair.exp), x=>usedVars(x))
    let varNames = this.vars.map(v=>v.name)
    return ofMain.concat(ofVars, varNames)
  }
  get unusedVar():string {
    let usedVars = this.usedVars
    return freeMonoid().filter(name=>usedVars.findIndex(x=> name == x) == -1).first()
  }
  constructor() { }
  updateVar(name:string, e:Exp) {
    this.vars = this.vars.map(pair=>{
      if(pair.name == name) {
        return new NamedVar(name,e)
      } else {
        return pair
      }
    })
    this.vars$.next(this.vars)
  }
}
function usedVars(e:Exp):string[] {
  if (e instanceof Var) {
    return [e.name]
  }
  return flatMap(e.kids, kid => usedVars(kid))
}


function caretesian(xs:string[], ys:string[]): string[] {
  return flatMap(xs, x => ys.map(y=> x.concat(y)))
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

export class NamedVar{
  constructor(
    public name:string,
    public exp:Exp
  ) {}
}



function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}