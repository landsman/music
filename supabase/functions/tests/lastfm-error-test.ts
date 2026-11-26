import { assert, assertEquals, assertThrows } from "@std/assert";
import {
  LastFmError,
  throwOnLastFmError,
} from "../_shared/lastfm/api-client.ts";

Deno.test(function lastFmOutageIsTransient() {
  const error = assertThrows(
    () =>
      throwOnLastFmError({
        message: "Operation failed - Most likely the backend service failed.",
        error: 8,
      }),
    LastFmError,
  );
  assertEquals(error.code, 8);
  assert(error.transient);
});

Deno.test(function lastFmUserErrorIsReported() {
  const error = assertThrows(
    () => throwOnLastFmError({ message: "User not found", error: 6 }),
    LastFmError,
  );
  assert(!error.transient);
});

Deno.test(function lastFmDataPasses() {
  throwOnLastFmError({ recenttracks: { track: [] } });
  throwOnLastFmError(null);
});
