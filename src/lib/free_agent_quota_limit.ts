/** Maximum number of Basic Agent (free tier) messages per quota window.
 * Fork-local override: raised 20 → 1000 so the daily cap never bites in
 * practice; keeps upstream's quota machinery intact for easy merges. */
export const FREE_AGENT_QUOTA_LIMIT = 1000;
