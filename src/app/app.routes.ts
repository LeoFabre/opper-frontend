import { Routes } from '@angular/router';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { PlaylistDetailsComponent } from './components/playlist-details/playlist-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/playlists', pathMatch: 'full' },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'playlist/:id', component: PlaylistDetailsComponent },
  { path: '**', redirectTo: '/playlists' }
];
