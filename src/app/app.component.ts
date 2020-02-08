import { Component } from '@angular/core';
import {sampleMat, Lineage} from './exp'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rootLineage = new Lineage([], sampleMat)
  title = 'calc';
}
