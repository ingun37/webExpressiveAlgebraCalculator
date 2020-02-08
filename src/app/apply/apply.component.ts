import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Lineage } from '../exp';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  lineage: Lineage
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.lineage = data.lineage
  }

  ngOnInit() {
  }

}
