import { Component, inject, signal, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ProfilesService } from '../../services/profiles.service';
import { CreateProfileDTO } from '../../models/profile.model';
@Component({
  selector: 'app-profile-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    ToggleSwitchModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {
  private fb = inject(FormBuilder);
  private profilesService = inject(ProfilesService);

  // Outputs should not be prefixed with "on" per Angular style guide
  profileCreated = output<void>();
  profileCanceled = output<void>();

  isLoading = signal<boolean>(false);

  private readonly formDefaults = {
    name: '',
    age: 0,
    pin: '',
    is_admin: false,
  };

  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    age: [0, [Validators.required, Validators.min(1)]],
    pin: ['', [Validators.required, Validators.minLength(4)]],
    is_admin: [false],
  });

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    const data: CreateProfileDTO = this.profileForm.getRawValue();

    this.profilesService.createProfile(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.resetForm();
        this.profileCreated.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error creando perfil', err);
      },
    });
  }

  handleCancel(): void {
    this.resetForm();
    this.profileCanceled.emit();
  }

  private resetForm(): void {
    this.profileForm.reset(this.formDefaults);
  }
}
