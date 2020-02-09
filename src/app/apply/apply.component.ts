import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Lineage, Exp, Add, Var, Scalar } from '../exp';
import { SystemService } from '../system.service';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  expressionControl = new FormControl('', []);

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
    this.expressionControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(n=>{
      let e = evaluateExpression(n)
      if(e) {
      } else {
        this.expressionControl.setErrors({invalidExpression:true})
      }
    })
  }

  onPick(option:Option) {
    this.dialogRef.close(option.original)
  }
  onEval() {
    let e = evaluateExpression(this.expressionControl.value)
    if(e) {
      this.dialogRef.close(e)
    }
  }
}

class Option {
  constructor (
    public original: Exp,
    public show: Exp
  ) {}
}
function evaluateExpression(expression:string):Exp {
  {
    let m = expression.match(/^\d+$/)
    if (m) {
      return new Scalar(parseInt(m[0]))
    }
  }
  {
    let m = expression.match(/^[a-zA-Z]+$/)
    if (m) {
      return new Var(m[0])
    }
  }
  {
    let m = expression.match(/^(.+)\+(.+)$/)
    if (m) {
      let l = evaluateExpression(m[1])
      if(l) {
        let r = evaluateExpression(m[2])
        if(r) {
          return new Add(l, r)
        }
      }
    }
  }
  return null
}