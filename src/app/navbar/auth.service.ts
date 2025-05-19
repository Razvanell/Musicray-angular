import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router'; 
import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | undefined;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  public loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/login`, data);
  }

  public postUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/register`, user);
  }

  public setUser(user: User): void {
    this.user = user;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getToken(): string | undefined {
    return this.user?.token;
  }

  public isUserLoged(): boolean {
    return !!this.user;
  }

   public logOut(): void {
    this.user = undefined;
    this.router.navigate(['/login']);
  }
}
