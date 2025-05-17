import { Component, OnInit } from '@angular/core';
import { TrackService } from '../track/track.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private trackService: TrackService,
              private mediaplayerService: MediaplayerService

  ) {}

  ngOnInit(): void {
    this.trackService.getTracks().subscribe(
      (response: any[]) => {
        this.trackService.setTracks(response); // Save fetched tracks
      },
      (error: any) => {
        console.error('Error fetching tracks:', error);
      }
    );
  }

  public playRandomSong(): void {
    this.mediaplayerService.playRandomSong();
  }
}
