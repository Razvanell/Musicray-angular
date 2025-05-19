import { FormsModule } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TrackService } from '../track/track.service';
import { Playlist } from '../playlist/playlist';
import { PlaylistService } from '../playlist/playlist.service';
import { MediaplayerService } from '../mediaplayer/mediaplayer.service';
import { AuthService } from '../navbar/auth.service';
import { Track } from '../track/track';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent {
  public playlists: Playlist[] = [];
  public tracks: Track[] = [];
  private initialTracks: Track[] = [];
  private allTracks: Track[] = [];
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
    this.getRandomTracks();
    this.getUserPlaylists();
  }


  openComponent(): void {
    this.router.navigate(["/", "track"])
  }

  public getRandomTracks(): void {
    this.trackService.getRandomTracks().subscribe(
      (response: Track[]) => {
        this.tracks = response;
        this.allTracks = response;
        this.initialTracks = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public getTracks(): void {
    this.trackService.getTracks().subscribe(
      (response) => {
        this.tracks = response;
        this.allTracks = response; // keep a backup of full list
      },
      (error) => {
        alert(error.message);
      }
    );
  }

public searchTracks(key: string): void {
  const lowerKey = key.toLocaleLowerCase().trim();

  if (!lowerKey) {
    if (!this.currentPlaylist) {
      this.tracks = [...this.initialTracks];  // no playlist: show initial random
    } else {
      this.tracks = [...this.currentPlaylist.tracks]; // show playlist tracks
    }
    return;
  }

  const sourceTracks = this.currentPlaylist ? this.currentPlaylist.tracks : this.allTracks;

  this.tracks = sourceTracks.filter(track =>
    track.title.toLowerCase().includes(lowerKey) ||
    track.artist.toLowerCase().includes(lowerKey)
  );
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

    // Show only tracks from this playlist
    this.tracks = [...currentPlaylist.tracks]; 
    this.searchKey = '';

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

    const currentPlaylistId = this.currentPlaylist.id;
    const userId = this.currentPlaylist.user.id;
    console.log('Adding track', trackId, 'to playlist', this.currentPlaylist);

    this.playlistService.addTrackToPlaylist(this.currentPlaylist, trackId).subscribe(
      (response: Playlist) => {
        this.getUserPlaylistsAndRetainCurrent(userId, currentPlaylistId);
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

    const currentPlaylistId = this.currentPlaylist.id;
    const userId = this.currentPlaylist.user.id;

    this.playlistService.removeTrackFromPlaylist(this.currentPlaylist, trackId).subscribe(
      (response: Playlist) => {
        this.getUserPlaylistsAndRetainCurrent(userId, currentPlaylistId);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getUserPlaylistsAndRetainCurrent(userId: number, currentPlaylistId: number): void {
    this.playlistService.getUserPlaylists(userId).subscribe(
      (response: Playlist[]) => {

        this.playlists = response;
        const updated = this.playlists.find(p => p.id === currentPlaylistId);
        if (updated) {
          this.currentPlaylist = updated;
          this.currentPlaylistName = updated.name;
        }
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


