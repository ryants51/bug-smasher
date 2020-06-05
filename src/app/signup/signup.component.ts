import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMessage = '';
  successMessage = '';
  registerForm: FormGroup;

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
   }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.email
        ],
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
     displayName: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  tryRegister(email: string, password: string){
    if (this.registerForm.valid) {
      this.authService.signup(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.displayName).then(
        res => {},
        err => {
          console.log(err);
        }
      );
    }
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin().then(
      res => {
        this.router.navigate(['/user']);
      },
      err => console.log(err)
    );
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin().then(
      res => {
        this.router.navigate(['/dashboard']);
      },
      err => console.log(err)
    );
  }

}
