import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Note, CreateNoteDTO, UpdateNoteDTO, PaginatedNotes } from '../models/note.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/notes/notes/`;

  getNotes(page?: number): Observable<PaginatedNotes> {
    let url = this.apiUrl;
    if (page) {
      url += `?page=${page}`;
    }
    return this.http.get<unknown>(url).pipe(
      map((res: unknown) => {
        let rawNotes: Note[] = [];
        let hasNext = false;

        if (Array.isArray(res)) {
          rawNotes = res as Note[];
        } else if (res && typeof res === 'object') {
          const resObj = res as Record<string, unknown>;
          if ('results' in resObj && Array.isArray(resObj['results'])) {
            rawNotes = resObj['results'] as Note[];
            hasNext = !!resObj['next'];
          } else {
            const arrayKey = Object.keys(resObj).find((key) => Array.isArray(resObj[key]));
            if (arrayKey) {
              rawNotes = resObj[arrayKey] as Note[];
            }
          }
        }

        // Sort notes by created_at descending (latest first)
        const sorted = [...rawNotes].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        return { results: sorted, hasNext };
      }),
    );
  }

  createNote(data: CreateNoteDTO): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, data);
  }

  updateNote(id: string, data: UpdateNoteDTO): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}${id}/`, data);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
