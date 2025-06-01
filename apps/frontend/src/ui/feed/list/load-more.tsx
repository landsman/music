import { useLingui } from "@lingui/react/macro";

interface LoadMoreProps {
  onLoadMore: () => void;
  isFetching: boolean;
  hasMoreData: boolean;
  error?: Error | null;
}

export function LoadMore(
  { onLoadMore, isFetching, hasMoreData, error }: LoadMoreProps,
) {
  const { t } = useLingui();

  if (error || !hasMoreData || !onLoadMore) {
    return null;
  }

  return (
    <div className="feed__load-more">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isFetching}
        className="feed__load-more-button"
      >
        {isFetching ? t`loading` : t`loadMore`}
      </button>
    </div>
  );
}
