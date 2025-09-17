import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface CreateNoteResponse {
  note: Note;
}

export interface DeleteNoteResponse {
  note: Note;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });

  if (search?.trim()) {
    queryParams.append('search', search.trim());
  }

  const { data } = await apiClient.get<FetchNotesResponse>(
    `/notes?${queryParams.toString()}`
  );

  return data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const { data } = await apiClient.post<CreateNoteResponse>('/notes', noteData);

  return data.note;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await apiClient.delete<DeleteNoteResponse>(
    `/notes/${noteId}`
  );

  return data.note;
};
