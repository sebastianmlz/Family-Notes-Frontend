import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-topbar',
  imports: [ToolbarModule, ThemeToggle],
  templateUrl: './auth-topbar.html',
  styleUrl: './auth-topbar.css',
})
export class AuthTopbar {}
