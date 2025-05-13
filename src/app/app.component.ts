import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MediaplayerComponent } from './mediaplayer/mediaplayer.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, MediaplayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'musicray';
}
