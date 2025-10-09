import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeAnalysisService } from '../../services/resume-analysis';
import { ResumeAnalysis as ResumeAnalysisModel } from '../../models/resume-analysis';
import { VisitorCount } from '../visitor-count/visitor-count';
import { DarkModeToggle } from '../dark-mode-toggle/dark-mode-toggle';
import { ResumeInterview as ResumeInterviewService } from '../../services/resume-interview';

@Component({
  selector: 'app-resume-analysis',
  imports: [VisitorCount, DarkModeToggle],
  templateUrl: './resume-analysis.html',
  styleUrl: './resume-analysis.scss'
})
export class ResumeAnalysis implements OnInit {
  private resumeAnalysisService = inject(ResumeAnalysisService);
  private resumeInterviewService = inject(ResumeInterviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resumeId = signal<string>('');
  analysis = signal<ResumeAnalysisModel | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const resumeId = params['id'];
      if (resumeId) {
        this.resumeId.set(resumeId);
        this.loadAnalysis(resumeId);
      } else {
        this.errorMessage.set('Resume ID not provided');
      }
    });
  }

  private loadAnalysis(resumeId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Try to get existing analysis first
    this.resumeAnalysisService.getResumeAnalysis(resumeId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.analysis.set(response.analysis);
      },
      error: (error) => {
        // If no existing analysis, trigger new analysis
        this.triggerAnalysis(resumeId);
      }
    });
  }

  private triggerAnalysis(resumeId: string): void {
    this.resumeAnalysisService.analyzeResume(resumeId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.analysis.set(response.analysis);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to analyze resume. Please try again.');
      }
    });
  }

  getScoreColorClass(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getScoreDescription(score: number): string {
    if (score >= 90) return 'Excellent resume!';
    if (score >= 80) return 'Very good resume with minor improvements needed.';
    if (score >= 70) return 'Good resume with room for improvement.';
    if (score >= 60) return 'Decent resume that needs several improvements.';
    return 'Resume needs significant improvements.';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startInterview(): void {
    // Check if we have a valid session before navigating
    const session = this.resumeInterviewService.getSession();
    if (!session) {
      // If no session, go back to upload
      this.router.navigate(['/']);
      return;
    }
    // Navigate to interview with valid session
    this.router.navigate(['/interview']);
  }
}
