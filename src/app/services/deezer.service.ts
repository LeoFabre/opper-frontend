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

  getUserPlaylists(userId: number): Observable<DeezerPlaylistResponse> {
    const url = `${this.API_URL}/user/${userId}/playlists`;
    return this.http.get<DeezerPlaylistResponse>(url);
  }

  getNextUserPlaylists(nextUrl: string): Observable<DeezerPlaylistResponse> {
    // Remove the base URL to use the proxy path
    const relativeUrl = this.transformNextUrl(nextUrl);
    return this.http.get<DeezerPlaylistResponse>(relativeUrl);
  }

  getPlaylistDetails(playlistId: number): Observable<DeezerPlaylistDetailResponse> {
    const url = `${this.API_URL}/playlist/${playlistId}`;
    return this.http.get<DeezerPlaylistDetailResponse>(url);
  }

  getPlaylistTracks(playlistId: number): Observable<DeezerTracksResponse> {
    const url = `${this.API_URL}/playlist/${playlistId}/tracks`;
    return this.http.get<DeezerTracksResponse>(url);
  }

  getNextPlaylistTracks(nextUrl: string): Observable<DeezerTracksResponse> {
    // Remove the base URL to use the proxy path
    const relativeUrl = this.transformNextUrl(nextUrl);
    return this.http.get<DeezerTracksResponse>(relativeUrl);
  }
}
