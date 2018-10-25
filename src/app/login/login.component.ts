import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router,
              private localStorage: LocalStorageService) { }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    if (this.localStorage.get('Authorization')) {
      console.log(this.localStorage.get('Authorization'));
      this.router.navigate(['/chat']);
    }
  }

  public send() {
    this.loginService.login(this.loginForm.value)
      .subscribe(response => console.log('Welcome to the Chat!'));
  }

}
