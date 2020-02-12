import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Lineage, Exp, Add, Var, Scalar, Matrix, Mul, Fraction, Negate } from '../exp';
import { SystemService } from '../system.service';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounce, debounceTime, map, zip } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState, selectPredefinedVars } from '../reducers';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  expressionControl = new FormControl('', []);

  lineage: Lineage
  options:Observable<Option[]> = this.system.unusedVar.pipe(
    zip(this.store.pipe(select(selectPredefinedVars))),
    map(([varname, predefines])=>{
      let exp = this.lineage.exp
      let unusedVar = this.system.unusedVar
      let pres = predefines.map(x=>new Var(x) as Exp)
      let newvar = new Var(varname)
      let availables:Exp[] = [
        new Add(exp, newvar),
        new Mul(exp, newvar),
        new Matrix([[1,0],[0,1]].map(x=>x.map(y=>new Scalar(y) as Exp))),
        new Fraction(exp, newvar),
        new Fraction(newvar, exp),
        new Negate(exp)
      ]
      return (pres.concat(availables)).map(x=>new Option(x, x))
    })
  )
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApplyComponent>,
    private system:SystemService,
    private store:Store<{state:AppState}>
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
  onCancel() {
    this.dialogRef.close()
  }
  onRemove() {
    this.dialogRef.close("remove")
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
    let m = expression.match(/^-(.+)$/)
    if (m) {
      let e = evaluateExpression(m[1])
      if (e) {
        return new Negate(e)
      }
    }
  }
  {
    let m = expression.match(/^[\d\.]+$/)
    if (m) {
      
      return new Scalar(Number(m[0]))
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
  {
    let m = expression.match(/^(.+)\/(.+)$/)
    if (m) {
      let l = evaluateExpression(m[1])
      if(l) {
        let r = evaluateExpression(m[2])
        if(r) {
          return new Fraction(l, r)
        }
      }
    }
  }
  return null
}