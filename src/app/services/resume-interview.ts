import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UploadResponseInterface, AnswerResponseInterface, ResultsData } from '../models/interview';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResumeInterview {
  private readonly apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Session state management using signals
  private currentSession = signal<UploadResponseInterface | null>(null);
  private currentResults = signal<ResultsData | null>(null);

  constructor() {}

  // API Methods
  uploadResume(file: File): Observable<UploadResponseInterface> {
    const formData = new FormData();
    formData.append('resume', file);

    return this.http
      .post<UploadResponseInterface>(`${this.apiUrl}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  submitAnswer(sessionId: string, answer: string): Observable<AnswerResponseInterface> {
    return this.http
      .post<AnswerResponseInterface>(`${this.apiUrl}/interview/answer`, {
        sessionId,
        answer,
      })
      .pipe(catchError(this.handleError));
  }

  // Session Management Methods
  setSession(session: UploadResponseInterface): void {
    this.currentSession.set(session);
  }

  getSession(): UploadResponseInterface | null {
    return this.currentSession();
  }

  setResults(results: ResultsData): void {
    this.currentResults.set(results);
  }

  getResults(): ResultsData | null {
    return this.currentResults();
  }

  clearSession(): void {
    this.currentSession.set(null);
    this.currentResults.set(null);
  }

  hasSession(): boolean {
    return this.currentSession() !== null;
  }

  hasResults(): boolean {
    return this.currentResults() !== null;
  }

  // Helper method to start a new interview session
  startNewInterview(): void {
    this.clearSession();
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else {
        errorMessage = `Server error (${error.status}): ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
