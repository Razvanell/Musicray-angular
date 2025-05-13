import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | undefined;
  test: String = "hello";
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public loginUser(data: any) {
    return this.http.post(`${this.apiServerUrl}/login`, data);
  }

  public postUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/registration`, user);
  }

  public setUser(user: User) {
    this.user = user;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getToken(): string | undefined{
    if(this.user) {
      return this.user.token;
    }
    return undefined;
  }

  public isUserLoged(): boolean {
    return this.user != undefined;
  }

  public logOut(): void {
    this.user = undefined;
    window.location.reload;
  }
  
}
