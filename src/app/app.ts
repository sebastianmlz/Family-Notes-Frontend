import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private authService = inject(AuthService);

  protected readonly title = signal('family-notes-frontend');
  readonly isAuthenticated = this.authService.isAuthenticated;
}
