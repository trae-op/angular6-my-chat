import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private loginService: LoginService) { }

  public loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public send() {
    this.loginService.login(this.loginForm.value)
      .subscribe(response => console.log('Welcome to the Chat!', response));
  }

}
