import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from './track';
import { environment } from '../../environments/environment';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private apiServerUrl = environment.apiBaseUrl;
  private tracks: Track[] = [];

  constructor(
    private http: HttpClient,
    private mediaplayerService: MediaplayerService
  ) {}

  public getRandomTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiServerUrl}/track/random`);
  }

  public getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiServerUrl}/track/all`);
  }

  // Store tracks in memory
  public setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }

  public getStoredTracks(): Track[] {
    return this.tracks;
  }

}
