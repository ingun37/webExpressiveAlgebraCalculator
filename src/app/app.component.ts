import { Component } from '@angular/core';
import {sampleMat} from './exp'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sample = sampleMat
  title = 'calc';
}
