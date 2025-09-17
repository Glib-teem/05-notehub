export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

// Тип для однієї нотатки
export interface Note {
  id: string; // унікальний ідентифікатор нотатки
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string; // дата створення у форматі ISO
  updatedAt: string; // дата останнього редагування
}

// Тип для створення нової нотатки через форму
export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

// Тип для редагування існуючої нотатки (опційні поля)
export interface UpdateNoteData {
  title?: string;
  content?: string;
  tag?: NoteTag;
}

// Опціональні фільтри при отриманні нотаток
export interface NoteFilters {
  search?: string; // пошуковий рядок
  tag?: NoteTag; // фільтр по тегу
}
