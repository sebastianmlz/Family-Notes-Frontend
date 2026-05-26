import {
  Component,
  inject,
  input,
  output,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

import { NotesService } from '../../services/notes.service';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '../../models/note.model';
import { ProfileStateService } from '../../../../core/services/profile-state.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './note-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteForm {
  private fb = inject(FormBuilder);
  private notesService = inject(NotesService);
  private profileStateService = inject(ProfileStateService);

  noteToEdit = input<Note | null>(null);
  success = output<void>();
  formCanceled = output<void>();

  isLoading = signal<boolean>(false);

  noteForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const note = this.noteToEdit();
      if (note) {
        this.noteForm.patchValue({
          title: note.title,
          content: note.content,
        });
      } else {
        this.noteForm.reset({
          title: '',
          content: '',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) return;

    const profileId = this.profileStateService.activeProfile()?.id;
    if (!profileId) {
      console.error('No active profile found');
      return;
    }

    this.isLoading.set(true);

    const currentNote = this.noteToEdit();
    if (currentNote) {
      this.updateNote(profileId, currentNote);
    } else {
      this.createNote(profileId);
    }
  }

  private createNote(profileId: string): void {
    const data: CreateNoteDTO = {
      profile: profileId,
      title: this.noteForm.controls.title.value,
      content: this.noteForm.controls.content.value,
    };

    this.notesService.createNote(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.noteForm.reset();
        this.success.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error creating note:', err);
      },
    });
  }

  private updateNote(profileId: string, note: Note): void {
    const data: UpdateNoteDTO = {
      title: this.noteForm.controls.title.value,
      content: this.noteForm.controls.content.value,
      profile: profileId,
    };

    this.notesService.updateNote(note.id, data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.noteForm.reset();
        this.success.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error updating note:', err);
      },
    });
  }

  handleCancel(): void {
    this.noteForm.reset();
    this.formCanceled.emit();
  }
}
