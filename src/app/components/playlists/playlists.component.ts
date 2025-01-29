import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/deezer.models';
import { DeezerService } from '../../services/deezer.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  nextUrl?: string;
  isLoading: boolean = false;
  userId: number = 5;

  constructor(private deezerService: DeezerService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.isLoading = true;
    this.deezerService.getUserPlaylists(this.userId).subscribe({
      next: (response) => {
        this.playlists = response.data;
        this.nextUrl = response.next;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching playlists', err);
        this.isLoading = false;
      },
    });
  }

  onPlaylistClick(playlist: Playlist): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  loadMore(): void {
    if (this.nextUrl && !this.isLoading) {
      this.isLoading = true;
      this.deezerService.getNextUserPlaylists(this.nextUrl).subscribe({
        next: (response) => {
          this.playlists = [...this.playlists, ...response.data];
          this.nextUrl = response.next;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading more playlists', err);
          this.isLoading = false;
        },
      });
    }
  }
}
