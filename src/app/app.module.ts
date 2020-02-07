import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TexComponent } from './tex/tex.component';
import { ExpComponent } from './exp/exp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { MatrixComponent } from './matrix/matrix.component';
import { CellComponent } from './cell/cell.component';
import { RowComponent } from './row/row.component';

@NgModule({
  declarations: [
    AppComponent,
    TexComponent,
    ExpComponent,
    MatrixComponent,
    CellComponent,
    RowComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
