import { Component, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeezerPlaylistDetailResponse, Track } from '../../models/deezer.models';
import { DeezerService } from '../../services/deezer.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { FormatDurationPipe } from '../../utils/format-duration.pipe';
import { Skeleton } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule, TableModule, ProgressSpinner, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Button, FormatDurationPipe, Skeleton],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss'],
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  playlistId!: number;
  playlist?: DeezerPlaylistDetailResponse;
  tracks!: Track[];
  nextTracksUrl?: string;
  isLoadingDetails: boolean = false;
  private _getTracks$!: Subscription;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private deezerService: DeezerService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.playlistId = +idParam;
        this.loadPlaylistDetails();
      }
    });
  }

  ngOnDestroy(): void {
    if (this._getTracks$) {
      this._getTracks$.unsubscribe();
    }
  }

  /**
   * Fetches the playlist details using the DeezerService.
   */
  loadPlaylistDetails(): void {
    this.isLoadingDetails = true;
    this.deezerService.getPlaylistDetails(this.playlistId)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (response: DeezerPlaylistDetailResponse) => {
        this.playlist = response;
        this.isLoadingDetails = false;
        this.tracks = Array.from({ length: response.nb_tracks });
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
  loadTracks(event: TableLazyLoadEvent): void {
    if (this._getTracks$) {
      this._getTracks$.unsubscribe();
    }
    console.log('loadTracks event : ', event);
    const first: number = event.first ?? 0;
    const rows: number = event.rows ?? 25;
    this._getTracks$ = this.deezerService.getPlaylistTracks(this.playlistId, first, rows)
    .subscribe({
      next: (response) => {
        this.tracks.splice(first, response.data.length, ...response.data);
        this.nextTracksUrl = response.next;
      },
      error: (err) => {
        console.error('Error fetching tracks', err);
      },
    });
  }

  /**
   * Returns to playlists view.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

}
