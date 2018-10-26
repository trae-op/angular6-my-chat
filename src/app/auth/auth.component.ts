import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private authService: AuthService) { }

  public authForm: FormGroup;

  ngOnInit() {
    this.authForm =  this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwords: this.fb.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]]
      }, {validator: this.validateAreEqual})
    });
  }

  public send() {
    this.authService.register({
      name: this.authForm.value.username,
      email: this.authForm.value.email,
      password: this.authForm.value.passwords.password,
      confirm_password: this.authForm.value.passwords.confirm_password
    })
      .subscribe(response => console.log('Welcome to the Chat!'));
  }

  private validateAreEqual(fieldControl: FormControl): { invalid: boolean } {
    if (fieldControl.get('password').value !== fieldControl.get('confirm_password').value) {
      return {invalid: true};
    }
  }

}
