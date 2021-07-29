import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecordsComponent } from './records/records.component';

const routes: Routes = [
  { path: '', component: RecordsComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
