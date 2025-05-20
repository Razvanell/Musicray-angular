import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MediaplayerService } from './mediaplayer.service';
import { Subscription } from 'rxjs';
import { TrackService } from '../track/track.service';
import { AIService } from '../utils/ai.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mediaplayer',
  imports: [CommonModule],
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.css']
})
export class MediaplayerComponent implements OnInit, OnDestroy {
  public audioFileSource: string = '';
  public currentTrack: any = "track";
  public repeat: boolean = false;

  private subscription!: Subscription;

  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;

  constructor(
    private mediaplayerService: MediaplayerService,
    private trackService: TrackService,
    private AIService: AIService
  ) { }

  ngOnInit(): void {
    // Subscribe to audio source updates
    this.subscription = this.mediaplayerService.currentAudioFileSource
      .subscribe(source => {
        this.audioFileSource = source;
        this.currentTrack = this.mediaplayerService.getCurrentTrack();
      });

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
    const target = event.target as HTMLElement;

    const isInputField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable;

    if (event.code === 'Space' && !isInputField) {
      event.preventDefault();
      const audio = this.audioPlayerRef?.nativeElement;
      if (audio) {
        audio.paused ? audio.play() : audio.pause();
      }
    }
  }

  // AI Functionality
  fetchTrackInfoOpenAI() {
    const currentTrack = this.mediaplayerService.getCurrentTrack();
    if (!currentTrack) {
      alert('No track is currently playing.');
      return;
    }
    this.AIService.fetchTrackInfoOpenAI(currentTrack).subscribe({
      next: (response: string) => alert(response),
      error: (err: any) => {
        alert('Error fetching info from OpenAI. Please try again later.');
        console.error(err);
      }
    });
  }

}

