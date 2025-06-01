import { useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";
import "./pull-to-refresh.css";

/**
 * https://github.com/BoxFactura/pulltorefresh.js
 */
export function usePullToRefresh() {
  useEffect(() => {
    const standalone =
      globalThis.matchMedia("(display-mode: standalone)").matches;
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
