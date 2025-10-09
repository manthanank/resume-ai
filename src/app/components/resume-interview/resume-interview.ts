import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumeInterview as ResumeInterviewService } from '../../services/resume-interview';
import { AnswerResponseInterface } from '../../models/interview';
import { VisitorCount } from '../visitor-count/visitor-count';
import { DarkModeToggle } from '../dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-resume-interview',
  imports: [FormsModule, VisitorCount, DarkModeToggle],
  templateUrl: './resume-interview.html',
  styleUrl: './resume-interview.scss'
})
export class ResumeInterview implements OnInit {
  sessionId = signal<string>('');
  currentQuestion = signal<string>('');
  currentIndex = signal<number>(0);
  remaining = signal<number>(0);
  totalQuestions = signal<number>(0);

  userAnswer = '';
  isSubmitting = signal(false);
  errorMessage = signal<string>('');

  constructor(
    private resumeInterviewService: ResumeInterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Try to get session from service first
    const session = this.resumeInterviewService.getSession();

    if (!session) {
      this.router.navigate(['/']);
      return;
    }

    this.sessionId.set(session.sessionId);
    this.currentQuestion.set(session.currentQuestion);
    this.currentIndex.set(session.currentIndex);
    this.remaining.set(session.remaining);
    this.totalQuestions.set(session.currentIndex + session.remaining + 1);
  }

  get progressPercentage(): number {
    return ((this.currentIndex() + 1) / this.totalQuestions()) * 100;
  }

  onSubmit(): void {
    if (!this.userAnswer.trim()) {
      this.errorMessage.set('Please provide an answer.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.resumeInterviewService.submitAnswer(this.sessionId(), this.userAnswer.trim())
      .subscribe({
        next: (response: AnswerResponseInterface) => {
          this.isSubmitting.set(false);

          if (response.message === 'Interview complete') {
            // Store results data in session service
            this.resumeInterviewService.setResults({
              sessionId: this.sessionId(),
              overallScore: response.overallScore || 0,
              reviews: response.reviews || []
            });
            // Navigate to results
            this.router.navigate(['/results']);
          } else {
            // Update for next question
            this.currentQuestion.set(response.nextQuestion!);
            this.currentIndex.set(response.currentIndex!);
            this.remaining.set(response.remaining!);
            this.userAnswer = '';
          }
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(error.message || 'Failed to submit answer. Please try again.');
        }
      });
  }

  goBack(): void {
    this.resumeInterviewService.clearSession();
    this.router.navigate(['/']);
  }
}
