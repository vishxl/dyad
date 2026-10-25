// Import before any module that reads browser storage.
import { migrateLegacyLocalStorage } from "./lib/legacy_local_storage";

if (typeof window !== "undefined") {
  migrateLegacyLocalStorage(window.localStorage);
}
