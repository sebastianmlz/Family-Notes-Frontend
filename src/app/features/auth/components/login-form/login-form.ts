import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/profiles']);
      },
      error: (err) => {
        this.isLoading.set(false);

        if (err.status === 401) {
          this.errorMessage.set('Usuario o contraseña incorrectos. Verifica tus credenciales.');
        } else if (err.status === 0) {
          this.errorMessage.set('No hay conexión con el servidor. Inténtalo más tarde.');
        } else {
          this.errorMessage.set('Ocurrió un error inesperado al intentar iniciar sesión.');
        }

        console.error('Login Error:', err);
      },
    });
  }
}
