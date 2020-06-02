import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  successMessage = '';
  isDemo = false;
  loginForm: FormGroup;

  userTypes = [
    {
      typeName: 'Admin',
      iconName: 'admin',
      iconFilePath: 'admin',
      userEmail: 'adminDemo@bugsmasher.com',
      userPassword: 'adminDemo'
    },
    {
      typeName: 'Manager',
      iconName: 'manager',
      iconFilePath: 'manager',
      userEmail: 'managerDemo@bugsmasher.com',
      userPassword: 'managerDemo'
    },
    {
      typeName: 'Developer',
      iconName: 'developer',
      iconFilePath: 'developer',
      userEmail: 'developerDemo@bugsmasher.com',
      userPassword: 'developerDemo'
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'googleLogo',
      this.sanitizer.bypassSecurityTrustResourceUrl(`../assets/googleLogo.svg`)
    );
    this.iconRegistry.addSvgIcon(
      'facebookLogo',
      this.sanitizer.bypassSecurityTrustResourceUrl(`../assets/facebookLogo.svg`)
    );
    this.userTypes.forEach((userType) => {
      this.iconRegistry.addSvgIcon(
        userType.iconName,
        this.sanitizer.bypassSecurityTrustResourceUrl(`../assets/${userType.iconFilePath}.svg`)
      );
    });
   }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email
        ],
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  tryLogin(email: string, password: string){
    this.authService.login(email, password)
    .then(
      res => {},
      err => {
        console.log(err);
        this.errorMessage = err.message;
      }
    );
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
    .then(
      res => {},
      err => console.log(err)
    );
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
    .then(
      res => {},
      err => console.log(err)
    );
  }

}
