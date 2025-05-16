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

  // Play a random track from stored tracks
  public playRandomSong(): void {
    if (this.tracks.length === 0) {
      alert('No tracks available to play!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.tracks.length);
    const randomTrack = this.tracks[randomIndex];

    this.mediaplayerService.changeAudioFileSource(
      `${this.apiServerUrl}/track/play/${randomTrack.id}`
    );
    console.log(`Playing random track: ${randomTrack.title} by ${randomTrack.artist}`);
  }
}
