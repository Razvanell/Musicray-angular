import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Playlist } from './playlist';
import { PlaylistService } from './playlist.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist',
  imports: [ReactiveFormsModule, CommonModule, FormsModule], 
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  public playlists: Playlist[] = [];
  public userId!: number;
  public deletePlaylist!: Playlist;
  public putPlaylist!: Playlist;
  postForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private mediaplayerService: MediaplayerService,
    private FormBuilder: FormBuilder) {
    this.postForm = this.FormBuilder.group({
      name: ["", Validators.minLength(2)]
    });
   }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.getUserPlaylists();
  }

  public getUserPlaylists(): void {
    this.playlistService.getUserPlaylists(this.userId).subscribe(
      (response: Playlist[]) => {
        this.playlists = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

public onOpenPlaylistModal(playlist: Playlist | null, mode: string): void {
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');

  if (mode === 'post') {
    button.setAttribute('data-target', '#postPlaylistModal');
  }

  if (mode === 'delete' && playlist) {
    this.deletePlaylist = playlist;
    button.setAttribute('data-target', '#deletePlaylistModal');
  }

  if (mode === 'put' && playlist) {
    this.putPlaylist = playlist;
    button.setAttribute('data-target', '#putPlaylistModal');
  }

  if (container) {
    container.appendChild(button);
    button.click();
  } else {
    console.error('Container element not found');
  }
}


  public onPostPlaylist(): void {
    const postPlaylistForm = document.getElementById('post-playlist-form');
    if (postPlaylistForm) {
      postPlaylistForm.click();
    } else {
      console.error("'post-playlist-form' element not found");
    }
    this.playlistService.postPlaylist(this.postForm.value, this.userId).subscribe(
      (response: Playlist) => {
        this.getUserPlaylists();
        this.postForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.postForm.reset();
      }
    );
  }

  public onDeletePlaylist(playlistId: number): void {
    this.playlistService.deletePlaylist(playlistId).subscribe(
      (response: void) => {
        this.getUserPlaylists();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onPutPlaylist(playlist: Playlist): void {
    this.playlistService.putPlaylist(playlist).subscribe(
      (response: Playlist) => {
        this.getUserPlaylists();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public playTrack(id: number): void {
    this.mediaplayerService.changeAudioFileSource("http://localhost:8081/api/track/play/" + id);
  }

  public onRemoveTrack(playlist: Playlist, trackId: number): void {
    this.playlistService.removeTrackFromPlaylist(playlist, trackId).subscribe(
      (response: Playlist) => {
        this.getUserPlaylists();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
