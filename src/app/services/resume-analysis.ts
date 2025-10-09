import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResumeAnalysis, AnalysisResponse } from '../models/resume-analysis';

@Injectable({
  providedIn: 'root',
})
export class ResumeAnalysisService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  analyzeResume(resumeId: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(`${this.apiUrl}/resume/analyze`, {
      resumeId
    });
  }

  getResumeAnalysis(resumeId: string): Observable<AnalysisResponse> {
    return this.http.get<AnalysisResponse>(`${this.apiUrl}/resume/${resumeId}/analysis`);
  }
}
