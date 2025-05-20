import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../navbar/search.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public searchKey: string = '';

  constructor(private router: Router,
    private userService: UserService,
    private searchService: SearchService) { }

  ngOnInit(): void {
    this.getUsers();

    this.searchService.searchKey$.subscribe(key => {
      this.searchUsers(key);
    });
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

  // Navigate to a user's playlists page
  public onViewUserPlaylists(userId: number): void {
    this.router.navigate(['/playlist', userId]);
  }
}
