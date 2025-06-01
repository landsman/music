import { useLingui } from "@lingui/react/macro";

interface EmptyStateProps {
  onRetry: () => void;
}

export function EmptyState({ onRetry }: EmptyStateProps) {
  const { t } = useLingui();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <p>No tracks found. This could be due to:</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>- No data in the database</li>
        <li>- Connection issues with Supabase</li>
        <li>- Authentication problems</li>
      </ul>
      <button type="button" onClick={onRetry}>
        {t`Retry`}
      </button>
    </div>
  );
}