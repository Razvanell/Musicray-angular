import { Component, OnInit} from '@angular/core';
import { MediaplayerService } from './mediaplayer.service';

@Component({
  selector: 'app-mediaplayer',
  templateUrl: './mediaplayer.component.html',
  styleUrls: ['./mediaplayer.component.css']
})
export class MediaplayerComponent implements OnInit {
  public audioFileSource: string = '';
  constructor(private mediaplayerService: MediaplayerService) { }

  ngOnInit() {
    this.mediaplayerService.currentAudioFileSource.subscribe(source => this.audioFileSource = source);
  }

}
