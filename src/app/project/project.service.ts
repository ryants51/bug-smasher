import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projectsCollection: AngularFirestoreCollection<Project>;
  allProjects: Observable<Project[]>;

  loggedInUser: User;

  constructor(
   public afStore: AngularFirestore,
   private authService: AuthService
  ) {
    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.loggedInUser = user;
        this.projectsCollection = this.afStore.collection('projects');
        this.allProjects = this.projectsCollection.valueChanges({idField: 'projectID'});
      }
    });
  }

  createNewProject(title: string, description: string) {
    const newProject: Project = {
      projectCreator: this.loggedInUser.displayName,
      projectDescription: description,
      projectName: title,
      tickets: []
    };
    this.afStore.collection('projects').add(newProject);
  }

  editProject(projectID: string, title: string, description: string) {
    firestore().collection('projects').doc(projectID).update({
      projectName: title,
      projectDescription: description
    });
  }
}
