
import { Component, OnInit, ViewChild } from '@angular/core';
import {UsersService} from './users.service';
import {UsersModel} from './users.model';
import {MatTable} from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  public users: UsersModel[] = [];
  public displayedColumns: string[] = ['_id', 'name', 'email', 'created_at', 'role', 'delete'];

  constructor(private usersService: UsersService) {}

  @ViewChild('usersTable') usersTable: MatTable<any>;

  ngOnInit() {
    this.getUsers();
  }

  public getUsers() {
    this.usersService.getUsers()
      .subscribe(response => this.users = response);
  }

  public deleteUser(user, index) {
    this.usersService.deleteUser(user)
      .then(data => {
        if (data.deleted) {
          this.users.splice(index, 1);
          this.usersTable.renderRows();
        }
        this.usersService.openSnackBar(data.message);
      })
      .catch(error => console.error(error));
  }

}
