import { useLingui } from "@lingui/react/macro";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useLingui();

  return (
    <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
      <p>
        {t`Error`}
        {error.message}
      </p>
      <button type="button" onClick={onRetry}>
        {t`retry`}
      </button>
    </div>
  );
}
