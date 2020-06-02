import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.css']
})
export class NewProjectDialogComponent implements OnInit {
  projectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
        })
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateNewProject() {
    if(!this.projectForm.invalid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
