/**
 * Builds a nextbillion-media:// protocol URL for serving media files in Electron.
 */
export function buildNextBillionMediaUrl(
  appPath: string,
  fileName: string,
): string {
  return `nextbillion-media://media/${encodeURIComponent(appPath)}/.nextbillion/media/${encodeURIComponent(fileName)}`;
}

/**
 * Builds a renderer-safe media URL whose filesystem path is resolved in main.
 */
export function buildNextBillionMediaUrlForApp(
  appId: number,
  fileName: string,
): string {
  return `nextbillion-media://media/app-id/${appId}/.nextbillion/media/${encodeURIComponent(fileName)}`;
}

/**
 * Builds a versioned URL for a bounded media-library thumbnail derivative.
 * The source version lets Chromium cache the derivative without showing stale
 * content after an image is replaced in place.
 */
export function buildNextBillionMediaThumbnailUrl(
  appPath: string,
  fileName: string,
  modifiedAtMs: number,
  sizeBytes: number,
): string {
  const url = new URL(buildNextBillionMediaUrl(appPath, fileName));
  url.searchParams.set("thumbnail", "1");
  url.searchParams.set("v", `${modifiedAtMs}:${sizeBytes}`);
  return url.toString();
}
