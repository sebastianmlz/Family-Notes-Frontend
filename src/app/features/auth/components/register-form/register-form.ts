import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterCredentials } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-register-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
})
export class RegisterForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  readonly registerSuccess = output<void>();

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    family_name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const registerData: RegisterCredentials = this.registerForm.getRawValue();

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.registerSuccess.emit();
      },
      error: (err) => {
        this.isLoading.set(false);

        if (err.status === 400) {
          this.errorMessage.set(
            'El nombre de usuario o el correo electrónico ya se encuentran registrados.',
          );
        } else if (err.status === 0) {
          this.errorMessage.set('Error de red. No se pudo conectar con el servidor.');
        } else {
          this.errorMessage.set('No se pudo completar el registro. Verifica los datos ingresados.');
        }

        console.error('Register Error:', err);
      },
    });
  }
}
