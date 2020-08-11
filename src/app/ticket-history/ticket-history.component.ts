import { Component, OnInit, ViewChild, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Project } from '../project/project.model';
import { Observable, Subscription } from 'rxjs';
import { History } from 'src/app/ticket/history/history.model';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.css']
})
export class TicketHistoryComponent implements OnInit, AfterViewInit {

  @Input() ticketID: string;
  historyRecords: Observable<History[]>;
  historyRecordsCollection: AngularFirestoreCollection<History>;

  displayedColumns = ['property', 'oldValue', 'newValue', 'dateChanged'];
  tableDataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public afStore: AngularFirestore
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.historyRecordsCollection = this.afStore.collection(`tickets/${this.ticketID}/history`);
    this.historyRecords = this.historyRecordsCollection.valueChanges();

    this.historyRecords.subscribe(async (records) => {
      for (const record of records) {
        if (record.propertyChanged === 'assignedUser') {
          record.propertyChanged = 'Assigned User';

          await this.afStore.doc(`users/${record.oldValue}`).ref.get().then((doc) => {
            record.oldValue = doc.exists ? doc.data().displayName : 'Unknown user';
          });
          await this.afStore.doc(`users/${record.newValue}`).ref.get().then((doc) => {
            record.newValue = doc.exists ? doc.data().displayName : 'Unknown user';
          });
        }
      }

      this.tableDataSource = new MatTableDataSource(records);
      this.tableDataSource.sort = this.sort;
      this.tableDataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }
}
