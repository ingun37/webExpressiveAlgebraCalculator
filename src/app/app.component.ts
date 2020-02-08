import { Component } from '@angular/core';
import {sampleMat, Lineage, Exp, sampleX, Var} from './exp'
import { SystemService } from './system.service';
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
  title = 'calc';
  constructor (
    private system:SystemService
  ) {
    // this.rootLineage = new Lineage([], this.system.main)
  }

}
