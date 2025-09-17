import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { CreateNoteData, NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (data: CreateNoteData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const noteValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be no more than 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content must be no more than 500 characters'),
  tag: Yup.string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Please select a valid tag'
    )
    .required('Tag is required'),
});

const initialValues: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo' as NoteTag,
};

const NoteForm = ({ onSubmit, onCancel, isSubmitting }: NoteFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={noteValidationSchema}
      onSubmit={onSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
            placeholder="Enter note title"
            autoComplete="off"
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
            rows={8}
            className={css.textarea}
            placeholder="Enter note content"
            autoComplete="off"
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
