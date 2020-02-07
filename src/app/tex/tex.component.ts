import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-tex',
  templateUrl: './tex.component.html',
  styleUrls: ['./tex.component.scss']
})
export class TexComponent implements OnInit {
  @Input() tex:string;
  constructor() { }

  ngOnInit() {
  }

}
