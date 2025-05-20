import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Track {
  title: string;
  artist: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private readonly OPENAI_URL = 'http://localhost:8080/api/openai/info';
  private readonly HUGGINGFACE_URL = 'http://localhost:8080/api/huggingface/info';

  constructor(private http: HttpClient) {}

  fetchTrackInfoOpenAI(track: Track): Observable<string> {
    if (!track || !track.title || !track.artist) {
      return throwError(() => new Error('Invalid track data'));
    }
    const query = `${track.title} by ${track.artist}`;
    const params = new HttpParams().set('query', query);
    return this.http.get(this.OPENAI_URL, { params, responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Error fetching info from OpenAI', err);
        return throwError(() => new Error('Failed to fetch AI info from OpenAI'));
      })
    );
  }

}
