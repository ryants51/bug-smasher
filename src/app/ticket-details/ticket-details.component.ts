import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firestore } from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { TicketService } from '../ticket/ticket.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  selectedTicket;
  originalTicket;
  selectedTicketID: string;
  projectName: string;

  ticketForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public usersService: UserService,
    private ticketService: TicketService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ticketForm = new FormGroup({
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
      }),
      status: new FormControl(null, {
        validators: [
          Validators.required
        ],
      })
    });



    this.route.params.subscribe(async (params: Params) => {
      this.selectedTicketID = params.ticketID;

      firestore().collection('tickets').doc(this.selectedTicketID).onSnapshot((doc) => {
        this.selectedTicket = doc.data();
        this.originalTicket = {...this.selectedTicket};

        firestore().collection('projects').doc(this.selectedTicket.parentProject).onSnapshot((project) => {
          this.projectName = project.data().projectName;
        });
      });
    });
  }

  updateTicketDetails() {
    if (this.ticketForm.valid) {
      this.ticketService.editTicket(this.selectedTicketID, this.ticketForm.value);

      Object.keys(this.originalTicket).forEach((element) => {
        if (this.originalTicket[element] !== this.selectedTicket[element]) {
          this.ticketService.addHistoryToTicket(this.selectedTicketID, this.originalTicket[element], this.selectedTicket[element], element);
        }
      });
    }
  }
}
