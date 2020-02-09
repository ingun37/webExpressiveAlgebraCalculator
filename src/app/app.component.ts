import { Component } from '@angular/core';
import { Lineage, Exp,  Var, changed} from './exp'
import { SystemService } from './system.service';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NamedVar } from './reducers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mainChanged(to:Exp) {
    this.system.setMainExp(to)

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
  onVarChanged(name:string, newE:Exp) {
    this.system.updateVar(name, newE)
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
}
