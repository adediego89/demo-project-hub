import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { HeaderComponent } from './_components/header/header.component';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [HeaderComponent]
})
export class SharedModule { }
