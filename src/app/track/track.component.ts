import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Track } from './track';
import { TrackService } from './track.service';
import { Playlist } from '../playlist/playlist';
import { PlaylistService } from '../playlist/playlist.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';
import { AuthService } from '../navbar/auth.service';

@Component({
  selector: 'app-track',
  imports: [BrowserModule, MatButtonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  public playlists: Playlist[] = [];
  public tracks: Track[] = [];
  public currentPlaylist!: Playlist;
  public currentPlaylistName: String = "Playlist";
  public viewAll = false;
  searchKey: string = '';

  constructor(public authService: AuthService,
    private trackService: TrackService,
    private playlistService: PlaylistService,
    private mediaplayerService: MediaplayerService,
    private router: Router) { }

  ngOnInit() {
    this.getFiveTracks();
    this.getUserPlaylists();
  }

  openComponent(): void {
    this.router.navigate(["/"]);
  }

  public getFiveTracks(): void {
    this.trackService.getFiveTracks().subscribe(
      (response: Track[]) => {
        this.tracks = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getTracks(): void {
    this.viewAll = true;
    this.trackService.getTracks().subscribe(
      (response: Track[]) => {
        this.tracks = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchTracks(key: string): void {
    console.log(key);
    const results: Track[] = [];
    for (const track of this.tracks) {
      if (track.title.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1 ||
        track.artist.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1) {
        results.push(track);
      }
    }
    this.tracks = results;
    if (results.length === 0 || !key) {
      setTimeout(
        () => {
          this.getTracks();
        },
        500);
    }
  }

  public getUserPlaylists(): void {
    const user = this.authService.getUser();
    if (user && user.id) {
      this.playlistService.getUserPlaylists(user.id).subscribe(
        (response: Playlist[]) => {
          this.playlists = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      alert('User is not defined or missing an ID.');
    }
  }

  public setCurrentPlaylist(currentPlaylist: Playlist): void {
    if (currentPlaylist) {
      this.currentPlaylist = currentPlaylist;
      this.currentPlaylistName = currentPlaylist.name;
      console.log(`Current playlist set to: ${this.currentPlaylistName}`);
    }
  }

  public isCurrentPlaylistNull(): boolean {
    return !this.currentPlaylist;
  }

  public checkIfTrackIsInCurrentPlaylist(track: Track): boolean {
    if (this.currentPlaylist) {
      return !this.currentPlaylist.tracks.some(playlistTrack => playlistTrack.id === track.id);
    }
    return true;
  }

public addTrackToPlaylist(trackId: number): void {
  if (!this.currentPlaylist) {
    alert('Please select a playlist first.');
    return;
  }
  this.playlistService.addTrackToPlaylist(this.currentPlaylist, trackId).subscribe(
    (response: Playlist) => {
      this.getUserPlaylists(); // Refresh playlist data
      this.openComponent(); // Close the component/modal
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public removeTrackFromPlaylist(trackId: number): void {
  if (!this.currentPlaylist) {
    alert('Please select a playlist first.');
    return;
  }
  this.playlistService.removeTrackFromPlaylist(this.currentPlaylist, trackId).subscribe(
    (response: Playlist) => {
      this.getUserPlaylists(); // Refresh playlist data
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

  public playTrack(id: string): void {
    this.mediaplayerService.changeAudioFileSource(`http://localhost:8080/api/track/play/${id}`);
  }
}
