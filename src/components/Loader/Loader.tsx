import css from './Loader.module.css';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = 'Loading...' }: LoaderProps) => {
  return (
    <div className={css.loader}>
      <div className={css.spinner}></div>
      <p className={css.message}>{message}</p>
    </div>
  );
};

export default Loader;
