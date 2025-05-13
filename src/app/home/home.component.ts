import { Component } from '@angular/core';
import { TrackService } from '../track/track.service';   // Import TrackService
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';  // Import MediaplayerService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public tracks: any[] = []; // Array to hold the tracks

  constructor(private trackService: TrackService, 
              private mediaplayerService: MediaplayerService) {}

  ngOnInit() {
    // Fetch tracks on component initialization
    this.getTracks();
  }

  // Fetch tracks from the TrackService
  public getTracks(): void {
    this.trackService.getTracks().subscribe(
      (response: any[]) => {
        this.tracks = response; // Store tracks in the tracks array
      },
      (error: any) => {
        console.error('Error fetching tracks:', error);
      }
    );
  }

  // Play a random track
  public playRandomSong(): void {
    if (this.tracks.length === 0) {
      alert('No tracks available to play!');
      return;
    }

    // Select a random track
    const randomIndex = Math.floor(Math.random() * this.tracks.length);
    const randomTrack = this.tracks[randomIndex];

    // Call the playTrack method from the MediaplayerService to play the random track
    this.mediaplayerService.changeAudioFileSource(`http://localhost:8080/api/track/play/${randomTrack.id}`);
    console.log(`Playing random track: ${randomTrack.title} by ${randomTrack.artist}`);
  }
}
