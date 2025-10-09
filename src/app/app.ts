import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeToggle } from './components/dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DarkModeToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('resume-ai');
}
