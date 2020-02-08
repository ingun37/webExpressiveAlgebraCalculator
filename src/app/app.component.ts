import { Component } from '@angular/core';
import {sampleMat, Lineage, Exp, sampleX} from './exp'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vars:[string, Exp][] = [["X", sampleX]]
  rootLineage = new Lineage([], sampleMat)
  title = 'calc';
}
