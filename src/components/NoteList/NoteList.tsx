import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  onEdit: (note: Note) => void;
  isDeleting?: string | null;
}

const NoteList = ({ notes, onDelete, onEdit, isDeleting }: NoteListProps) => {
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
                onClick={() => onDelete(note.id)}
                disabled={isDeleting === note.id}
              >
                {isDeleting === note.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
