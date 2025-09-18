import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, updateNote } from '../../services/noteService';
import type { Note, CreateNoteData, UpdateNoteData } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  // Проп для передачі нотатки, що редагується.
  noteToEdit?: Note;
  // Проп для закриття модального вікна.
  onClose: () => void;
}

const noteValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be no more than 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be no more than 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

const NoteForm = ({ noteToEdit, onClose }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!noteToEdit;

  // Мутація для створення нотатки.
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose(); // Закриваю модалку після успішного створення.
    },
  });

  // Мутація для оновлення нотатки.
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose(); // Закриваю модалку після успішного оновлення.
    },
  });

  const handleSubmit = (values: CreateNoteData) => {
    if (isEditing) {
      updateNoteMutation.mutate({ id: noteToEdit.id, data: values });
    } else {
      createNoteMutation.mutate(values);
    }
  };

  const initialValues: CreateNoteData = {
    title: noteToEdit?.title || '',
    content: noteToEdit?.content || '',
    tag: noteToEdit?.tag || 'Todo',
  };

  const isSubmitting =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={noteValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage
            name="title"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={6}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            as="select"
            id="tag"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            name="tag"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
              ? 'Update note'
              : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
