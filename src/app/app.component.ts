import { Component } from '@angular/core';
import { Lineage, Exp,  Var, changed} from './exp'
import { SystemService } from './system.service';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, first } from 'rxjs/operators';
import { NamedVar } from './reducers';
import { asSequence } from 'sequency';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mainChanged(l:Lineage) {
    this.system.main$.pipe(first()).subscribe(main => {
      this.system.setMainExp(refChange(main, l.chain, l.exp))
    })

    // this.rootLineage = new Lineage([], this.system.main)
  }
  vars = this.system.vars$
  rootLineage = this.system.main$.pipe(
    map(x => new Lineage([], x))
  )
  // get rootLineage():Lineage {
  //   return new Lineage([], this.system.mainExp)
  // }
  result = combineLatest(this.system.vars$, this.system.main$.pipe(map(x=>[new NamedVar('',x)]))).pipe(
    map(tup=>{
      let vars = tup[0]
      let main = tup[1][0].exp
      let substituded = vars.reduce((l,r)=>{
        let varname = r.name
        let varexp = r.exp
        return changed(l, new Var(varname), varexp)
      }, main)
      return "= " + substituded.eval().latex
    }),
    catchError(()=>"\\text{Invalid Expression}")
  )
  onVarChanged(name:string, newL:Lineage) {
    this.system.vars$.pipe(first()).subscribe(vars => {
      let v = asSequence(vars).first( v =>v.name == name)
      this.system.updateVar(name, refChange(v.exp, newL.chain, newL.exp))
    })
  }
  title = 'calc';
  constructor (
    private system:SystemService
  ) {
    // this.rootLineage = new Lineage([], this.system.main)
  }

  addVar() {
    this.system.addVariable()
  }

  onUndo() {
    this.system.undo()
  }
  onClear() {
    this.system.clear()
  }
}

function refChange(e:Exp, lineage:number[], to:Exp):Exp {
  if (lineage.length == 0) {
    return to
  }
  let newKids = e.kids.map((k,i)=>{
    if (i == lineage[0]) {
      return refChange(k, lineage.slice(1), to)
    } else {
      return k
    }
  })
  return e.clone(newKids)
}