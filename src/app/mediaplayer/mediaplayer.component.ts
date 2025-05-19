import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  public repeat: boolean = false;

  private subscription!: Subscription;

  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(
    private mediaplayerService: MediaplayerService,
    private trackService: TrackService
  ) { }

  ngOnInit(): void {
    // Subscribe to audio source updates
    this.subscription = this.mediaplayerService.currentAudioFileSource
      .subscribe(source => this.audioFileSource = source);

    // Load tracks from TrackService and assign to MediaplayerService
    this.trackService.getTracks().subscribe(tracks => {
      this.mediaplayerService.tracks = tracks;

      // Optionally, initialize playlist here or just play random
      // If you have playlist URLs, call setPlaylist(...)
      // Or start with a random song here
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onTrackEnded(): void {
    if (this.repeat) {
      const audio = this.audioPlayerRef?.nativeElement;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      this.mediaplayerService.playRandomSong();
    }
  }


  prevTrack(): void {
    this.mediaplayerService.playPreviousTrack();
  }

  nextTrack(): void {
    this.mediaplayerService.playNextTrack();
  }

  toggleRepeat(): void {
    this.repeat = !this.repeat;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      const audio = this.audioPlayerRef?.nativeElement;
      if (audio) {
        audio.paused ? audio.play() : audio.pause();
      }
    }
  }
}

