# API-related learnings — routing index

How to handle data, use cases, common API errors. This file routes by topic;
the content lives in the scopes below (retrieval surfaces those scopes
directly, this index is the map when you need "everything we know about X").

## Where the API knowledge lives (read these scopes via retrieval or ls)

| Scope | What's in it |
| --- | --- |
| `viking://resources/nextbillion-docs` | Official API reference: request/response schemas, parameter semantics, limits |
| `viking://resources/nextbillion-sessions/support-tickets` | 102 real customer tickets distilled into 10 themes — failure modes + resolutions, verbatim threads with ticket IDs |
| `viking://resources/nextbillion-app-kb` | Integration lessons, common failures, durable engineering lessons |
| `viking://user/default/memories` | Durable rules: truck_size order/units, coordinate order, avoid-vs-exclude, honor_restrictions 422, HOS minimums, Cloud Run traps |

## Common API errors — distilled from real support tickets

| Error/topic | Theme file (read for rules + real ticket threads) |
| --- | --- |
| Truck routing / truck_size / HOS constraints | `nextbillion-sessions/support-tickets/themes/1-truck-routing-the-largest-cluster.md` |
| Distance Matrix (timeouts, matrix sizes) | `.../support-tickets/themes/2-distance-matrix.md` |
| Route Optimization (unassigned jobs, capacity) | `.../support-tickets/themes/3-route-optimization.md` |
| Directions / snapping / geometry mismatches | `.../support-tickets/themes/4-directions-snapping-navigation-geometry.md` |
| Geocoding / search quality | `.../support-tickets/themes/5-geocoding-search.md` |
| Maps styles / SDK loading | `.../support-tickets/themes/6-maps-styles-and-sdks.md` |
| Webhooks / geofences / integrations | `.../support-tickets/themes/7-webhooks-geofences-integrations.md` |
| API keys / access / account setup | `.../support-tickets/themes/8-api-keys-access-and-account-setup.md` |
| Latency / reliability | `.../support-tickets/themes/9-latency-and-reliability.md` |

Full index with ticket IDs: `nextbillion-sessions/support-tickets/themes/INDEX.md`.

## Data-handling rules (from durable memories — authoritative)

- `truck_size` = height,width,length in **centimeters**, that order, imperial units are a top customer mistake
- Coordinates are **lat,lon** — order errors are the most common 4xx cause
- `avoid` vs `exclude` are different semantics; `honor_restrictions` omission → 422
- HOS has nesting + minimum-time rules that silently drop feasible routes

## Answering customer support tickets with this KB (recipe)

A support agent (human or bot) answers a ticket independently via OpenViking:

1. Classify the ticket into a theme (truck routing, geocoding, keys, …).
2. `find` scoped to `viking://resources/nextbillion-sessions/support-tickets`
   with the ticket's symptoms — the theme lessons file gives the known failure
   mode + resolution; the tickets/ file gives verbatim prior threads with IDs.
3. For API semantics (parameter meaning, limits), `find` scoped to
   `viking://resources/nextbillion-docs`.
4. Cite ticket IDs for "we've seen this before" and the docs URI for the fix.