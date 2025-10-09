import { Component, inject } from '@angular/core';
import { DarkMode } from '../../services/dark-mode';
import { Track } from '../../services/track';

@Component({
  selector: 'app-dark-mode-toggle',
  imports: [],
  templateUrl: './dark-mode-toggle.html',
  styleUrl: './dark-mode-toggle.scss'
})
export class DarkModeToggle {
  darkModeService = inject(DarkMode);
  private trackService = inject(Track);

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();

    // Track dark mode toggle event
    const eventName = this.darkModeService.isDarkMode() ? 'dark-mode-on' : 'dark-mode-off';
    this.trackService.trackProjectVisit(eventName).subscribe();
  }
}
