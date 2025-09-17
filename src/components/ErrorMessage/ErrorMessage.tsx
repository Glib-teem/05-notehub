import css from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className={css.error}>
      <h3 className={css.title}>Error</h3>
      <p className={css.message}>{message}</p>
      {onRetry && (
        <button
          className={css.retryButton}
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
