import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/deezer.models';
import { DeezerService } from '../../services/deezer.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Card } from 'primeng/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinner, Card],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  nextUrl?: string;
  isLoading: boolean = false;
  userId: number = 5;
  private _destroyRef = inject(DestroyRef);

  constructor(private deezerService: DeezerService, private router: Router) {}

  /**
   * Fetches the user's playlists when the component is initialized.
   */
  ngOnInit(): void {
    this.loadPlaylists();
  }

  /**
   * Fetches the user's playlists using the DeezerService.
   * This method is called when the component is initialized.
   */
  loadPlaylists(): void {
    this.isLoading = true;
    this.deezerService.getUserPlaylists(this.userId)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
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

  /**
   * Navigates to the playlist details page when a playlist is clicked.
   * @param playlist The playlist that was clicked.
   */
  onPlaylistClick(playlist: Playlist): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  /**
   * Fetches the next set of playlists for the user when they click the "Load More" button.
   * Made it this way here to show that I can implement infinite scrolling AND button-based pagination.
   */
  loadMore(): void {
    if (this.nextUrl && !this.isLoading) {
      this.isLoading = true;
      this.deezerService.getNextUserPlaylists(this.nextUrl)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
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
