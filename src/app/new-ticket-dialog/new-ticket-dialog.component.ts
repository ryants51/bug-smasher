import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user/user.service';

export interface DialogData {
  description: string;
  priority: string;
  title: string;
  type: string;
  assignedUser: string;
}

@Component({
  selector: 'app-new-ticket-dialog',
  templateUrl: './new-ticket-dialog.component.html',
  styleUrls: ['./new-ticket-dialog.component.css']
})
export class NewTicketDialogComponent implements OnInit {

  projectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewTicketDialogComponent>,
    public usersService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
      this.projectForm = new FormGroup({
        title: new FormControl(null, {
          validators: [
            Validators.required
          ],
        }),
        description: new FormControl(null, {
          validators: [
            Validators.required
          ]
        }),
        priority: new FormControl(null, {
          validators: [
            Validators.required
          ],
        }),
        type: new FormControl(null, {
          validators: [
            Validators.required
          ],
        }),
        assignedUser: new FormControl(null, {
          validators: [
            Validators.required
          ],
        })
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateNewProject() {
    if (!this.projectForm.invalid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

}
