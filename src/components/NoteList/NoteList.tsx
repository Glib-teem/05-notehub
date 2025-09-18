import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
}

const NoteList = ({ notes, onEdit }: NoteListProps) => {
  // Ініціалізую queryClient для інвалідації кешу.
  const queryClient = useQueryClient();

  // Створюю мутацію для видалення нотатки.
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      // Після успішного видалення, інвалідую запити 'notes' щоб TanStack Query автоматично оновив дані.
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  if (notes.length === 0) {
    return (
      <div className={css.emptyState}>
        <h3>No notes found</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          key={note.id}
          className={css.listItem}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.buttonGroup}>
              <button
                className={css.editButton}
                onClick={() => onEdit(note)}
              >
                Edit
              </button>
              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                // Стан завантаження беру з мутації, перевіряючи, що саме ця нотатка видаляється.
                disabled={
                  deleteNoteMutation.isPending &&
                  deleteNoteMutation.variables === note.id
                }
              >
                {deleteNoteMutation.isPending &&
                deleteNoteMutation.variables === note.id
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
