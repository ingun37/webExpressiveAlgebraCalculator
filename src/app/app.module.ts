import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TexComponent } from './tex/tex.component';
import { ExpComponent } from './exp/exp.component';

@NgModule({
  declarations: [
    AppComponent,
    TexComponent,
    ExpComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
