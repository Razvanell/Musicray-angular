import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public deleteUser: User = this.getEmptyUser();
  public putUser: User = this.getEmptyUser();

  private getEmptyUser(): User {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      imageUrl: '',
      enabled: false,
      token: ''
    };
  }

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchUsers(key: string): void {
    console.log(key);
    const results: User[] = [];
    for (const user of this.users) {
      if (user.email.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          user.firstName.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          user.lastName.toLocaleLowerCase().includes(key.toLocaleLowerCase())) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !key) {
      setTimeout(() => {
        this.getUsers();
      }, 500);
    }
  }

  public onViewUserPlaylists(userId: number): void {
    this.router.navigate(['/playlist', userId]);
  }
}

