import { Component } from '@angular/core';
import {sampleMat, Lineage, Exp, sampleX, Var} from './exp'
import { SystemService } from './system.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get vars():[string, Exp][] {return this.system.vars}
  get rootLineage() { return new Lineage([], this.system.main)}
  title = 'calc';
  constructor (
    private system:SystemService
  ) {}
}
