import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { firestore } from 'firebase';
import { Project } from '../project/project.model';
import { NewProjectDialogComponent } from '../new-project-dialog/new-project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from '../project/project.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore/';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  projectSnapshot;
  selectedProject;
  selectedProjectID: string;
  projectUsers = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.selectedProjectID = params.projectID;

      firestore().collection('projects').doc(this.selectedProjectID).onSnapshot(async (doc) => {
          this.selectedProject = doc.data();

          for (const assignedUserID of this.selectedProject.assignedUsers) {
            const assignedUsers = await firestore().collection('users').doc(assignedUserID).get();
            this.projectUsers.push(assignedUsers.data());
          }
      });
    });
  }

  editProject() {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px',
      data: {
        name: this.selectedProject.projectName,
        description: this.selectedProject.projectDescription,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.projectsService.editProject(this.selectedProjectID, result.title, result.description);
    });
  }
}
