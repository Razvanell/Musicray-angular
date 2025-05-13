import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaplayerService {
  private audioFileSource = new BehaviorSubject<string>("");
  currentAudioFileSource = this.audioFileSource.asObservable();

  constructor() { }

  public changeAudioFileSource(source: string): void {
    this.audioFileSource.next(source);
  }

}
