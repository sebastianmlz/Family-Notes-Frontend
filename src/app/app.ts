import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('family-notes-frontend');

  toggleDarkMode() {
    // Buscamos la etiqueta <html>
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      // La función 'toggle' pone la clase si no existe, y la quita si ya existe
      htmlElement.classList.toggle('my-app-dark');
    }
  }
}
