import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/resume-upload/resume-upload').then((m) => m.ResumeUpload),
  },
  {
    path: 'interview',
    loadComponent: () =>
      import('./components/resume-interview/resume-interview').then((m) => m.ResumeInterview),
  },
  {
    path: 'results',
    loadComponent: () => import('./components/resume-results/resume-results').then((m) => m.ResumeResults),
  },
  {
    path: 'analysis/:id',
    loadComponent: () => import('./components/resume-analysis/resume-analysis').then((m) => m.ResumeAnalysis),
  },
  { path: '**', redirectTo: '' },
];
