import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Playlist } from './playlist';
import { PlaylistService } from './playlist.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private mediaplayerService: MediaplayerService,
    private formBuilder: FormBuilder
  ) {
    this.postForm = this.formBuilder.group({
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

  public onOpenPlaylistModal(playlist: Playlist | null, mode: string): void {
    // Bootstrap 5: trigger modal via JS API or [attr.data-bs-toggle] in template
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'post') {
      button.setAttribute('data-bs-target', '#postPlaylistModal');
    }

    if (mode === 'delete' && playlist) {
      this.deletePlaylist = playlist;
      button.setAttribute('data-bs-target', '#deletePlaylistModal');
    }

    if (mode === 'put' && playlist) {
      this.putPlaylist = playlist;
      button.setAttribute('data-bs-target', '#putPlaylistModal');
    }

    if (container) {
      container.appendChild(button);
      button.click();
    } else {
      console.error('Container element not found');
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
      error: (error: HttpErrorResponse) => alert(error.message)
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
