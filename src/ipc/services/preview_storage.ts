import { session } from "electron";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import { isAppPreviewHostname } from "../../../shared/preview_hostname";

/** App domains isolate cookies; legacy localhost cookies are shared across ports. */
export async function clearPreviewStorage(origin: string): Promise<void> {
  const url = URL.parse(origin);
  if (
    !url ||
    (!isAppPreviewHostname(url.hostname) && url.hostname !== "localhost") ||
    url.protocol !== "http:"
  ) {
    throw new NextBillionError(
      "Cannot clear storage for an unrecognized preview origin",
      NextBillionErrorKind.Validation,
    );
  }
  // Include the app's partitioned iframe storage, matching the frame origin
  // even when NextBillion's file:// renderer is the top-level site. Keep cookies out:
  // clearData removes them at registrable-domain scope, which is too broad.
  await session.defaultSession.clearData({
    origins: [url.origin],
    originMatchingMode: "origin-in-all-contexts",
    dataTypes: ["localStorage", "indexedDB", "serviceWorkers", "cache"],
  });
  const cookies = await session.defaultSession.cookies.get({
    domain: url.hostname,
  });
  for (const cookie of cookies) {
    if (cookie.domain?.replace(/^\./, "") !== url.hostname) continue;
    const cookieUrl = `${cookie.secure ? "https:" : "http:"}//${url.host}${cookie.path || "/"}`;
    await session.defaultSession.cookies.remove(cookieUrl, cookie.name);
  }
}
