import {Component, ViewChild} from '@angular/core';
import {FileSelectEvent, FileUpload, FileUploadEvent} from "primeng/fileupload";
import {IUserFromCsv} from "../../_models/user-from-csv.interface";
import {NgxCsvParser, NgxCSVParserError} from "ngx-csv-parser";
import {UsersFromCsvService} from "../../_services/users-from-csv.service";
import {UserModel} from "../../_models/user-model";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  @ViewChild('fileUpload') fileUploadComponent!: FileUpload;
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

  private csvToUser(csv: Array<string[]>) {
    const userFromCsvList: IUserFromCsv[] = [];

    const nameColIndex = csv[0].findIndex(e => e === 'NAME');
    const emailColIndex = csv[0].findIndex(e => e === 'EMAIL');
    const passwordColIndex = csv[0].findIndex(e => e === 'PASSWORD');
    const groupColIndex = csv[0].findIndex(e => e === 'GROUP');
    const roleColIndex = csv[0].findIndex(e => e === 'ROLE');
    const siteNameColIndex = csv[0].findIndex(e => e === 'SITENAME');
    const phoneBaseColIndex = csv[0].findIndex(e => e === 'PHONEBASE');

    for(let i = 1; i < csv.length; i++) {
      const userFromCsv: IUserFromCsv = {
        NAME: csv[i][nameColIndex],
        EMAIL: csv[i][emailColIndex],
        PASSWORD: csv[i][passwordColIndex],
        GROUP: csv[i][groupColIndex],
        ROLE: csv[i][roleColIndex],
        SITENAME: csv[i][siteNameColIndex],
        PHONEBASE: csv[i][phoneBaseColIndex],
      };
      userFromCsvList.push(userFromCsv);
    }

    return userFromCsvList;
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
