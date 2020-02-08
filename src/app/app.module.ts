import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TexComponent } from './tex/tex.component';
import { ExpComponent } from './exp/exp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { MatrixComponent } from './matrix/matrix.component';
import { CellComponent } from './cell/cell.component';
import { ApplyComponent } from './apply/apply.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    TexComponent,
    ExpComponent,
    MatrixComponent,
    CellComponent,
    ApplyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ApplyComponent
  ],
})
export class AppModule { }
