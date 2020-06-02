import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { TicketTableComponent } from '../ticket-table/ticket-table.component';



@NgModule({
  declarations: [
    DashboardComponent,
    TicketTableComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule
  ]
})
export class DashboardModule { }
