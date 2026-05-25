import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
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
export class NoteForm implements OnChanges {
  private fb = inject(FormBuilder);
  private notesService = inject(NotesService);
  private profileStateService = inject(ProfileStateService);

  @Input() noteToEdit: Note | null = null;
  @Output() success = new EventEmitter<void>();
  @Output() formCanceled = new EventEmitter<void>();

  isLoading = signal<boolean>(false);

  noteForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['noteToEdit']) {
      if (this.noteToEdit) {
        this.noteForm.patchValue({
          title: this.noteToEdit.title,
          content: this.noteToEdit.content,
        });
      } else {
        this.noteForm.reset({
          title: '',
          content: '',
        });
      }
    }
  }

  onSubmit(): void {
    if (this.noteForm.invalid) return;

    this.isLoading.set(true);

    const profileId = this.profileStateService.activeProfile()?.id;
    if (!profileId) {
      this.isLoading.set(false);
      console.error('No active profile found');
      return;
    }

    if (this.noteToEdit) {
      // Update
      const data: UpdateNoteDTO = {
        title: this.noteForm.controls.title.value,
        content: this.noteForm.controls.content.value,
        profile: profileId,
      };

      this.notesService.updateNote(this.noteToEdit.id, data).subscribe({
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
    } else {
      // Create
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
  }

  handleCancel(): void {
    this.noteForm.reset();
    this.formCanceled.emit();
  }
}
