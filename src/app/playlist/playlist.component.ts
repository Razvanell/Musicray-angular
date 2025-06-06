import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../navbar/auth.service';
import { Playlist } from './playlist';
import { PlaylistService } from './playlist.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  public playlists: Playlist[] = [];
  public userId!: number;
  public deletePlaylist!: Playlist;
  public putPlaylist!: Playlist;
  postForm: FormGroup;
  putForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private mediaplayerService: MediaplayerService,
    private formBuilder: FormBuilder
  ) {
    this.postForm = this.formBuilder.group({
      name: ['', Validators.minLength(2)]
    });
    this.putForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.minLength(2)]
    });

  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.getUserPlaylists();
  }

  public getUserPlaylists(): void {
    this.playlistService.getUserPlaylists(this.userId).subscribe({
      next: (response: Playlist[]) => this.playlists = response,
      error: (error: HttpErrorResponse) => alert(error.message)
    });
  }

  public isOwnPlaylist(): boolean {
    const loggedInUser = this.authService.getUser();
    return !!loggedInUser && loggedInUser.id === this.userId;
  }

  public onOpenPlaylistModal(playlist: Playlist | null, mode: string): void {
    let modalId = '';

    if (mode === 'post') {
      modalId = 'postPlaylistModal';
    } else if (mode === 'delete' && playlist) {
      this.deletePlaylist = playlist;
      modalId = 'deletePlaylistModal';
    } else if (mode === 'put' && playlist) {
      this.putPlaylist = playlist;
      this.putForm.patchValue({
        id: playlist.id,
        name: playlist.name
      });
      modalId = 'putPlaylistModal';
    }

    if (!modalId) return;

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found:', modalId);
    }
  }

  public onPostPlaylist(): void {
    const closeButton = document.getElementById('post-playlist-form');
    closeButton?.click();

    this.playlistService.postPlaylist(this.postForm.value, this.userId).subscribe({
      next: () => {
        this.getUserPlaylists();
        this.postForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        this.postForm.reset();
      }
    });
  }

  public onDeletePlaylist(playlistId: number): void {
    this.playlistService.deletePlaylist(playlistId).subscribe({
      next: () => this.getUserPlaylists(),
      error: (error: HttpErrorResponse) => alert(error.message)
    });
  }

  public onPutPlaylist(playlist: Playlist): void {
    this.playlistService.putPlaylist(playlist).subscribe({
      next: () => this.getUserPlaylists(),
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        this.putForm.reset();
      }
    });
  }

  public playTrack(id: number): void {
    this.mediaplayerService.changeAudioFileSource(`http://localhost:8080/api/track/play/${id}`);
  }

  public onRemoveTrack(playlist: Playlist, trackId: number): void {
    this.playlistService.removeTrackFromPlaylist(playlist, trackId).subscribe({
      next: () => this.getUserPlaylists(),
      error: (error: HttpErrorResponse) => alert(error.message)
    });
  }
}
