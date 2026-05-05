import { useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";

/**
 * https://github.com/BoxFactura/pulltorefresh.js
 */
export function usePullToRefresh() {
  useEffect(() => {
    // deno-lint-ignore no-window
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (!standalone) {
      return;
    }
    PullToRefresh.init({
      mainElement: "header",
      onRefresh() {
        location.reload();
      },
    });
    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return null;
}
