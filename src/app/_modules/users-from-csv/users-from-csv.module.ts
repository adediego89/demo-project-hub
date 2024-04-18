import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './_components/main/main.component';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {StepperModule} from "primeng/stepper";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {UsersFromCsvRoutingModule} from "./users-from-csv-routing.module";
import {UsersFromCsvService} from "./_services/users-from-csv.service";
import {GroupsApiService} from "./_services/groups-api.service";
import {StationsApiService} from "./_services/stations-api.service";
import {RolesApiService} from "./_services/roles-api.service";
import {PhoneBaseApiService} from "./_services/phone-base-api.service";
import {SitesApiService} from "./_services/sites-api.service";
import {PhoneApiService} from "./_services/phone-api.service";
import {UsersApiService} from "./_services/users-api.service";
import {NgxCsvParserModule} from "ngx-csv-parser";
import {SharedModule} from "../_shared/shared.module";
import {BreadcrumbModule} from "primeng/breadcrumb";



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsersFromCsvRoutingModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    PaginatorModule,
    StepperModule,
    TableModule,
    FileUploadModule,
    NgxCsvParserModule,
    SharedModule,
    BreadcrumbModule
  ],
  providers: [
    UsersFromCsvService,
    GroupsApiService,
    StationsApiService,
    RolesApiService,
    PhoneBaseApiService,
    SitesApiService,
    PhoneApiService,
    UsersApiService
  ]
})
export class UsersFromCsvModule { }
