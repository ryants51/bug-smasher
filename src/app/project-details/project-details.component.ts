import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {

    console.log(this.route.snapshot.params['projectID']);

    const projectUsers = [];
    const selectedProject = await firestore().collection('projects').doc(this.route.snapshot.params['projectID']).get();

    console.log(selectedProject.data());

    for (const assignedUserID of selectedProject.data().assignedUsers) {
      const assignedUsers = await firestore().collection('users').doc(assignedUserID).get();
      projectUsers.push(assignedUsers.data());
    }
    console.log(projectUsers);
  }

}
