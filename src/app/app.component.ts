import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sample = {
    latex: "a+b", 
    kids:[
      {latex: "a", kids:[]},
      {latex: "b", kids:[]}
    ]}
  title = 'calc';
}
