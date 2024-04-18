import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  items = [
    { label: 'Build and export reports to Document workspaces', routerLink: '/report-to-documents', icon: 'pi pi-file-export' },
    { label: 'User creation by .csv', routerLink: '/users-from-csv', icon: 'pi pi-user-plus' },
  ];
}
