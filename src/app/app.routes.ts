import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { AuthGuard } from './navbar/auth.guard';

// Define your routes
export const appRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],  // Protected route with AuthGuard
  },
  {
    path: 'track',
    component: TrackComponent,
  },
  {
    path: 'playlist/:userId',
    component: PlaylistComponent,
  },
  {
    path: '',
    redirectTo: '/track',  // Default route
    pathMatch: 'full',     // Ensure this is a full path match
  },
  {
    path: '**',
    redirectTo: '/track',  // Wildcard route for any undefined path
  }
];
