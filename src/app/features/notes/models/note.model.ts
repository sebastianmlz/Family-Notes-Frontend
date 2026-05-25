export interface Note {
  id: string;
  profile: string;
  profile_name: string;
  title: string;
  content: string;
  created_at: string;
}

export interface CreateNoteDTO {
  profile: string;
  title: string;
  content: string;
}

export interface UpdateNoteDTO {
  title: string;
  content: string;
  profile?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginatedNotes {
  results: Note[];
  hasNext: boolean;
}
