import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../models/profile.model';
import { ProfileForm } from '../../components/profile-form/profile-form';

@Component({
  selector: 'app-profiles',
  imports: [CommonModule, DialogModule, ProfileForm],
  templateUrl: './profiles.html',
  styleUrls: ['./profiles.css'],
})
export class Profiles implements OnInit {
  private profilesService = inject(ProfilesService);
  private router = inject(Router);

  profiles = signal<Profile[]>([]);
  familyName = signal<string>('Familia...');
  showAddModal = signal<boolean>(false);

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
    console.warn('Navegando al perfil:', profileId);
  }
}
