import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeInterview } from '../../services/resume-interview';
import { ReviewInterface } from '../../models/interview';

@Component({
  selector: 'app-resume-results',
  imports: [],
  templateUrl: './resume-results.html',
  styleUrl: './resume-results.scss'
})
export class ResumeResults implements OnInit {
  sessionId = signal<string>('');
  overallScore = signal<number>(0);
  reviews = signal<ReviewInterface[]>([]);

  constructor(
    private router: Router,
    private resumeInterviewService: ResumeInterview
  ) {}

  ngOnInit(): void {
    // Try to get results from session service first
    const results = this.resumeInterviewService.getResults();

    if (!results) {
      // Clear any stale session data
      this.resumeInterviewService.clearSession();
      this.router.navigate(['/']);
      return;
    }

    // Validate results data
    if (!results.sessionId || !results.reviews || results.reviews.length === 0) {
      this.resumeInterviewService.clearSession();
      this.router.navigate(['/']);
      return;
    }

    this.sessionId.set(results.sessionId);
    this.overallScore.set(results.overallScore);
    this.reviews.set(results.reviews);
  }

  getScoreColorClass(score: number): string {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getScoreDescription(score: number): string {
    if (score >= 9) return 'Excellent performance!';
    if (score >= 8) return 'Very good performance!';
    if (score >= 7) return 'Good performance with room for improvement.';
    if (score >= 6) return 'Satisfactory performance.';
    if (score >= 5) return 'Below average performance.';
    return 'Needs significant improvement.';
  }

  startNewInterview(): void {
    this.resumeInterviewService.clearSession();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.resumeInterviewService.clearSession();
    this.router.navigate(['/']);
  }
}
