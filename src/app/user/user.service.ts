import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user!: User;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public deleteUser(email: String): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${email}`);
  }

  public putUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/user/put`, user);
  }

}
