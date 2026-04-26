interface Props {
  message: string | null;
  kind?: 'info' | 'error';
}

export function Toast({ message, kind = 'info' }: Props) {
  if (!message) return null;
  return (
    <div className={`toast ${kind}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
