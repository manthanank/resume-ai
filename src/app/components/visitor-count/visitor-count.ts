import { Component, inject, signal, OnInit } from '@angular/core';
import { Track } from '../../services/track';
import { Visit } from '../../models/visit.model';

@Component({
  selector: 'app-visitor-count',
  imports: [],
  templateUrl: './visitor-count.html',
  styleUrl: './visitor-count.scss'
})
export class VisitorCount implements OnInit {
  private trackService = inject(Track);

  visitorCount = signal<number>(0);

  ngOnInit() {
    this.loadVisitorCount();
  }

  loadVisitorCount() {
    this.trackService.trackProjectVisit('resume-ai').subscribe({
      next: (visit) => {
        this.visitorCount.set(visit.uniqueVisitors);
      },
      error: (err) => {
        // Silently fail - don't show errors for visitor count
        console.error('Error loading visitor count:', err);
      }
    });
  }
}
