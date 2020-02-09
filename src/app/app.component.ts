import { Component } from '@angular/core';
import {sampleMat, Lineage, Exp, sampleX, Var, changed} from './exp'
import { SystemService } from './system.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  get vars():[string, Exp][] {
    return this.system.variables
  }
  get rootLineage():Lineage {
    return new Lineage([], this.system.mainExp)
  }
  get resultTex():string {
    try {
      let substituded = this.system.variables.reduce((l,r)=>{
        let varname = r[0]
        let varexp = r[1]
        return changed(l, new Var(varname), varexp)
      }, this.system.mainExp)
      return "= " + substituded.eval().latex
    } catch (error) {
      return "\\text{Invalid Expression}"
    }
  }
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
