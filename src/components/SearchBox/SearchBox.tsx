import type { ChangeEvent } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search notes',
  id = 'search-notes',
  name = 'search',
}: SearchBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      autoComplete="search"
    />
  );
};

export default SearchBox;
