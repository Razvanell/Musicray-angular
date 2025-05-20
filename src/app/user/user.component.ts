import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../navbar/search.service';
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

  constructor(private router: Router, private userService: UserService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.getUsers();

    this.searchService.searchKey$.subscribe(key => {
      this.searchUsers(key);
    });
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
    const lowerKey = key.toLocaleLowerCase().trim();

    if (!lowerKey) {
      this.getUsers();
      return;
    }

    const results = this.users.filter(user =>
      user.email.toLowerCase().includes(lowerKey) ||
      user.firstName.toLowerCase().includes(lowerKey) ||
      user.lastName.toLowerCase().includes(lowerKey)
    );

    this.users = results;
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
