import { OrbitProgress } from "npm:react-loading-indicators@1.0.0";

type LoaderProps = {
  center?: boolean;
  paddingTop?: number;
};

export function Loader(
  { center = false, paddingTop = undefined }: LoaderProps,
) {
  return (
    <div
      className={center ? "loader__center" : undefined}
      style={{ paddingTop }}
    >
      <OrbitProgress variant="track-disc" color={"#FFF"} />
    </div>
  );
}
