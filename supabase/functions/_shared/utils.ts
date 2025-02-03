/**
 * Delay execution for a given number of milliseconds.
 * @param ms - Milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * avoid various wrong inputs
 */
export function isEmpty(input: string | null | undefined): boolean {
  return input === undefined || input === null ||
    input.replace(/\s/g, "").length === 0 || input === "null" ||
    input === "undefined";
}

/**
 * safe input from api to our database
 */
export function notEmptyOrNull(
  input: string | null | undefined,
): string | null {
  return isEmpty(input) ? null : input!;
}
