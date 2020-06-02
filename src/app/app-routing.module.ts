import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard'; // This will be used to do access any pages that the admin needs
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'roleManagement', component: RoleManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'myProjects', component: MyProjectsComponent, canActivate: [AuthGuard] },
  { path: 'myProjects/:projectID', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    AdminGuard
  ]
})
export class AppRoutingModule { }
