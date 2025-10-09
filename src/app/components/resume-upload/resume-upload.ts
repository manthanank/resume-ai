import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumeInterview } from '../../services/resume-interview';
import { Track } from '../../services/track';
import { VisitorCount } from '../visitor-count/visitor-count';

@Component({
  selector: 'app-resume-upload',
  imports: [FormsModule, VisitorCount],
  templateUrl: './resume-upload.html',
  styleUrl: './resume-upload.scss'
})
export class ResumeUpload {
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  errorMessage = signal<string>('');

  private trackService = inject(Track);

  constructor(
    private resumeInterviewService: ResumeInterview,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage.set('Please select a PDF or DOCX file.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('File size must be less than 5MB.');
        return;
      }

      this.selectedFile.set(file);
      this.errorMessage.set('');
    }
  }

  onSubmit(): void {
    if (!this.selectedFile()) {
      this.errorMessage.set('Please select a file.');
      return;
    }

    this.isUploading.set(true);
    this.errorMessage.set('');

    // Track resume upload event
    this.trackService.trackProjectVisit('resume-upload').subscribe();

    this.resumeInterviewService.uploadResume(this.selectedFile()!)
      .subscribe({
        next: (response) => {
          this.isUploading.set(false);
          // Store session data in service
          this.resumeInterviewService.setSession(response);
          // Navigate to interview
          this.router.navigate(['/interview']);
        },
        error: (error) => {
          this.isUploading.set(false);
          this.errorMessage.set(error.message || 'Upload failed. Please try again.');
        }
      });
  }
}
