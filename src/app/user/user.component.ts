import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
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

  public onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    } else if (mode === 'put') {
      this.putUser = user;
      button.setAttribute('data-target', '#putUserModal');
    }

    if (container) {
      container.appendChild(button);
    } else {
      console.error('Main container not found');
    }

    button.click();
  }

  public onDeleteUser(email: string): void {
    this.userService.deleteUser(email).subscribe(
      () => {
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onPutUser(user: User): void {
    this.userService.putUser(user).subscribe(
      () => {
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onViewUserPlaylists(userId: number): void {
    this.router.navigate(['/playlist', userId]);
  }
}
