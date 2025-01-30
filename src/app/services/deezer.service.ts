import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeezerPlaylistDetailResponse, DeezerPlaylistResponse, DeezerTracksResponse } from '../models/deezer.models';

@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  private API_URL: string = '/api';
  http = inject(HttpClient);

  /**
   * Transforms the next URL to use the proxy path, fixing CORS errors when developing.
   * @param nextUrl
   * @private
   */
  private transformNextUrl(nextUrl: string): string {
    const deezerApiBase = 'https://api.deezer.com';
    if (nextUrl.startsWith(deezerApiBase)) {
      return nextUrl.replace(deezerApiBase, this.API_URL);
    } else if (nextUrl.startsWith('/')) {
      return `${this.API_URL}${nextUrl}`;
    } else {
      return nextUrl;
    }
  }

  /**
   * Fetches the user's playlists.
   * @param userId The user ID to fetch playlists for. Will default to 5 if not provided.
   */
  getUserPlaylists(userId: number): Observable<DeezerPlaylistResponse> {
    const url = `${this.API_URL}/user/${userId}/playlists`;
    return this.http.get<DeezerPlaylistResponse>(url);
  }

  /**
   * Fetches the next set of playlists for the user.
   * @param nextUrl The URL to fetch the next set of playlists from, which is provided in the first response.
   */
  getNextUserPlaylists(nextUrl: string): Observable<DeezerPlaylistResponse> {
    // Remove the base URL to use the proxy path
    const relativeUrl = this.transformNextUrl(nextUrl);
    return this.http.get<DeezerPlaylistResponse>(relativeUrl);
  }

  /**
   * Fetches the details for a playlist.
   * @param playlistId The ID of the playlist to fetch details for.
   */
  getPlaylistDetails(playlistId: number): Observable<DeezerPlaylistDetailResponse> {
    const url = `${this.API_URL}/playlist/${playlistId}`;
    return this.http.get<DeezerPlaylistDetailResponse>(url);
  }

  /**
   * Fetches the tracks for a playlist.
   * @param playlistId The ID of the playlist to fetch tracks for.
   * @param index The index to start fetching tracks from.
   * @param rows The number of tracks to fetch.
   */
  getPlaylistTracks(playlistId: number, index: number, rows: number): Observable<DeezerTracksResponse> {
    const url = `${this.API_URL}/playlist/${playlistId}/tracks?index=${index}&limit=${rows}`;
    return this.http.get<DeezerTracksResponse>(url);
  }
}
