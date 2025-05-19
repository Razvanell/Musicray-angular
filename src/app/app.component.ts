import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { MediaplayerComponent } from './mediaplayer/mediaplayer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, MediaplayerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'musicray';
}
