import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserTableItem } from '../user-table/user-table.component';
import { ProjectsService } from '../project/project.service';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';
import { Project } from '../project/project.model';
import { AuthService } from '../auth/auth.service';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User, firestore } from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css']
})
export class ProjectsTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['projectName', 'projectDescription', 'projectCreator', 'actions'];
  tableDataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<UserTableItem>;

  constructor(
    public projectsService: ProjectsService,
    private authService: AuthService,
    public dialog: MatDialog,
    public afStore: AngularFirestore
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log('something');

    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.projectsService.allProjects.subscribe((projects) => {
          this.tableDataSource = new MatTableDataSource(projects);
          this.tableDataSource.sort = this.sort;
          this.tableDataSource.paginator = this.paginator;
        });
      }
    });
  }

  openDialog(): void {
    console.log('here');
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projectsService.createNewProject(result.title, result.description);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  async openProject(project: Project) {
    console.log(project);
  }
}