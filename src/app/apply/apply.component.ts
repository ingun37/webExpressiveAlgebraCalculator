import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Lineage, Exp, Add, Var } from '../exp';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  lineage: Lineage
  get options(): Exp[] {
    let exp = this.lineage.exp
    let unusedVar = this.system.unusedVar
    return [
      new Add(exp, new Var(unusedVar))
    ]
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private system:SystemService
    ) {
    this.lineage = data.lineage
    let exp = this.lineage.exp
    let unusedVar = system
  }

  ngOnInit() {
  }

}
