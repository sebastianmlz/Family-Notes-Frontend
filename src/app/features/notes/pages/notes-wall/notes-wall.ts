import {
  Component,
  OnInit,
  signal,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { NoteForm } from '../../components/note-form/note-form.component';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { ProfileStateService } from '../../../../core/services/profile-state.service';

@Component({
  selector: 'app-notes-wall',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, AnimateOnScrollModule, NoteForm, ToastModule],
  providers: [DatePipe, MessageService],
  templateUrl: './notes-wall.html',
  styleUrls: ['./notes-wall.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesWall implements OnInit {
  private router = inject(Router);
  private notesService = inject(NotesService);
  public datePipe = inject(DatePipe);
  public profileStateService = inject(ProfileStateService);
  private messageService = inject(MessageService);
  notes = signal<Note[]>([]);
  showModal = signal<boolean>(false);
  selectedNote = signal<Note | null>(null);

  // Pagination state
  currentPage = signal<number>(1);
  hasNextPage = signal<boolean>(false);

  // Deletion state
  showDeleteConfirm = signal<boolean>(false);
  noteToDelete = signal<Note | null>(null);
  isDeleting = signal<boolean>(false);
  isDeleteDialogClosing = signal<boolean>(false);

  // Modal animations
  isDialogClosing = signal<boolean>(false);

  dialogStyleClass = computed(
    () =>
      `rounded-2xl overflow-hidden shadow-2xl note-dialog${
        this.isDialogClosing() ? ' note-dialog--closing' : ''
      }`,
  );

  deleteDialogStyleClass = computed(
    () =>
      `rounded-2xl overflow-hidden shadow-2xl note-dialog${
        this.isDeleteDialogClosing() ? ' note-dialog--closing' : ''
      }`,
  );

  ngOnInit() {
    if (!this.profileStateService.activeProfile()) {
      this.router.navigate(['/profiles']);
      return;
    }
    this.loadNotes();
  }

  loadNotes() {
    this.currentPage.set(1);
    this.notesService.getNotes(1).subscribe({
      next: (data) => {
        this.notes.set(data.results);
        this.hasNextPage.set(data.hasNext);
      },
      error: (err) => {
        console.error('Family Notes - Error loading notes:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las notas de la familia.',
        });
      },
    });
  }

  loadMoreNotes() {
    const nextPage = this.currentPage() + 1;
    this.notesService.getNotes(nextPage).subscribe({
      next: (data) => {
        if (data.results.length > 0) {
          this.notes.set([...this.notes(), ...data.results]);
          this.currentPage.set(nextPage);
          this.hasNextPage.set(data.hasNext);
        }
      },
      error: (err) => {
        console.error('Family Notes - Error loading more notes:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar más notas.',
        });
      },
    });
  }

  openCreateModal() {
    this.selectedNote.set(null);
    this.isDialogClosing.set(false);
    this.showModal.set(true);
  }

  editNote(note: Note) {
    this.selectedNote.set(note);
    this.isDialogClosing.set(false);
    this.showModal.set(true);
  }

  handleModalSuccess() {
    this.loadNotes();
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: this.selectedNote()
        ? 'Nota actualizada correctamente.'
        : 'Nota creada correctamente.',
    });
    this.closeModal();
  }

  handleDialogVisibleChange(visible: boolean) {
    if (visible) {
      this.openCreateModal();
      return;
    }
    this.closeModal();
  }

  closeModal() {
    if (!this.showModal() || this.isDialogClosing()) {
      return;
    }

    this.isDialogClosing.set(true);
    setTimeout(() => {
      this.showModal.set(false);
      this.isDialogClosing.set(false);
      this.selectedNote.set(null);
    }, 250);
  }

  confirmDelete(note: Note) {
    this.noteToDelete.set(note);
    this.isDeleteDialogClosing.set(false);
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm() {
    if (!this.showDeleteConfirm() || this.isDeleteDialogClosing()) {
      return;
    }

    this.isDeleteDialogClosing.set(true);
    setTimeout(() => {
      this.showDeleteConfirm.set(false);
      this.isDeleteDialogClosing.set(false);
      this.noteToDelete.set(null);
    }, 250);
  }

  handleDeleteDialogVisibleChange(visible: boolean) {
    if (visible) {
      this.isDeleteDialogClosing.set(false);
      this.showDeleteConfirm.set(true);
      return;
    }
    this.closeDeleteConfirm();
  }

  deleteNote() {
    const note = this.noteToDelete();
    if (!note) return;

    this.isDeleting.set(true);
    this.notesService.deleteNote(note.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.loadNotes();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Nota eliminada correctamente.',
        });
        this.closeDeleteConfirm();
      },
      error: (err) => {
        this.isDeleting.set(false);
        console.error('Family Notes - Error deleting note:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la nota.',
        });
      },
    });
  }

  changeProfile() {
    this.router.navigate(['/profiles']);
  }
}
