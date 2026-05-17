import { Component, signal } from '@angular/core';
import { AuthTopbar } from '../../components/auth-topbar/auth-topbar';
import { LoginForm } from '../../components/login-form/login-form';
import { RegisterForm } from '../../components/register-form/register-form';
import { AboutInfo } from '../../components/about-info/about-info';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  imports: [AuthTopbar, LoginForm, RegisterForm, AboutInfo, ButtonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {
  currentForm = signal<'none' | 'login' | 'register'>('none');
  isLeaving = signal<boolean>(false);

  openForm(type: 'login' | 'register') {
    this.isLeaving.set(false);
    this.currentForm.set(type);
  }

  closeForm() {
    this.isLeaving.set(true);
    setTimeout(() => {
      this.currentForm.set('none');
      this.isLeaving.set(false);
    }, 300);
  }
}
