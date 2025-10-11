import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkMode {
  private darkMode = signal<boolean>(false);

  // Computed signal for the current dark mode state
  isDarkMode = computed(() => this.darkMode());

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = sessionStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.darkMode.set(savedTheme === 'true');
    } else {
      // Check system preference
      this.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Apply initial theme
    this.applyTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!sessionStorage.getItem('darkMode')) {
        this.darkMode.set(e.matches);
        this.applyTheme();
      }
    });
  }

  toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
    this.applyTheme();
    // Save preference to sessionStorage
    sessionStorage.setItem('darkMode', this.darkMode().toString());
  }

  private applyTheme(): void {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
