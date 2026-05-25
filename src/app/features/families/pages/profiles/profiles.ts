import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../models/profile.model';
import { ProfileForm } from '../../components/profile-form/profile-form';
import { ProfileStateService } from '../../../../core/services/profile-state.service';

@Component({
  selector: 'app-profiles',
  imports: [
    CommonModule,
    DialogModule,
    ProfileForm,
    ToastModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './profiles.html',
  styleUrls: ['./profiles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profiles implements OnInit {
  private profilesService = inject(ProfilesService);
  private router = inject(Router);
  private profileStateService = inject(ProfileStateService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  profiles = signal<Profile[]>([]);
  familyName = signal<string>('Familia...');
  showAddModal = signal<boolean>(false);

  selectedProfile = signal<Profile | null>(null);
  showPinModal = signal<boolean>(false);
  isPinVerifying = signal<boolean>(false);
  isPinDialogClosing = signal<boolean>(false);

  pinForm = this.fb.group({
    pin: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
  });

  pinDialogStyleClass = computed(
    () =>
      `rounded-2xl overflow-hidden shadow-2xl pin-dialog${
        this.isPinDialogClosing() ? ' pin-dialog--closing' : ''
      }`,
  );

  private isDialogClosing = signal<boolean>(false);
  dialogStyleClass = computed(
    () =>
      `rounded-2xl overflow-hidden shadow-2xl profile-dialog${
        this.isDialogClosing() ? ' profile-dialog--closing' : ''
      }`,
  );

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.profilesService.getProfiles().subscribe({
      next: (data) => this.profiles.set(data),
      error: (err) => console.error('Error cargando perfiles', err),
    });
  }

  openAddModal(): void {
    this.isDialogClosing.set(false);
    this.showAddModal.set(true);
  }

  handleDialogVisibleChange(visible: boolean): void {
    if (visible) {
      this.openAddModal();
      return;
    }

    this.closeAddModal();
  }

  handleProfileCreated(): void {
    this.loadProfiles();
    this.closeAddModal();
  }

  closeAddModal(): void {
    if (!this.showAddModal() || this.isDialogClosing()) {
      return;
    }

    this.isDialogClosing.set(true);
    setTimeout(() => {
      this.showAddModal.set(false);
      this.isDialogClosing.set(false);
    }, 220);
  }

  goToProfile(profileId: string) {
    const profile = this.profiles().find((p) => p.id === profileId);
    if (profile) {
      this.selectedProfile.set(profile);
      this.pinForm.reset({ pin: '' });
      this.isPinDialogClosing.set(false);
      this.showPinModal.set(true);
    }
  }

  handlePinDialogVisibleChange(visible: boolean) {
    if (visible) {
      return;
    }
    this.closePinModal();
  }

  closePinModal() {
    if (!this.showPinModal() || this.isPinDialogClosing()) {
      return;
    }
    this.isPinDialogClosing.set(true);
    setTimeout(() => {
      this.showPinModal.set(false);
      this.isPinDialogClosing.set(false);
      this.selectedProfile.set(null);
    }, 220);
  }

  verifyPin() {
    if (this.pinForm.invalid) return;

    const profile = this.selectedProfile();
    if (!profile) return;

    const pin = this.pinForm.controls.pin.value || '';
    this.isPinVerifying.set(true);

    this.profilesService.verifyPin(profile.id, pin).subscribe({
      next: (res) => {
        this.isPinVerifying.set(false);
        if (res.valid) {
          this.profileStateService.setActiveProfile({ id: profile.id, name: profile.name });
          this.messageService.add({
            severity: 'success',
            summary: 'Bienvenido',
            detail: `¡Hola de nuevo, ${profile.name}!`,
          });
          this.closePinModal();
          setTimeout(() => {
            this.router.navigate(['/notes']);
          }, 800);
        }
      },
      error: (err) => {
        this.isPinVerifying.set(false);
        console.error('Error verifying PIN:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Acceso Denegado',
          detail: 'El PIN ingresado es incorrecto.',
        });
        this.pinForm.reset({ pin: '' });
      },
    });
  }
}
