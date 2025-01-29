import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeezerPlaylistDetailResponse, Track } from '../../models/deezer.models';
import { DeezerService } from '../../services/deezer.service';
import { formatDuration } from '../../utils/format-duration';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule, TableModule, ProgressSpinner],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss'],
})
export class PlaylistDetailsComponent implements OnInit {
  playlistId!: number;
  playlist?: DeezerPlaylistDetailResponse;
  tracks: Track[] = [];
  nextTracksUrl?: string;
  isLoadingDetails: boolean = false;
  isLoadingTracks: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private deezerService: DeezerService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.playlistId = +idParam;
        this.loadPlaylistDetails();
        this.loadTracks();
      }
    });
  }

  /**
   * Fetches the playlist details using the DeezerService.
   */
  loadPlaylistDetails(): void {
    this.isLoadingDetails = true;
    this.deezerService.getPlaylistDetails(this.playlistId)
    .subscribe({
      next: (response: DeezerPlaylistDetailResponse) => {
        this.playlist = response;
        this.isLoadingDetails = false;
      },
      error: (err) => {
        console.error('Error fetching playlist details', err);
        this.isLoadingDetails = false;
      },
    });
  }

  /**
   * Fetches the initial set of tracks for the playlist.
   */
  loadTracks(): void {
    this.isLoadingTracks = true;
    this.deezerService.getPlaylistTracks(this.playlistId)
    .subscribe({
      next: (response) => {
        this.tracks = response.data;
        this.nextTracksUrl = response.next;
        this.isLoadingTracks = false;
      },
      error: (err) => {
        console.error('Error fetching tracks', err);
        this.isLoadingTracks = false;
      },
    });
  }

  /**
   * Loads more tracks when the user scrolls near the bottom of the page.
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      this.nextTracksUrl &&
      !this.isLoadingTracks
    ) {
      this.loadMoreTracks();
    }
  }

  /**
   * Fetches the next set of tracks using the DeezerService.
   */
  loadMoreTracks(): void {
    if (this.nextTracksUrl) {
      this.isLoadingTracks = true;
      this.deezerService.getNextPlaylistTracks(this.nextTracksUrl)
      .subscribe({
        next: (response) => {
          this.tracks = [...this.tracks, ...response.data];
          this.nextTracksUrl = response.next;
          this.isLoadingTracks = false;
        },
        error: (err) => {
          console.error('Error loading more tracks', err);
          this.isLoadingTracks = false;
        },
      });
    }
  }

  /**
   * Formats the total duration of the playlist.
   */
  get formattedTotalDuration(): string {
    return this.playlist ? formatDuration(this.playlist.duration) : '00:00:00';
  }

  /**
   * Formats the duration of a single track.
   * @param seconds Duration in seconds.
   * @returns Formatted duration string.
   */
  formatTrackDuration(seconds: number): string {
    return formatDuration(seconds);
  }
}
