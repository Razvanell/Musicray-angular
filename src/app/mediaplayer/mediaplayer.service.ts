import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MediaplayerService {
  private playlist: string[] = [];
  private currentIndex = -1;
  private apiServerUrl = environment.apiBaseUrl;

  private audioFileSource = new BehaviorSubject<string>("");
  currentAudioFileSource = this.audioFileSource.asObservable();

  tracks: any[] = [];

  // History of played tracks (URLs)
  private playHistory: string[] = [];
  private historyIndex: number = -1;

  constructor() { }

  public setPlaylist(sources: string[]): void {
    this.playlist = sources;
    this.currentIndex = 0;
    this.changeAudioFileSource(this.playlist[0]);
    this.resetHistory(this.playlist[0]);
  }

  // Reset history when a new track is set directly
  private resetHistory(trackUrl: string) {
    this.playHistory = [trackUrl];
    this.historyIndex = 0;
  }

  public playRandomSong(): void {
    if (!this.tracks || this.tracks.length === 0) {
      alert('No tracks available to play!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.tracks.length);
    const randomTrack = this.tracks[randomIndex];
    const trackUrl = `${this.apiServerUrl}/track/play/${randomTrack.id}`;

    this.changeAudioFileSource(trackUrl);
    this.addToHistory(trackUrl);

    console.log(`Playing random track: ${randomTrack.title} by ${randomTrack.artist}`);
  }

  private addToHistory(trackUrl: string): void {
    // If we are not at the end of history (user pressed prev then played new random),
    // remove forward history before adding new
    if (this.historyIndex < this.playHistory.length - 1) {
      this.playHistory = this.playHistory.slice(0, this.historyIndex + 1);
    }

    this.playHistory.push(trackUrl);
    this.historyIndex = this.playHistory.length - 1;
  }

  public playPreviousTrack(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const prevTrack = this.playHistory[this.historyIndex];
      this.changeAudioFileSource(prevTrack);
    } else {
      console.log('No previous track in history');
    }
  }

  public playNextTrack(): void {
    if (this.historyIndex < this.playHistory.length - 1) {
      this.historyIndex++;
      const nextTrack = this.playHistory[this.historyIndex];
      this.changeAudioFileSource(nextTrack);
    } else {
      // If no next in history, fallback to random or playlist
      this.playRandomSong();
    }
  }

  public changeAudioFileSource(source: string): void {
    this.audioFileSource.next(source);
  }
}
