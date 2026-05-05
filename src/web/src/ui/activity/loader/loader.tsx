import { Disc3 } from "lucide-react";
import { cs } from "../../../lib/cs.ts";

type LoaderProps = {
  className?: string;
  center?: boolean;
  paddingTop?: number;
  size?: number;
};

export function MusicLoader(props: LoaderProps) {
  const {
    className,
    center = false,
    paddingTop = undefined,
    size = undefined,
  } = props;
  const isCentered = center ? "loader__center" : undefined;
  return (
    <div
      className={cs("loader", className, isCentered)}
      style={{ paddingTop }}
    >
      <Disc3 size={size} strokeWidth={2} />
    </div>
  );
}
