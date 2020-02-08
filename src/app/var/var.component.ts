import { Component, OnInit, Input } from '@angular/core';
import { Exp, Lineage } from '../exp';

@Component({
  selector: 'app-var',
  templateUrl: './var.component.html',
  styleUrls: ['./var.component.scss']
})
export class VarComponent implements OnInit {
  @Input() name:string
  @Input() exp:Exp

  get lineage():Lineage {return new Lineage([], this.exp)}

  constructor() { }

  ngOnInit() {
    
  }

}
