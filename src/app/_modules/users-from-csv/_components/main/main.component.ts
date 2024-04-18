import {Component, OnInit, ViewChild} from '@angular/core';
import {FileSelectEvent, FileUpload} from "primeng/fileupload";
import {IUserFromCsv} from "../../_models/user-from-csv.interface";
import {NgxCsvParser, NgxCSVParserError} from "ngx-csv-parser";
import {UsersFromCsvService} from "../../_services/users-from-csv.service";
import {UserModel} from "../../_models/user-model";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  @ViewChild('fileUpload') fileUploadComponent!: FileUpload;
  breadcrumbHomeItem: MenuItem | undefined;
  breadcrumbItems: MenuItem[] = [];


  stepperActive: number = 0;
  selectedFiles: File[] = [];
  isStep0Valid: boolean = false;
  parsedCsv: Array<string[]> = [];
  usersFromCsv: IUserFromCsv[] = [];
  loading: boolean = false;
  statusMessage: string = '';

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private usersFromCsvSvc: UsersFromCsvService) {}

  ngOnInit(): void {
    this.breadcrumbHomeItem = { icon: 'pi pi-home', routerLink: '/' };
    this.breadcrumbItems = [
      { label: 'Users from .csv file' }
    ];
  }

  onActiveStepChange(event: number) {
    this.stepperActive = event;
  }

  async onFileSelect(event: FileSelectEvent) {
    console.log('onFileSelect', event);
    this.selectedFiles = event.currentFiles;
    // Validate selected file against predefined csv schema
    this.parsedCsv = await this.parseCsv(this.selectedFiles[0]);
    this.isStep0Valid = this.validateFileFormat(this.parsedCsv);

    this.ngxCsvParser.parse(this.selectedFiles[0], { header: true, delimiter: ',', encoding: 'utf8' })
      .subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.usersFromCsv = result as IUserFromCsv[];
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });

  }

  async importUsers() {
    this.loading = true;
    this.statusMessage = 'Creating users...';

    const resultPromises: Promise<UserModel>[] = [];
    this.usersFromCsv.forEach(user => {
      resultPromises.push(this.usersFromCsvSvc.createUser(user));
    });

    const users = await Promise.all(resultPromises);
    console.log('promises resolved')
    await this.usersFromCsvSvc.postUserCreation(users);
    this.loading = false;
    this.statusMessage = 'Users successfully created';
  }

  private validateFileFormat(csv: Array<string[]>): boolean {
    if (!csv || !csv[0]) return false;
    const columnNames = csv[0];

    return columnNames.includes('NAME') &&
      columnNames.includes('EMAIL') &&
      columnNames.includes('PASSWORD') &&
      columnNames.includes('GROUP') &&
      columnNames.includes('ROLE') &&
      columnNames.includes('SITENAME') &&
      columnNames.includes('PHONEBASE');

  }

  private async parseCsv(file: File): Promise<Array<string[]>> {
    const colSeparator = ',';
    const lineSeparator = '\r\n';
    const textFromFile = await file.text();

    const csv: Array<string[]> = [];
    const lines = textFromFile.split(lineSeparator);
    lines.forEach(element => {
      const cols: string[] = element.split(colSeparator);
      csv.push(cols);
    });
    console.log(csv);
    return csv;
  }

  reset() {
    this.selectedFiles = [];
    this.usersFromCsv = [];
    this.parsedCsv = [];
    this.fileUploadComponent.clear();
    // Reset stepper
    this.stepperActive = 0;
  }

}
