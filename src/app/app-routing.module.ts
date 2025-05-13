import { UserComponent } from './user/user.component'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { AuthGuard } from './navbar/auth.guard';

const routes: Routes = [
  {
    path: 'user', canActivate: [AuthGuard], component: UserComponent,
  },
  {
    path: '', component: TrackComponent,
  },
  {
    path: 'playlist/:userId', component: PlaylistComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }