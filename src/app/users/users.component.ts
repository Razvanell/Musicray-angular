import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public searchKey: string = '';  // Added searchKey for two-way binding

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Fetch the full user list
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

  // Search users based on the input key
  public searchUsers(key: string): void {
    console.log(key); // Log the search key to check if the method is triggered
    if (!key) {
      // If the search input is empty, fetch all users
      this.getUsers();
      return;
    }
    const results: User[] = this.users.filter(user =>
      user.email.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
      user.firstName.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
      user.lastName.toLocaleLowerCase().includes(key.toLocaleLowerCase())
    );
    this.users = results;
  }

  // Navigate to a user's playlists page
  public onViewUserPlaylists(userId: number): void {
    this.router.navigate(['/playlist', userId]);
  }
}
