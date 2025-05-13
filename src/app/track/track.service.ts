import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from './track';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getFiveTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiServerUrl}/track/random`);
  }

  public getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiServerUrl}/track/all`);
  }

}
