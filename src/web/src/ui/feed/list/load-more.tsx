import { useLingui } from "@lingui/react/macro";
import {usePlaySound} from "../../../lib/use-play-sound.ts";

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
  const { playClick } = usePlaySound();

  if (error || !hasMoreData || !onLoadMore) {
    return null;
  }

  function handleClick() {
    playClick();
    onLoadMore();
  }

  return (
    <div className="feed__load-more">
      <button
        type="button"
        onClick={handleClick}
        disabled={isFetching}
        className="feed__load-more-button"
      >
        {isFetching ? t`loading` : t`loadMore`}
      </button>
    </div>
  );
}
