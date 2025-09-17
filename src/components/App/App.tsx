import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { Note, CreateNoteData, UpdateNoteData } from '../../types/note';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

const NOTES_PER_PAGE = 12;

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  // Fetch notes
  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: NOTES_PER_PAGE,
        search: debouncedSearchQuery,
      }),
  });

  // Create note
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      setCurrentPage(1);
    },
  });

  // Update note
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
    },
  });

  // Delete note
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setDeletingNoteId(null);
    },
    onError: () => {
      setDeletingNoteId(null);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleCreateNote = async (noteData: CreateNoteData) => {
    await createNoteMutation.mutateAsync(noteData);
  };

  const handleUpdateNote = async (noteData: UpdateNoteData) => {
    if (!editingNote) return;
    await updateNoteMutation.mutateAsync({
      id: editingNote.id,
      data: noteData,
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setDeletingNoteId(noteId);
    deleteNoteMutation.mutate(noteId);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  if (isLoading) return <Loader message="Loading notes..." />;

  if (error)
    return (
      <ErrorMessage
        message={
          error instanceof Error ? error.message : 'Failed to load notes'
        }
        onRetry={refetch}
      />
    );

  const notes: Note[] = notesData?.notes || [];
  const totalPages: number = notesData?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search notes"
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <button
          className={css.button}
          onClick={openCreateModal}
        >
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          onEdit={openEditModal}
          isDeleting={deletingNoteId}
        />
      ) : (
        <div className={css.emptyState}>
          <h2>No notes found</h2>
          <p>
            {debouncedSearchQuery
              ? `No notes match "${debouncedSearchQuery}". Try a different search term.`
              : 'Create your first note to get started!'}
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <NoteForm
          initialValues={editingNote || undefined}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          onCancel={closeModal}
          isSubmitting={
            createNoteMutation.isPending || updateNoteMutation.isPending
          }
        />
      </Modal>
    </div>
  );
};

export default App;
