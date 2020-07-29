import { Component, OnInit, AfterViewInit, OnChanges, Input, ViewChild } from '@angular/core';
import { Project } from '../project/project.model';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Ticket } from '../ticket/ticket.model';
import { TicketService } from '../ticket/ticket.service';
import { NewTicketDialogComponent } from '../new-ticket-dialog/new-ticket-dialog.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-project-tickets-table',
  templateUrl: './project-tickets-table.component.html',
  styleUrls: ['./project-tickets-table.component.css']
})
export class ProjectTicketsTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() selectedProject: Project;
  @Input() selectedProjectID: string;
  selectedProjectTickets: Observable<Ticket[]>;
  selectedTicketsCollection: AngularFirestoreCollection<Ticket>;
  snapshot: any;

  displayedColumns = ['title', 'creator', 'developer', 'status', 'dateCreated', 'actions'];
  tableDataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public afStore: AngularFirestore,
    public ticketService: TicketService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
  }

  ngOnChanges() {
    if (!!this.selectedProject) {
      this.selectedTicketsCollection = this.afStore.collection('tickets', ref => {
        return ref.where('uid', 'in', this.selectedProject.tickets).where('status', '==', 'Open');
      });

      this.selectedProjectTickets = this.selectedTicketsCollection.valueChanges();
      this.selectedProjectTickets.subscribe((tickets) => {
        // tslint:disable-next-line: prefer-const
        console.log(tickets);
        for (let ticket of tickets) {
          this.afStore.doc(`users/${ticket.assignedUser}`).ref.get().then((doc) => {
            ticket.assignedUser = doc.exists ? doc.data().displayName : 'Unknown user';
          });
        }

        this.tableDataSource = new MatTableDataSource(tickets);
        this.tableDataSource.sort = this.sort;
        this.tableDataSource.paginator = this.paginator;
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

   openDialog(): void {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '500px',
      height: '420px',
      hasBackdrop: true,
      data: {title: '', description: '', priority: '', type: ''}
    });

    const parentProject = this.afStore.collection('projects').doc(this.selectedProjectID);

    dialogRef.afterClosed().subscribe(({title, description, priority, type, assignedUser}) => {
      this.ticketService.createNewTicket(title, description, priority, type, this.selectedProjectID, assignedUser);
    });
  }

  openTicket(ticket) {
    console.log(ticket);
  }

}
