import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
// Routing
import {ReportToDocumentsRoutingModule} from "./report-to-documents-routing.module";
// Components
import {MainComponent} from "./_components/main/main.component";
// Services
import {ExcelService} from "./_services/excel.service";
// PrimeNG
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {AutoCompleteModule} from "primeng/autocomplete";
import {TableModule} from "primeng/table";
import {StepperModule} from "primeng/stepper";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {SharedModule} from "../_shared/shared.module";


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    ReportToDocumentsRoutingModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    AutoCompleteModule,
    TableModule,
    FormsModule,
    StepperModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    BreadcrumbModule,
    SharedModule
  ],
  providers: [ExcelService],
  bootstrap: []
})
export class ReportToDocumentsModule { }
