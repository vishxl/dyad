/**
 * Classified application errors for IPC/main-process code.
 * Use {@link NextBillionError} with a {@link NextBillionErrorKind} so telemetry can ignore
 * high-volume, non-actionable failures (see `shouldFilterTelemetryException`).
 */

export enum NextBillionErrorKind {
  Validation = "validation",
  NotFound = "not_found",
  Auth = "auth",
  Precondition = "precondition",
  Conflict = "conflict",
  UserCancelled = "user_cancelled",
  RateLimited = "rate_limited",
  /** Upstream failures; reported to PostHog by default unless you add finer metadata later. */
  External = "external",
  /** Bugs, invariant violations, unexpected failures — always reported. */
  Internal = "internal",
  /** Unclassified; treated as reportable until call sites are migrated. */
  Unknown = "unknown",
}

const TELEMETRY_FILTERED_KINDS: ReadonlySet<NextBillionErrorKind> = new Set([
  NextBillionErrorKind.Validation,
  NextBillionErrorKind.NotFound,
  NextBillionErrorKind.Auth,
  NextBillionErrorKind.Precondition,
  NextBillionErrorKind.Conflict,
  NextBillionErrorKind.UserCancelled,
  NextBillionErrorKind.RateLimited,
]);

/**
 * Returns true if this kind should not be sent to PostHog as an `$exception` event.
 */
export function isNextBillionErrorKindFilteredFromTelemetry(
  kind: NextBillionErrorKind,
): boolean {
  return TELEMETRY_FILTERED_KINDS.has(kind);
}

export class NextBillionError extends Error {
  readonly kind: NextBillionErrorKind;
  readonly cause?: unknown;

  constructor(
    message: string,
    kind: NextBillionErrorKind,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = "NextBillionError";
    this.kind = kind;
    this.cause = options?.cause;
  }
}

export function isNextBillionError(error: unknown): error is NextBillionError {
  return error instanceof NextBillionError;
}
