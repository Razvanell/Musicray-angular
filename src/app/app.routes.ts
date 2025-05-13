import { Route } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { AuthGuard } from './navbar/auth.guard';

// Define your routes
export const appRoutes: Route[] = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],  // Protected route with AuthGuard
  },
  {
    path: '',
    component: TrackComponent,
  },
  {
    path: 'playlist/:userId',
    component: PlaylistComponent,
  },
];
