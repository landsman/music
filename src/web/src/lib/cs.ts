/**
 * Combines a list of strings into a single space-separated string,
 * excluding null, undefined, and non-string values, and removing empty spaces.
 * @param args - A list of strings and potentially null/undefined values.
 */
export function cs(...args: (string | boolean | null | undefined)[]): string {
  const validStrings = args
    .filter((item): item is string =>
      typeof item === "string" && item.trim() !== ""
    )
    .map((item) => item.trim());

  return validStrings.join(" ");
}
