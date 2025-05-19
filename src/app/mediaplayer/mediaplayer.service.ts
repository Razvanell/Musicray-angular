import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MediaplayerService {
  private playlist: string[] = [];
  private apiServerUrl = environment.apiBaseUrl;

  private audioFileSource = new BehaviorSubject<string>("");
  currentAudioFileSource = this.audioFileSource.asObservable();

  tracks: any[] = [];

  // Two stacks for history navigation
  private backStack: string[] = [];
  private forwardStack: string[] = [];
  private currentTrack: string | null = null;

  constructor() { }

  public setPlaylist(sources: string[]): void {
    this.playlist = sources;
    if (sources.length > 0) {
      this.playNewTrack(sources[0]);
    }
  }

  private playNewTrack(trackUrl: string) {
    if (this.currentTrack) {
      this.backStack.push(this.currentTrack);
    }
    this.currentTrack = trackUrl;
    this.forwardStack = [];
    this.changeAudioFileSource(trackUrl);
  }

  public playRandomSong(): void {
    if (!this.tracks || this.tracks.length === 0) {
      alert('No tracks available to play!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.tracks.length);
    const randomTrack = this.tracks[randomIndex];
    const trackUrl = `${this.apiServerUrl}/track/play/${randomTrack.id}`;

    this.playNewTrack(trackUrl);
    console.log(`Playing random track: ${randomTrack.title} by ${randomTrack.artist}`);
  }

  public playPreviousTrack(): void {
    if (this.backStack.length === 0) {
      console.log('No previous track in history');
      return;
    }

    if (this.currentTrack) {
      this.forwardStack.push(this.currentTrack);
    }
    this.currentTrack = this.backStack.pop()!;
    this.changeAudioFileSource(this.currentTrack);
  }

  public playNextTrack(): void {
    if (this.forwardStack.length > 0) {
      if (this.currentTrack) {
        this.backStack.push(this.currentTrack);
      }
      this.currentTrack = this.forwardStack.pop()!;
      this.changeAudioFileSource(this.currentTrack);
    } else {
      this.playRandomSong();
    }
  }

  public changeAudioFileSource(source: string): void {
    this.audioFileSource.next(source);
  }
}
