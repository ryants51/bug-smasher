import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  // Encapsulation has to be disabled in order for the
  // component style to apply to the select panel.
  encapsulation: ViewEncapsulation.None,
})
export class RoleManagementComponent implements OnInit {
  userRoles = new FormControl();
  usersSelected = new FormControl();
  roleOptions: string[] = ['Admin', 'Manager', 'Developer'];

  constructor(
    public usersService: UserService
  ) { }

  ngOnInit(): void {}

  onUpdateUserRole() {
    this.usersService.updateUserRole(this.usersSelected.value, this.userRoles.value);
  }
}
