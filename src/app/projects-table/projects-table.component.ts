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
import { AngularFirestore } from '@angular/fire/firestore';

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

  constructor(
    public projectsService: ProjectsService,
    private authService: AuthService,
    public dialog: MatDialog,
    public afStore: AngularFirestore
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.projectsService.allProjects.subscribe((projects) => {
          const addProjectsToTable = async () => {
            const filteredProjects = [];

            await asyncForEach(projects, async (project) => {
              if (project.projectCreator === user.displayName) {
                filteredProjects.push(project);
              } else {
                await asyncForEach(project.tickets, async (ticket) => {
                  await this.afStore.doc(`tickets/${ticket}`).ref.get().then((doc) => {
                    if (doc.data().assignedUser === user.uid) {
                      filteredProjects.push(project);
                    }
                  });
                });
              }
            });

            this.tableDataSource = new MatTableDataSource(filteredProjects);
            this.tableDataSource.sort = this.sort;
            this.tableDataSource.paginator = this.paginator;
          };

          addProjectsToTable();
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px',
      hasBackdrop: true,
      data: {name: '', description: '', isEdit: false}
    });

    dialogRef.afterClosed().subscribe(result => {
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
