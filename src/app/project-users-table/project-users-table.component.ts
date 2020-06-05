import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserTableItem } from '../user-table/user-table.component';
import { ProjectsService } from '../project/project.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Project } from '../project/project.model';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-project-users-table',
  templateUrl: './project-users-table.component.html',
  styleUrls: ['./project-users-table.component.css']
})
export class ProjectUsersTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() selectedProject: Project;
  @Input() selectedProjectID: string;
  selectedProjectUsers: Observable<User[]>;
  selectedUsersCollection: AngularFirestoreCollection<User>;

  displayedColumns = ['displayName', 'email', 'role', 'actions'];
  tableDataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<UserTableItem>;

  constructor(
    public projectsService: ProjectsService,
    public dialog: MatDialog,
    public afStore: AngularFirestore
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
  }

  ngOnChanges() {
    if (!!this.selectedProject) {
      this.selectedUsersCollection = this.afStore.collection('users', ref => {
        return ref.where('uid', 'in', this.selectedProject.assignedUsers);
      });

      this.selectedProjectUsers = this.selectedUsersCollection.valueChanges();
      this.selectedProjectUsers.subscribe((users) => {
        this.tableDataSource = new MatTableDataSource(users);
        this.tableDataSource.sort = this.sort;
        this.tableDataSource.paginator = this.paginator;
      });
    }
  }

  addUserToProject(): void {
    console.log('adding');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  async removeUserFromProject(user) {
    console.log(user);
  }
}
