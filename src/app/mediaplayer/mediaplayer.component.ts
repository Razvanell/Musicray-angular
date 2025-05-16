import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaplayerService } from './mediaplayer.service';
import { Subscription } from 'rxjs';
import { TrackService } from '../track/track.service';

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.css']
})
export class MediaplayerComponent implements OnInit, OnDestroy {
  public audioFileSource: string = '';
  private subscription!: Subscription;

  constructor(
  private mediaplayerService: MediaplayerService,
  private trackService: TrackService
) {}

  ngOnInit(): void {
    this.subscription = this.mediaplayerService.currentAudioFileSource
      .subscribe(source => this.audioFileSource = source);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onTrackEnded(): void {
  this.trackService.playRandomSong();
}
}
