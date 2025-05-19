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

  constructor(private http: HttpClient, private router: Router) {
    // Restore user from localStorage on service start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  public loginUser(data: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/login`, data);
  }

  public postUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/register`, user);
  }

  public setUser(user: User): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user)); // persist user and token
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public getToken(): string | null {
    return this.user?.token ?? null;
  }

  public isUserLogged(): boolean {
    return !!this.user && !!this.user.token;
  }

  public logOut(): void {
    this.user = undefined;
    localStorage.removeItem('user'); // clear storage on logout
    this.router.navigate(['/login']);
  }
}
