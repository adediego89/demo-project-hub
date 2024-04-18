import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./_guards/auth.guard";
import {MenuComponent} from "./_components/menu/menu.component";

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'report-to-documents',
    loadChildren: () => import('./_modules/report-to-documents/report-to-documents.module').then(m => m.ReportToDocumentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users-from-csv',
    loadChildren: () => import('./_modules/users-from-csv/users-from-csv.module').then(m => m.UsersFromCsvModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
