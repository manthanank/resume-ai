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
    // Persist to localStorage
    localStorage.setItem('resume-interview-session', JSON.stringify(session));
  }

  getSession(): UploadResponseInterface | null {
    // Try to get from signal first
    const sessionFromSignal = this.currentSession();
    if (sessionFromSignal) {
      return sessionFromSignal;
    }

    // Try to get from localStorage
    try {
      const sessionFromStorage = localStorage.getItem('resume-interview-session');
      if (sessionFromStorage) {
        const parsedSession = JSON.parse(sessionFromStorage);
        this.currentSession.set(parsedSession);
        return parsedSession;
      }
    } catch (error) {
      console.error('Error parsing session from localStorage:', error);
    }

    return null;
  }

  setResults(results: ResultsData): void {
    this.currentResults.set(results);
    // Persist to localStorage
    localStorage.setItem('resume-interview-results', JSON.stringify(results));
  }

  getResults(): ResultsData | null {
    // Try to get from signal first
    const resultsFromSignal = this.currentResults();
    if (resultsFromSignal) {
      return resultsFromSignal;
    }

    // Try to get from localStorage
    try {
      const resultsFromStorage = localStorage.getItem('resume-interview-results');
      if (resultsFromStorage) {
        const parsedResults = JSON.parse(resultsFromStorage);
        this.currentResults.set(parsedResults);
        return parsedResults;
      }
    } catch (error) {
      console.error('Error parsing results from localStorage:', error);
    }

    return null;
  }

  clearSession(): void {
    this.currentSession.set(null);
    this.currentResults.set(null);
    // Clear from localStorage
    localStorage.removeItem('resume-interview-session');
    localStorage.removeItem('resume-interview-results');
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
