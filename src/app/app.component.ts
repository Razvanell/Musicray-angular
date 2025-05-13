import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MediaplayerComponent } from './mediaplayer/mediaplayer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MediaplayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'streaming-app-angular';
}
