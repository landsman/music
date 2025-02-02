/**
 * how to resolve this issue with missing type otherwise?
 */
declare namespace EdgeRuntime {
  export function waitUntil<T>(promise: Promise<T>): Promise<T>;
}

/**
 * again, from what I should import this one.
 */
export interface BeforeUnloadEvent extends Event {
  detail?: {
    reason?: string;
  };
}
