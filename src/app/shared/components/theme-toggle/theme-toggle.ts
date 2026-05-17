import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleSwitchChangeEvent } from 'primeng/types/toggleswitch';

@Component({
  selector: 'app-theme-toggle',
  imports: [FormsModule, ToggleSwitchModule],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.css']
})
export class ThemeToggle {
  isDarkMode = signal<boolean>(
    document.documentElement.classList.contains('my-app-dark')
  );

  onThemeChange(event: ToggleSwitchChangeEvent): void {
    const htmlElement = document.documentElement;

    if (event.checked) {
      htmlElement.classList.add('my-app-dark');
    } else {
      htmlElement.classList.remove('my-app-dark');
    }
  }
}
