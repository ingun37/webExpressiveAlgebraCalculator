import { Component } from '@angular/core';
import {sampleMat, Lineage, Exp, sampleX, Var} from './exp'
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
    this.system.main = to
    // this.rootLineage = new Lineage([], this.system.main)
  }
  get vars():[string, Exp][] {
    return this.system.vars
  }
  get rootLineage():Lineage {
    return new Lineage([], this.system.main)
  }
  get resultTex():string {
    try {
      return "= " + this.system.main.eval().latex
    } catch (error) {
      return "\\text{Invalid Expression}"
    }
  }
  title = 'calc';
  constructor (
    private system:SystemService
  ) {
    // this.rootLineage = new Lineage([], this.system.main)
  }

}
