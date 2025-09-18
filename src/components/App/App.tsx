import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { Note } from '../../types/note';
import { fetchNotes } from '../../services/noteService';
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

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

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
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading && !notesData) return <Loader message="Loading notes..." />;

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
        <NoteList notes={notes} />
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
        <NoteForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default App;
