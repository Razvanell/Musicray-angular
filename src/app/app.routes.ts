import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { HomeComponent } from './home/home.component';  // Import your new HomeComponent
import { AuthGuard } from './navbar/auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';

// Define your routes
export const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,  // Set HomeComponent as the default route
    pathMatch: 'full',         // Ensure this is a full path match
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],  // Protected route with AuthGuard
  },
  {
    path: 'users',
    component: UsersComponent,
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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: '**',
    redirectTo: '/home',  // Wildcard route for any undefined path
  }
];
