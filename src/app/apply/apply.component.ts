import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Lineage, Exp, Add, Var } from '../exp';
import { SystemService } from '../system.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  expressionControl = new FormControl('');

  lineage: Lineage
  get options(): Option[] {
    let exp = this.lineage.exp
    let unusedVar = this.system.unusedVar
    let availables:Exp[] = [
      new Add(exp, new Var(unusedVar))
    ]
    return availables.map(x=>new Option(x, x))
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApplyComponent>,
    private system:SystemService
    ) {
    this.lineage = data.lineage
    let exp = this.lineage.exp
    let unusedVar = system
  }

  ngOnInit() {
    this.expressionControl.valueChanges.subscribe(val => {
      console.log(val)
    })
  }

  onPick(option:Option) {
    this.dialogRef.close(option.original)
  }
}

class Option {
  constructor (
    public original: Exp,
    public show: Exp
  ) {}
}