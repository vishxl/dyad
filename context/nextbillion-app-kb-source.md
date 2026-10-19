# NextBillion.ai Application & Domain Knowledge Base

**Purpose:** Source knowledge for an AI application builder generating realistic, client-specific NextBillion.ai demos and internal tools.  
**Prepared:** 2026-10-16  
**Primary source:** `merged_apps(1).md`, an exported Emergent conversation history with 22 applications (about 31.4k lines; approximately 756 KB).  
**Research scope:** Official NextBillion.ai pages and OpenViking documentation, plus selected official regulatory sources for relevant industries.  
**Boundary:** This document complements the user's already-integrated NextBillion.ai API reference. It does not reproduce endpoint catalogs, full request/response schemas, an OpenAPI definition, or an exhaustive parameter reference.

> **Evidence and safety note:** This is a source knowledge base, not a verified software inventory or guarantee that each exported demo remains deployed or operational today. Assistant statements such as “complete,” “production-ready,” and “tests passed” are attributed to the conversation and are not independent production verification. Credentials, bearer tokens, client secrets, passwords, and exposed API-key values found in the source were intentionally excluded.

## Contents

1. [Purpose, scope, and evidence labels](#1-purpose-scope-and-evidence-labels)
2. [OpenViking-oriented organization](#2-openviking-oriented-organization)
3. [Executive domain model](#3-executive-domain-model)
4. [Application catalog and cross-reference](#4-application-catalog-and-cross-reference)
5. [Detailed application profiles](#5-detailed-application-profiles)
6. [Industry and operating-model knowledge](#6-industry-and-operating-model-knowledge)
7. [Reusable application archetypes and workflow patterns](#7-reusable-application-archetypes-and-workflow-patterns)
8. [Data entities and relationship model](#8-data-entities-and-relationship-model)
9. [Geospatial and routing implementation requirements](#9-geospatial-and-routing-implementation-requirements)
10. [Integration lifecycle, errors, and observability](#10-integration-lifecycle-errors-and-observability)
11. [Security and data governance](#11-security-and-data-governance)
12. [UI/UX conventions and explicit preferences](#12-uiux-conventions-and-explicit-preferences)
13. [Business rules, edge cases, and validation](#13-business-rules-edge-cases-and-validation-checklist)
14. [Industry-specific application recipes](#14-industry-specific-application-recipes)
15. [Common failures and durable lessons](#15-common-failures-and-durable-lessons-from-the-export)
16. [How an AI builder should apply this knowledge](#16-how-an-ai-application-builder-should-apply-this-knowledge)
17. [Glossary](#17-glossary)
18. [External references and research limitations](#18-external-references-and-research-limitations)
19. [Coverage and completeness audit](#19-coverage-and-completeness-audit)

---

## 1. Purpose, scope, and evidence labels

### 1.1 Purpose

The target agent is an AI application builder that receives a new prospect/customer scenario and needs to determine what kind of business is operating; which operational problem and decisions the app must support; which prior application is the closest analogue; which NextBillion.ai capabilities matter; what inputs, data entities, constraints, screens, interactions, exports and error states are needed; and what remains unknown until customer data or real API responses confirm it.

The source examples span food delivery, fleet routing, clustering, field-service planning, EV delivery, incident/weather visualization, route discovery, reporting, spreadsheet automation, and developer-support utilities. Several are not end-customer logistics applications. Preserve this diversity.

### 1.2 Scope boundary

**Included:** business context, application intent, specific customer instructions, user roles, workflows, application features, data assumptions, implementation decisions, design patterns, intermediate corrections, failure modes, unresolved questions, reusable lessons and externally researched context.

**Excluded from duplication:** full NextBillion.ai API endpoint catalogs, full request/response schemas, OpenAPI definitions, and exhaustive parameter descriptions. Those are stated to be integrated already from [NextBillion.ai API documentation](https://docs.nextbillion.ai/). Reference a capability family here and defer exact parameter behavior to the current API source.

**Not established by the source:** current deployed availability of all Emergent previews, production reliability, actual identity of anonymized customers, full contents of workbook/JSON attachments that are only referenced, and business outcomes not explicitly evidenced in the export.

### 1.3 Evidence labels

- **[SOURCE]** Explicitly requested, corrected, shown or summarized in the 22 conversations.
- **[NB-OFFICIAL]** Described on an official NextBillion.ai product, demo, use-case, solution or case-study page.
- **[OPENVIKING-OFFICIAL]** Described in official OpenViking documentation.
- **[EXT-OFFICIAL]** From a government/authoritative external source; retain geography and applicability caveats.
- **[INFERENCE]** Reasonable synthesis, not a confirmed requirement for a named customer.
- **[RECOMMENDATION]** Reusable design or implementation guidance.
- **[UNVERIFIED]** Proposed/claimed behavior that the conversation does not demonstrate was truly validated.
- **[SOURCE-GAP]** A spreadsheet, screenshot, notebook, attachment or response is referenced but its full contents are not preserved in the merged text.

### 1.4 Evidence hierarchy and conflict handling

1. Prefer explicit user corrections and final confirmed choices over earlier assistant assumptions.
2. Keep unresolved contradictions visible; do not silently choose a winner.
3. Treat “complete,” “production-ready,” or “all tests passed” as **conversation-reported status**, not production proof.
4. A later error contradicting an earlier success statement should lower confidence.
5. Separate “requested,” “assistant says implemented,” and “actually tested in the transcript.”
6. Customer-specific constraints are not global rules for NextBillion.ai or all applications.

---

## 2. OpenViking-oriented organization

### 2.1 Context layers and ingestion

[OPENVIKING-OFFICIAL] OpenViking describes a filesystem-like organization for resources, memories and skills. Its context-layer guidance describes L0 abstracts (about 256 characters), L1 overviews (about 4,000 characters) and L2 original/full content loaded when needed. See [Context Layers](https://docs.openviking.ai/en/concepts/03-context-layers), [Retrieval Mechanism](https://docs.openviking.ai/en/concepts/07-retrieval) and [Extraction](https://docs.openviking.ai/en/concepts/06-extraction).

This source is structured to support high-level domain retrieval, application-level summaries and deeper original evidence. It does **not** invent OpenViking directory paths or mandatory schemas. Let OpenViking perform its own parsing, semantic processing, indexing, memory formation and any skill processing after ingestion.

### 2.2 Retrieval guidance

- Use the domain model, application catalog and cross-reference tables for broad requests, such as “build a field-service demo.”
- Retrieve the detailed app profile when a new request resembles a prior one, particularly to preserve negative constraints and known pitfalls.
- Retrieve geospatial, integration, security and validation sections alongside app profiles when generating code; short app summaries alone can lose critical implementation dependencies.
- Use context-aware semantic search for complex cross-app tasks and exact find/lookup for known app names or identifiers. Official OpenViking docs distinguish context-aware `search()` from simpler `find()`.
- Retain provenance/evidence labels. A recommendation must not become a customer requirement or claimed platform guarantee.

### 2.3 Organization and memory/skills boundary

Each profile repeats stable concepts: application name, source range, domain, archetype, intent, features, constraints, failures, state and confidence. These are semantic anchors, not a claim that OpenViking mandates these exact metadata fields.

Keep related knowledge together instead of splitting it into hundreds of disconnected notes. Wait for ingestion/extraction tasks to finish before assuming a resource is searchable; the extraction guide notes that ingestion may return a task ID before processing is complete.

[OPENVIKING-OFFICIAL] OpenViking supports memory and skill functionality, but the consuming agent/harness decides when/how to activate and execute skills. This document provides source knowledge and reusable procedures; it does not manually create undocumented memory records, skill registries or resource paths. See [Memory API](https://docs.openviking.ai/en/api/16-memory) and [Skills API](https://docs.openviking.ai/en/api/04-skills).

---

## 3. Executive domain model

### 3.1 Capability families represented

- **Route optimization and re-optimization:** multi-stop, multi-vehicle, shipment-based, time-windowed, weekly, EV, load-sensitive and manually re-sequenced plans.
- **Driving directions and distance/time:** road travel time, ETA, distance, route geometry and route comparison.
- **Maps and route presentation:** basemaps, route lines, markers, encoded geometry, selectable routes, filters, map popups and route-viewer links.
- **Clustering:** group outlets/jobs, show memberships/centers/boundaries, then route each group.
- **Geocoding/autocomplete:** resolve addresses and postcodes, suggest places, support coordinate entry and reverse geocoding.
- **Search Along Route / POI discovery:** route creation then POI search by category, markers and result list.
- **Traffic incidents/weather:** incident lines/markers, editable bounding boxes, weather polygons and layer controls.
- **Analytics/developer tools:** offline reports, A/B comparisons, payload debugging, Postman/OpenAPI artifacts and Sheets automation.
- **Specialized operational constraints:** EV charging legs, truck capacity, scale stops, depot loops, equipment compatibility, shifts, service time and skills.

[NB-OFFICIAL] NextBillion.ai's official demo and use-case pages also describe on-demand delivery, field services, trucking/freight, waste collection, NEMT, fuel delivery, food/beverage distribution, navigation and route optimization. These establish product-domain relevance, not that every feature was implemented in each exported application. See [Product Demos](https://nextbillion.ai/product-demos), [Use Cases](https://nextbillion.ai/use-cases), [Platform Overview](https://nextbillion.ai/platform-overview), and [Field Services](https://nextbillion.ai/solutions/field-services).

### 3.2 Complete application catalog

| # | Application | Primary domain | Archetype | Main interaction/output | Evidence/status caveat |
|---:|---|---|---|---|---|
| 1 | Delivery Navigator | Food delivery | Orders + multi-driver scheduled routing | Future-order generation, manifests, assignment, map/viewer, re-optimization | Repeated payload/coordinate/re-optimization errors; final summary claims completion, but needs regression test. |
| 2 | Design Boost / Route Studio | Route UI | Existing optimizer UI redesign/React port | Generate, optimize, re-optimize, compare | Controller reported preserved; some UI polish remained. |
| 3 | Drag Drop Routes | Dispatch/routing | Manual resequencing and re-optimization | Import RO JSON, route map, drag/drop order, share/export | Shared-plan plaintext-key approach reported; unsafe and must not be repeated. |
| 4 | Incident Tracker | Traffic/weather | Geospatial incident/weather dashboard | Bounding box, incident lines, popups, weather polygons/layers | Last weather type label still appeared wrong. |
| 5 | Location Grouper | Clustering | Async clustering explorer | Upload, create job, GET result by ID, cluster map | Actual response fields differed from assumed schema; final user report still says result fetch failed. |
| 6 | Nb Address Locator | Geocoding | Address/map/bookmark tool | Search, autocomplete, history/bookmarks, theme toggle | Light-mode contrast required refinement. |
| 7 | Nbai Route Report | Analytics | Offline optimization report | Upload input/result JSON, charts, route details, PDF | Reported tested; robust handling of missing fields was necessary. |
| 8 | Nextb Techguide | Developer onboarding | Postman/OpenAPI support | Collection + environment generation | User reported all requests as “request not found”; no proven fix. |
| 9 | Nextbillion Compare | Optimization analytics | A/B result comparison | Separate key/request ID/description, metrics and charts | Utilization % explicitly removed; route-wise distance graph removed. |
| 10 | Nextbillion Field | Field service | Weekly service planning | Cluster outlets, route weekly agent plan, dashboard/map | String/int ID mismatch blocked route generation; assistant reports fix. |
| 11 | Nextbillion RO API | Developer support | RO payload/template generator | Broad JSON template | API-reference tool, not a separate business app. |
| 12 | Nextbillion Routes | EV transport | Multi-leg EV optimizer | First leg, charger, second leg, map/battery panel | Summary reports test pass; map toggle zoom is critical acceptance criterion. |
| 13 | Pre Post Weigh Scale | Trucking | Scale stops and depot-loop constraint design | Pre-scale → customer → post-scale; separate delivery/pickup loops | Solver workarounds require real API validation. |
| 14 | Route Discovery | Route/POI | Directions + Search Along Route | Key prompt, route, distance/ETA, categories/POIs | Map style and SDK errors; final user report says map tiles still missing. |
| 15 | Route Poi Finder | Route/POI | Editable endpoints and POI search | Geocoding/autocomplete, draggable markers, controls | Explicit no-mock POI rule. |
| 16 | Route Search App | Route/POI | Shareable trip search | Map clicks, address input, POI list, geolocation, URL share | Stale-closure bug reported fixed; some mobile/accessibility backlog. |
| 17 | Routemaster | Fleet routing | Google Sheets optimizer | Read jobs/vehicles, create Route Plan sheet + viewer | Reported 40 vehicles/236 jobs; user said final output worked. |
| 18 | Scale Wrap Logistics | Trucking | Multi-trip/ordered-stop design analysis | Resolve scale → job → scale with multi-runs | No verified implementation; proposals are unverified. |
| 19 | Schedule Finder | Scheduling | Surveyor slot/viability engine | Gap finder, drive-time validation, preference filter | Excel workbook content not fully preserved in export. |
| 20 | Smart Router | Single-vehicle routing | Minimal route planner | Up to 10 stops, coordinates, distance/time, map | RO payload error remained unresolved in conversation. |
| 21 | Webdoc Helper | Indoor mapping | Pointr SDK troubleshooting | Access named site/instance and test credentials | Third-party, not NextBillion; credentials redacted. |
| 22 | Weekly Beats | Field sales | Weekly clustering + routes | 900 outlets, 7 agents, weekday clusters and road routes | In-memory-only; example 62-job result is fixture-specific. |

### 3.3 Customer context vs demo scaffolding

- **Named customer identity:** include only where explicitly identified and relevant. Most examples are product demos/internal tools, not verified named-customer deployments.
- **Demo data:** seeded restaurants/drivers, sample outlet CSVs, random orders, test payloads and placeholder keys are not evidence of a customer's actual operations.
- **Strong source-grounded constraints:** scale-stop sequences, equipment changes between delivery/pickup loops, weekly outlet visits, EV charge legs, scheduled orders/time windows, driver assignment and route/POI map presentation.
- **Generalization rule:** every new customer's fleet, rules, geography, data model and workflow must be elicited or sourced. Similar industry labels are not enough to copy all constraints.

---

## 4. Application catalog and cross-reference

| New request mentions… | Start with | Also inspect | Important distinction |
|---|---|---|---|
| Food orders, riders, future deliveries, cancellation/manifests | App 1 | Apps 3, 9, 17 | Customer-order checkout is not the same workflow as next-day batch planning. |
| Redesign existing optimizer without behavior drift | App 2 | Apps 3, 9 | Preserve controller logic, DOM/SDK contracts and behavior. |
| Drag/drop stop order and re-optimize | App 3 | Apps 1, 12 | Convert manual order into a supported solver constraint; don't fake the result. |
| Incidents, bounding box, weather overlays | App 4 | Apps 14–16 | Geometry, map layers and popup fields must remain aligned. |
| Clustering locations/jobs | App 5 | Apps 10, 22 | Async result retrieval and actual `job_ids`/center index matter. |
| Geocoding, autocomplete, bookmarks/history | App 6 | Apps 14–16, 19 | Keep key input, coordinate/address state and theme accessibility. |
| Offline analytics from a completed run | App 7 | App 9 | No API call is needed if the input/result JSON already exists. |
| Postman/OpenAPI onboarding | App 8 | App 11 | Tooling support, not an operational customer app. |
| Compare two RO results | App 9 | App 7 | Separate key/request ID/description and explicit metric rules. |
| Weekly field visits/agent plans | App 10 | Apps 19, 22 | Cluster membership must map to original IDs before routing. |
| Broad RO JSON template | App 11 | App 8 | Verify against live docs; do not duplicate API catalog here. |
| EV charging legs | App 12 | Apps 1, 17 | Model dynamic first-leg endpoint, range and charging connector. |
| Scale/weight, delivery-pickup loops | Apps 13, 18 | App 17 | Depot reset/equipment constraints are not proven by an attractive route map. |
| Directions + POIs | Apps 14–16 | App 6 | App 15 explicitly prohibits mock POIs; App 16 adds URL sharing/geolocation. |
| Scheduling slots and travel-time viability | App 19 | Apps 6, 10 | Preserve source Excel logic and label estimated vs road-time values. |
| One vehicle, ≤10 stops | App 20 | Apps 2, 3 | Keep scope simple; RO integration was not proven. |
| Pointr indoor SDK auth | App 21 | None | Separate vendor/credential domain. |

---

## 5. Detailed application profiles

### App 1. Delivery Navigator

**Source range:** `merged_apps(1).md`, lines 1–3,770. **Domain:** food delivery; future batch planning, multi-driver assignment, manifests and re-optimization. **Evidence status:** [SOURCE] Extensive iteration; assistant completion claims coexist with API failures/corrections.

**Intent/personas.** Demo for food-delivery prospects. The first version combined lightweight customer ordering with an admin dashboard. The user later clarified that the more differentiated workflow should plan **future orders scheduled for tomorrow**, rather than look only like live order placement. The main operational user is a dispatcher/admin; restaurant, customer and rider are associated actors.

**Reported features.** Customer side: three seeded restaurants (American, Italian, Japanese), menus, cart and order placement with delivery location. Admin side: overview metrics (total/pending/in-transit orders, active drivers), order filtering/assignment, driver and restaurant management, tabs for overview/orders/drivers/restaurants. Settings accepts a user-supplied key; no authentication was required. A separate Route Planning tab generates random future orders, allows individual or Select All/Deselect All choices for orders and available drivers, runs multi-driver optimization, and produces per-rider manifests. The user said all three sample riders must be available. The first and later summaries disagree about generated order count (15 vs 30 visible); do not treat any one count as canonical.

**Business logic.** Each delivery must be a shipment-like pair with pickup from restaurant and delivery to customer. This direction was explicitly corrected after the generated input reversed the two. Manifest data should include assigned driver, pickup/delivery locations, stop sequence, timings/ETAs, per-step distances/times and route summary. When an order is added/cancelled after planning, notify the admin and re-optimize the existing plan/task, refresh driver routes and clearly identify changes. The map must be legible for all drivers, with per-driver detail/manifest view and a proposed NextBillion route-planner viewer option using the request ID.

**Important corrections/errors.** Initial RO payload failed with `locations.location` missing. The user supplied a concrete request structure showing `locations` as an object with `id` and an array of coordinate strings. After a follow-up out-of-service-area error, user specifically corrected the app's serialized coordinate order to **latitude,longitude** for the RO location strings. Do not generalize this to GeoJSON, which commonly uses `[longitude, latitude]`; verify current endpoint documentation. User explicitly asked for Unix epoch timestamps for time windows, but a later turn also says “dont use time window” while complaining that Unix timestamps were not being used. That is unresolved and must be clarified on a new build. Re-optimization-on-delete failed in early iterations; the map was blank; encoded response polylines needed decoding. User explicitly prohibited `max_tasks` in RO vehicle objects. Browser console logging did not show the real payload, so a UI payload preview/download was requested. The existing real-time Orders tab and scheduled Route Planning tab must remain separate.

**Implementation/design.** Reported stack: React frontend, FastAPI backend, MongoDB and seed script; initial summary claimed 18 backend endpoints. First map used Leaflet/OSM; later iterations favored a larger, cleaner map or NextBillion route viewer. Preserve chosen renderer explicitly. Driver selection should reveal route statistics and ordered steps. Include states for no generated orders, no selections, optimizing, re-optimizing, API error, no assigned jobs, stale plan and successful updated manifest.

**Status caution / final-state gap.** Several assistant messages called the app “production ready” despite repeated 400/403 errors and subsequent map/re-optimization issues. In the final user feedback, the Orders tab was blank while the Drivers tab showed three drivers; clicking a driver should open that driver's actual route plan and manifest. The user also said re-optimization was not working well and that deleting an order gave no clear indication of the updated plan. These are acceptance gaps, not cosmetic polish. Fresh end-to-end tests are required before a reliability claim. The order count and time-window choice conflict in the source.

**Shared route viewer requirement.** The user supplied a reference that first calls the RO shared-result creation operation and then opens the NextBillion route-planner viewer with the task/request ID. When reproducing this pattern, consult the current official RO docs to confirm whether/how a share token or shared-result creation is required; do not assume a raw request ID always suffices. Never place the API key in the share URL, and use the actual ID from the POST response rather than a copied example.

**Reusable pattern:** generate/validate future orders → select resources → submit RO → retrieve result → assign shipment pairs → show each driver’s clickable manifest → render a clean multi-route map/viewer → on order change, run supported re-optimization → fetch and validate the new result → update the active manifest visibly and report affected changes → redact payload secrets.

### App 2. Design Boost / Route Studio

**Source range:** lines 3,771–4,716. **Domain:** UI redesign and React web port for an existing route optimizer. **Evidence:** [SOURCE] Assistant reports compile/lint/screenshot success; minor polish remained.

The user first asked to style a standalone HTML page, selected neutral colours and left design choices open. “React Native” was later clarified as **React.js for Web**, not mobile. Final assistant summary says the old controller logic (`src/lib/routeOptimizer.js`, roughly 1,500 lines) was preserved, including NextBillion Maps SDK and optimize/re-optimize/compare behavior, and all 39 DOM IDs referenced by the controller were retained. Reported stack is React 19 / CRA. Layout: 64px header with API-key pill, 420px left sidebar, full-height responsive map stage, Generate → Optimize → Re-optimize step tracker, empty state that hides on map mount. Style: warm editorial monochrome/paper, near-black and cream accents, Fraunces + Inter Tight + JetBrains Mono, glass panels, hairline borders and live indicator. Assistant noted the phase tracker still needed to reflect actual state and suggested serializing `city`, `numJobs`, and `numVehicles` into URL parameters. **Lesson:** if redesigning a working UI, preserve the old controller/DOM/SDK contract or refactor with regression tests; visual polish must not break route business logic.

### App 3. Drag Drop Routes

**Source range:** lines 4,717–5,714. **Domain:** route inspection, manual resequencing and constrained re-optimization. **Evidence:** [SOURCE] Detailed request, but no conclusive final acceptance summary.

The user wants a shareable app accepting RO input JSON by file upload or manual text, sending the **async optimization** request, fetching results and displaying ordered stops/routes on NextBillion's map. The operator can drag a stop (example: bring stop 5 before 4), then regenerate a payload encoding the desired order via a supported sequence relationship. The user initially referred to “indirect sequence” and subsequently approved using `in_sequence`; check current documentation for the exact supported semantics before implementing. The app is open/no login, with a dedicated masked API-key tab. Requirements added: actual road-following geometry, exact plan restored by share link, downloadable JSON/CSV manifest. A map-not-rendering issue was reported. Assistant later described plan persistence via `/api/plans`, link restore, geometry decoding and export, but the export does not independently prove the complete final flow.

**Security-critical pitfall:** a reported shared-plan implementation stored the API key in plaintext in the database so another person could open the map. Never repeat this. Share an opaque plan ID and sanitized plan/result data; keep keys in backend secret storage and authorize access. A recipient can provide their own key if required. **Lesson:** drag/drop is a constraint change, not just visual reordering. Show old vs user-desired sequence, run the solver, and show the actual returned plan rather than assuming the chosen order is feasible.

### App 4. Incident Tracker

**Source range:** lines 5,715–8,870. **Domain:** traffic incidents and weather overlays. **Evidence:** [SOURCE] many UI/map fixes; the final weather type mapping still appears incorrect.

The user provides a key, uses Columbus, Ohio as the incident example, chooses or enters a bounding box, fetches current incidents and can filter results. Each incident should have a colored road line when geometry is available, plus a clickable midpoint marker and detail popup. Later the user requested a collapsible Weather section with region selection, weather polygons, icons, legend/explanation and toggles so weather and incident layers can be displayed together or independently. The user specified valid region codes and labels: `europe` = Europe; `nam` = North America; `usa` = United States of America; `australia` = Australia; `latam` = Latin Americas. Re-verify current API support before shipping.

**Map UX requirements explicitly corrected.** A popup must be readable/in front of markers and have a visible X close button. A zoom-to-incident action is acceptable, but after fetch the map should fit the bbox and thereafter not auto-zoom out when a popup is closed, another incident is clicked, or a layer is toggled. User should control pan/zoom. Bbox can be drawn through two map clicks (minimum corner, maximum corner). Fetching weather should initially zoom to the selected region, then leave the map view in the user's control. Polygons should be less dark/translucent and aligned to the map; icons scale with zoom; a legend or side panel explains what polygons mean.

**Actual fields and unresolved bug.** User said intensity/value values mostly showed 0%; instead use `type` as popup heading, with `category` and `level` as subfields. `level` may be numeric, so calling `.toLowerCase()` caused a crash. The assistant added type normalization and numeric-level labels, but the final user then reported all types showed as precipitation even when Snow was selected. Thus the final `type` mapping is **not confirmed fixed**.

**Failures/lessons.** Map style URL once received only the first character of the key and returned 401. SDK methods `fitBounds`, `addSource`, `getCanvasContainer` were called on incompatible wrapper/map objects, leading to missing-method errors. Incident features drifted from markers during zoom; keep geographic coordinates/geometry and overlay lifecycle consistent. Test style loaded, incident data fetched, route geometry attached, marker/popups, bbox fit, zoom/pan and weather layers independently.

### App 5. Location Grouper

**Source range:** lines 8,871–12,205. **Domain:** async clustering explorer. **Evidence:** [SOURCE] repeated payload/result debugging; assistant reports final parser correction.

Flow: allow CSV or JSON upload, collect API key, expose the relevant clustering parameters through the UI, submit the POST request, capture the request ID in its acknowledgement, then call `GET https://api.nextbillion.io/clustering/result?id=<returned-id>&key=<key>` and render the real solution. The user explicitly asked to see the POST payload after repeated failures and supplied an example with a description and top-level `locations` array of `latitude,longitude` strings. Show the actual redacted outgoing payload and response status/error, not just console output. The result was expected to show cluster geometry/boundaries, centers, membership/counts and summary. The real response included `id`, `quantity`, `cost`, encoded `geometry`, `job_ids` and `center_location_index`, not the assumed `jobs` and `centroid`. Use the center index with the original location array; retain member-ID mapping. A backend may expose POST to its frontend as a proxy, but the upstream result fetch must still use GET. Async POST returns an ID, so poll/fetch according to current documented status semantics with bounded timeout/backoff. Initial map setup failed because `default.Map` was not a constructor, a warning not to mix SDK conventions.

**Final-state caution.** After payload and result-fetch changes, the user's last report was still “Failed to fetch clustering result.” Therefore the export does **not** establish that the full app works end-to-end. The final result-fetch error, request ID handling, status codes, key plumbing and response parsing must be tested using an actual successful response before marking complete.

### App 6. Nb Address Locator

**Source range:** lines 12,206–13,083. **Domain:** geocoding, autocomplete, bookmarks and history. **Evidence:** [SOURCE].

Requirements: user-provided key; NextBillion vector tiles/Maps SDK; free-text Geocoding search; zoom to returned coordinates; autocomplete after at least three characters; save/bookmark locations and retain search history; dark map-focused UI with light-theme option. Light mode must be readable rather than a raw inversion: `History`/`Bookmarks` and section/card headings were changed to dark slate/semibold, with cyan active state. Suggestions must be distinguished from a committed selected location. State whether history/bookmarks persist locally/remotely; don't imply persistence if data is only held in memory. Test keyboard interaction and theme contrast.

### App 7. Nbai Route Report

**Source range:** lines 13,084–14,453. **Domain:** offline report/dashboard from RO input and result JSON. **Evidence:** [SOURCE] user observed `NaN` and `.map()` failure; assistant reports final PDF implementation/test.

User clarified that the report consumes uploaded `.json` files and need not call RO again or ask for a key merely to display results. Reported tabs: Analytics, Vehicle Utilization, Cost Breakdown and Route Details. Charts include stacked/bar distance-time analysis, cost pie, efficiency area chart (km/hour), utilization bars, vehicle cards and expandable route timelines. User requested a PDF with all sections; assistant reports a ReportLab backend and one-click, timestamp-named download with summary, route details/timeline, cost analysis and vehicle utilization.

Original parser produced `NaN` and crashed because an optional field was undefined. Guard missing arrays/metrics, show N/A rather than fabricated zero, normalize units and match input/result JSON. If output cannot be joined to vehicles/jobs, show the inconsistency. Assistant said tests passed; this is not proof of production reliability.

### App 8. Nextb Techguide

**Source range:** lines 14,454–16,182. **Domain:** API-client onboarding/collection generation. **Evidence:** [SOURCE] unresolved “request not found” complaint.

Intended artifact was a Postman collection and environment generated from a NextBillion OpenAPI definition (source claims around 135 requests, an API-key variable and corrected OpenAPI file). User later reported every request returned “request not found.” The conversation includes parameter construction errors where names were duplicated/encoded into values. Validate paths, methods, base URL/server, operation IDs and variable interpolation; test a representative request after import. Desktop-vs-web import can diagnose a format issue but does not substitute for fixing malformed requests. Developer support, not a business app; final fix not established.

### App 9. Nextbillion Compare

**Source range:** lines 16,183–17,474. **Domain:** A/B comparison of RO results. **Evidence:** [SOURCE] numerous metric/style changes.

Two partitions A/B, each with its own key and request ID, plus a free-text description used as the section heading. Compare vehicles used, distance, duration and cost. Final theme is dark (a lighter iteration was later reversed). Remove jobs section; use result `cost`; convert distance meters to kilometres and duration seconds to hours/minutes in Quick Comparison. Vehicle utilization % was explored using cost/kg and then end-of-pickup capacity, but user finally asked to remove it. Do **not** re-add by default. User also removed the “Route-wise Distance Comparison” graph; source reports a general metric comparison chart and radar overview. Never compare differing currencies/objectives/constraints without surfacing the difference; missing values are N/A, not zero.

### App 10. Nextbillion Field

**Source range:** lines 17,475–18,295. **Domain:** weekly field service through clustering and route optimization. **Evidence:** [SOURCE] notebook replication; assistant reports ID mapping fix.

Based on an Observable notebook: outlet data and `agents_schedule` feed clustering of customer visits across a week; clusters plus agent schedules feed RO for a weekly plan. User wanted a technician/agent dashboard and route page, task management, but no live tracking/geofencing. Preload notebook CSVs; no outlet/agent editor was required; clean professional UI and optional logo. Source reports ~900 outlets and the assistant claimed 900 assigned across five weekdays (~180/day), a fixture-specific result, not a capacity guarantee. After clustering, Generate Routes remained disabled because clustered outlets weren't found. Diagnosis: API `job_ids` strings vs stored outlet IDs integers. Normalize boundary IDs and preserve originals. Related to App22 but do not merge away its agent-schedule/dashboard scope.

### App 11. Nextbillion RO API

**Source range:** lines 18,296–19,873. **Domain:** developer support for a comprehensive RO JSON template. **Evidence:** [SOURCE] template request and parameter documentation.

User wanted a broad template with documented fields, exact names/types/nesting, and correct separation of locations from job/vehicle references. Lessons: exact types and nesting matter; create a known-valid minimal fixture before adding optional attributes; map every business object to a location index; keep a visible index-to-source-entity table; a full template does not mean every field combination is compatible. This KB links to current API docs instead of copying the endpoint catalog.

### App 12. Nextbillion Routes

**Source range:** lines 19,874–21,466. **Domain:** EV delivery through two optimization legs with an intermediate charging station. **Evidence:** [SOURCE] final summary reports 11/11 acceptance checks in one test iteration; backlog also recorded.

Based on an Observable notebook. User asked for a single-page React frontend, NextBillion Maps SDK, Distance Matrix + RO, depot/vehicle/job inputs, EV battery/range constraints and charging stations. Stateless/no MongoDB; mask the key and never display it back.

The described workflow: optimize a first leg from start through jobs reachable before a range threshold (about 80 km in the example); use Distance Matrix data to find reachable charging stations; connect the end of Route 1 to the charger using road geometry (final implementation summary says Directions API); run a second optimization for remaining jobs after charging; show battery/range/consumption per route/stop. The 80 km is an example, not a universal range. If consumption/telemetry is only assumed, label it an estimate.

The user asked for a dark theme and independent Route 1/Route 2 toggles. Toggling a route after zooming into it must not zoom back out. Fit bounds once after a new optimization; visibility controls should change layer/marker visibility without rebuilding all layers or calling `fitBounds`. The charger connector is a dashed green Directions route with a legend and “Fetching road geometry…” progress state. User explicitly asked to inspect both JSON payloads sent for the two optimization POST requests; a payload inspector is a useful debug affordance but must redact the key. User specifically said to omit `end_index` on the first optimization's vehicle because that first leg should not force the entire trip to end at a fixed destination. Assistant summary reported 11/11 acceptance tests, zero console errors and zoom retention. Backlog: CSV upload, optional save/load (original scope was stateless, so require explicit scope change), distinct vehicle colors, CSV/PDF export, parallel Directions for large fleets and optional charger hiding when its vehicle is filtered.

### App 13. Pre Post Weigh Scale

**Source range:** lines 21,467–22,559. **Domain:** truck routing with weighing stops, depot returns and equipment/load compatibility. **Evidence:** [SOURCE] specific user-described tests; workarounds aren't conclusively verified.

**Scenario A, single 40,000 lb scaled delivery:** current pattern expands a scaled order into two shipments: A covers pre-scale to customer and B covers customer to post-scale; a shared customer-leg ID links Shipment A's delivery to Shipment B's pickup. User describes sequence orders 0/1 and 2/3, with amount on Shipment A only. The known single-order route works: depot → Pre-Weigh → RB Crystal Valley (40,000 lb) → Post-Weigh → depot.

**Scenario B, two 40,000 lb deliveries on one 40k tractor:** desired route is depot → pre-weigh → customer A → post-weigh → depot → pre-weigh → customer B → post-weigh → depot. Observed route incorrectly went to the second pre-weigh before completing the first post-weigh, then had consecutive post-weigh visits. This shows that adjacency of pre/post stops is not necessarily enough to force capacity-reset/depot-return behavior in a multi-run plan. Source JSON attachments are not fully recoverable here; don't infer a full correct payload from prose alone.

**Scenario C, pickups vs deliveries:** different physical attachments (e.g., tanker vs dry van) mean the truck cannot switch from delivering at one customer to picking up at another inside the same depot loop; it must return to yard to swap equipment. The example references deliveries #314 (40,000 lb RB Crystal Valley), #324 (40,000 lb Taylor Farms), and pickup #325 (10,000 lb / 8 pallets Amazon). Requirement: **no mixing inside a depot loop**, while allowing separate delivery and pickup loops later within the same shift.

A proposed pattern split each physical tractor into delivery-specific and pickup-specific virtual shift profiles with distinct skills, keeping depot/capacity/lunch constraints and assigning each job the matching skill. This is **[UNVERIFIED]**: test same-physical-truck double booking, solver semantics, capacity, lunch, shift, depot-return and route reconstruction on actual payloads. Don't turn the business rule into a global ban across the entire shift unless requested.

### App 14. Route Discovery

**Source range:** lines 22,560–24,361. **Domain:** Directions + Search Along Route POI demo. **Evidence:** [SOURCE] repeated SDK/tiles errors; final assistant summary reports route, map tiles and ETA/distance visible.

Requirements: ask for key at each session start; use NextBillion vector tiles/Maps SDK; start with sample origin/destination; Directions route with geometry, distance and ETA; category selection for supported POIs; Search Along Route; map-based display. User explicitly required NextBillion.ai APIs only. User wanted a map-focused sidebar/card presentation and location fields should be editable.

Debugging included route-parameter formatting, style JSON/tiles failing, wrong `.remove()` calls and confusion between a wrapper `mapInstance` and underlying `mapInstance.map`. An earlier assistant summary said NextBillion roads/terrain, blue route, SDK, key validation and a 13.4 km route were visible, but the **last user message says the map is not loaded and map tiles are still missing**. Therefore tile loading is unresolved at the export's endpoint. Re-test the end-to-end session from key prompt through style request, route generation and POI rendering; don't mark the application complete based on an earlier screenshot. Separate API success, style-loaded, map rendered and POI-rendered states.

### App 15. Route Poi Finder

**Source range:** lines 24,362–26,468. **Domain:** editable route with geocoding/autocomplete and POIs. **Evidence:** [SOURCE] summary reports the most important change completed.

User requested NextBillion Maps SDK for Web, Directions and Search Along Route; key prompt; editable/searchable origin and destination; geocoding; autocomplete after ≥3 characters; updated markers/routes when endpoints change; draggable origin/destination; manual `latitude,longitude` input; zoom/pan/bearing controls; results markers with popups and map zoom-to behavior.

**Hard negative constraint:** when Search Along Route returns zero results or an error, never show mock/sample POIs. Show “No places of interest found,” with a suggestion to change category or route; distinguish empty results from API errors in toast/status. An error is not a successful empty query. SDK integration showed `map.getLayer` and `getCanvasContainer` missing-method errors; confirm correct map instance and helper API instead of mixing SDK conventions.

### App 16. Route Search App

**Source range:** lines 26,469–27,469. **Domain:** route/POI search with address/map input and shareable URL. **Evidence:** [SOURCE] summary says example route and 10 POIs rendered successfully; some backlog remained.

User asked to hide the key and proxy through FastAPI; support both manual address input and map-click endpoints; quick-select POI categories; NextBillion map tiles; markers and side-by-side list. Later features: “Use my location” via browser geolocation + reverse-geocoding proxy; shareable URL whose `o`, `d`, `c` and `t` query parameters restore origin/destination/category/detour settings on load; Share button copies URL.

A map click handler captured stale `pickMode` at initialization and always set origin. A `useRef`-backed handler reportedly fixed it so first click sets A/origin and next sets B/destination. Assistant summary says reloading an example URL restored the route and 10 actual POIs. Backlog: alternative routes, clustering when >50 POIs, mobile bottom sheet, slider keyboard accessibility. Shared URLs must never expose credentials.

### App 17. Routemaster

**Source range:** lines 27,470–28,206. **Domain:** Google Sheets + Apps Script optimization. **Evidence:** [SOURCE] user later said the output worked well after result retrieval was corrected.

The workbook has tabs named `vehicles` and `jobs`. Assistant summary reports 40 vehicles across NJ/TX/OH/CA depots, 236 jobs, ten-minute service, and a Dec 15–19, 2025 planning window. These are source fixture facts, not defaults. User wanted a script in the sheet, key provided by user, a button/menu action to build the optimization request, and a new `Route Plan` sheet containing request ID/result, route details and viewer link.

Flow: read both tabs → validate/build locations/jobs/vehicles → submit RO → capture ID → fetch/poll result with GET → populate new Route Plan tab. Output should include total cost/distance/duration, stepwise routes for each vehicle and unassigned jobs/reasons. User explicitly caught a case where the sheet was empty and asked whether result GET had been called; a blank output sheet is not done. A route-planner viewer URL was to be added at the beginning with the actual request ID substituted. Script and README were reported created; user had earlier needed a download because they couldn't locate the file. Keep keys out of shared cells/URLs/logs and protect the settings area.

### App 18. Scale Wrap Logistics

**Source range:** lines 28,207–28,442. **Domain:** RO constraint analysis for scale stops plus multi-run routing. **Evidence:** [SOURCE] one scenario/error and proposed alternatives, no verified solution.

For weighed job 116, the customer puts the scale at location index 1 and models pre-scale (600 s), customer job and post-scale at the scale, linked by `in_direct_sequence`. Existing vehicles use `max_depot_runs: 10`; RO returns “relations cannot work with vehicle multi runs.” The goal is scale → customer → scale while retaining multi-trip routing.

Discussion mentioned potential two-phase optimization, shipment/capacity modelling instead of relations, re-optimizing committed stops, or segregating skill/vehicle pools. The transcript doesn't validate these. Do not tell the user that swapping to `in_sequence`, pinning a vehicle, or splitting jobs automatically fixes the issue. Reproduce with a minimal real payload/result and current docs. Separate the questions: strict adjacent stop sequence, depot return, multi-run capability, capacity/load reset, and vehicle assignment freedom.

### App 19. Schedule Finder

**Source range:** lines 28,443–29,462. **Domain:** a surveyor appointment/slot engine. **Evidence:** [SOURCE] final Directions integration described; workbook formulas not fully represented.

User asked to understand an attached Excel, then build a web version from that data rather than a missing Breeze-It API/N8N endpoint. Start with one surveyor, Josh. Dark theme with timeline, schedule dashboard, editable Master Configuration and three stages: **Gap Finder** for open/unoccupied slots, **Viability Check** for drive time between previous/next appointments, and **Preference Filter** for customer preference matching. Use NextBillion Postcode Geocoding instead of postcodes.io and use Directions for road-based driving time.

Reported flow: postcode → coordinates → Directions road time → decide whether the slot is viable. Show **Road** when actual directions are used, and **Est** when a Haversine estimate is used without key/configuration. Estimates are not proof of appointment feasibility. The actual Excel workbook was referenced but its complete formulas/cell values are not preserved in the export; inspect the workbook before claiming exact slot-engine fidelity.

### App 20. Smart Router

**Source range:** lines 29,463–30,081. **Domain:** minimal single-vehicle route planner. **Evidence:** [SOURCE] RO call was still described as failing.

Scope is intentionally small: NextBillion RO + web Maps SDK, one vehicle, up to ten stops, manual coordinate input, user choice of distance or time objective, simple route display and interactive zoom/pan. User supplied key; development used a placeholder. The map/frontend included mock-data behavior, but the actual optimization request was still failing with `locations.location` missing. Do not claim the API integration works because a map renders. Clearly label demo data and show the exact redacted request/response; success requires a real API result.

### App 21. Webdoc Helper

**Source range:** lines 30,082–30,688. **Domain:** third-party Pointr indoor-map WebSDK troubleshooting, not a NextBillion routing app. **Evidence:** [SOURCE] no conclusive successful SDK initialization.

The user wanted the existing HTML understood and then asked to load `stockholm_factory_site` from a Pointr `poc-v9-demo` instance rather than a playground instance. A REST call returned published site data with a bearer token obtained from username/password authentication, but the WebSDK failed to initialize. Pointr was said to require instance/license-specific client credentials; the old client secret resulted in “Client can not be found with given license key.” User asked whether Postman can test the SDK configuration and repeatedly requested a downloadable file.

Credential-like values (tokens/password/client secret) occurred in the source and are omitted here. Rotate/revoke if real and still active. A working REST API call does not prove the WebSDK credential is valid. Keep this case under third-party integration support, not NextBillion product capabilities. No final working result is established.

### App 22. Weekly Beats

**Source range:** lines 30,689–31,378. **Domain:** field sales/beat planning using clustering and weekly RO. **Evidence:** [SOURCE] assistant reports final map/geometry behavior.

Based on an Observable notebook shared with App10. Preload sample CSVs (about 900 outlets and 7 agents); group outlets by visit plan with clustering; combine clusters and `agents_schedule` with RO to form weekly beat routes. User selected single-user, no-auth and in-memory-only data (no persistence). Initially a Leaflet/OSM view existed; user explicitly asked for NextBillion Maps SDK instead of OSM and required decoding response polylines because straight-line routes were misleading.

Final summary says the basemap was switched to NextBillion raster tiles, precision-5 encoded polyline decoder added, backend passed route `geometry` and `snapped_location`, and routes followed roads. Reported test: five weekday-color groups; one vehicle had 40 jobs, another 22; 62 jobs, zero unassigned. Treat as fixture-specific. App is stateless by design, so state loss after restart is expected. Any OSM fallback must not silently pass as a successful NextBillion map.


---

## 6. Industry and operating-model knowledge

This section combines patterns recurring in the apps with outside context. Industry descriptions are deliberately generic; they must not be misattributed to a named customer. NextBillion.ai's public materials describe capabilities for route optimization, fleet/truck routing, distance matrices, clustering, navigation, traffic incidents, field service, on-demand delivery, waste, fuel and medical transportation. This is a capability mapping, not proof that every feature is suitable for every deployment. Sources: [product demos](https://nextbillion.ai/product-demos), [use cases](https://nextbillion.ai/use-cases), [solutions](https://nextbillion.ai/solutions), [platform overview](https://nextbillion.ai/platform-overview).

### 6.1 Food delivery and on-demand delivery

**Operating model.** Orders are created continuously, usually with a restaurant/store pickup and consumer drop-off. Operations teams must balance promised delivery windows, food readiness, rider availability, batching, travel time, service time, vehicle capacity and cancellation/new-order events. The operating plan is dynamic: an optimized plan for tomorrow is distinct from live dispatch for orders arriving now.

**Roles:** dispatch/admin, fleet/rider manager, restaurant partner, delivery rider/driver, customer support and (in a customer-facing app) consumer. Do not build consumer checkout unless the demo explicitly needs it; several logistics prospect demos are better represented by an admin planning console with seeded data.

**Useful entities:** order, pickup location, delivery location, restaurant, customer, driver/rider, vehicle, service window, preparation time, delivery promise, shipment/pickup-delivery pair, route/manifest, optimization task/request, notification and cancellation event.

**Key decisions and constraints:** which rider gets which orders; whether pickup-before-delivery precedence is respected; whether food readiness and promise windows can be met; whether orders can be batched; route continuity after cancellation; whether a rider has capacity and is on shift. Use genuine pickup-delivery pairing where required by the use case, not unrelated generic “jobs”.

**App evidence:** App 1, Delivery Navigator, requests consumer order placement, restaurant selection/cart, admin order/driver management, scheduled future orders, multi-driver RO, per-driver manifest, a presentable all-routes map, notifications and re-optimization. The transcript changed repeatedly and contains unresolved behavior; see App 1 rather than assuming the summarized final state is verified.

**NextBillion.ai fit:** route optimization, distance matrix/ETA, geocoding, map rendering and possibly clustering/geofencing depending on the problem. Official [on-demand delivery documentation](https://docs.nextbillion.ai/solutions/on-demand-delivery) describes ETA, rider allocation, batching/multiple deliveries, geofences, clustering and service boundaries. Not every demo needs all of them. For a future-order optimizer, use scheduled future orders rather than pretending it's a live real-time order stream.

**Exceptions:** restaurant delay, customer unreachable, invalid/ambiguous address, restricted access, late readiness, missed time window, rider unavailable, duplicate order, cancellation after dispatch, new order after optimization, no feasible assignment and API timeout. Every exception needs a visible status and next action; do not merely repaint the route.

**Relevant recipe:** App 1 + the async task and map lessons in Sections 9–10. For batch planning, seed plausible, varied locations and disclose that records are synthetic. A demo should visibly separate “sample data” from API-derived result values.

### 6.2 Field services, beat planning and recurring visits

**Operating model.** A field-sales, service or inspection organization allocates jobs to agents/technicians over a shift, day or week. Geography is important, but skill, visit frequency, customer priority, depot/territory, job duration, availability and recurring visit cadence may dominate distance alone.

**Roles:** operations planner, dispatcher, area/territory manager, agent/technician, and sometimes sales manager or service coordinator.

**Entities:** customer/site/outlet, visit/job, agent/technician, vehicle (where relevant), skill, shift/calendar, territory, priority, service duration, visit frequency, assigned day, cluster, route and unassigned reason.

**Workflow:** import customers and resource schedules → validate coordinates/IDs → group geographically (if useful) → create jobs and constraints → optimize day/weekly plans → show each agent's stops and weekday/route colours → inspect unassigned jobs → export/share plan. Clustering is not dispatch by itself: clusters must be mapped back to original customer IDs and connected to agent availability and the downstream scheduling task.

**App evidence:** Apps 10 and 22 build weekly beats from an Observable notebook; around 900 outlets and 7 agents are mentioned. App 10 focuses on clustering and weekly plans; App 22 adds NextBillion Maps rendering and geometry decoding, with a reported test fixture of 62 assigned jobs and zero unassigned. App 16 is a consumer-style route/POI tool, not a field-service allocator. App 19's single-surveyor slot model has different semantics and should not be conflated with territory beat planning.

**NextBillion.ai fit:** clustering to group location data, RO to assign/order jobs under constraints, distance matrix or Directions to estimate travel, map display for review. Official [field-service solution](https://nextbillion.ai/solutions/field-services) discusses scheduling, skill allocation, territories, shift extension, last-minute changes, geofencing and ETA. The precise constraint set depends on the customer's operational model.

**Important edge cases:** customer IDs represented as strings in CSV/notebook but integers in a database; jobs silently duplicated or dropped during cluster conversion; weekly cadence collapsed to one day; agents' shift times ignored; empty or invalid coordinates; jobs outside allowed territory; over-capacity workload; impossible visit frequency; a job left unassigned without a reason.

### 6.3 Trucking, freight and multi-stop/multi-depot routing

**Operating model.** A fleet plans pickups/deliveries across vehicles, depots, time windows, cargo loads, driver shifts and truck-specific road constraints. A route that is shortest for a passenger car may be illegal or impossible for a heavy goods vehicle. Freight, LTL, backhaul, depot returns, capacity and load changes must be represented explicitly where they matter.

**Roles:** transport planner, fleet dispatcher, fleet manager, driver, warehouse/depot team and customer receiving dock.

**Entities:** vehicle class/dimensions, capacity/load units, starting/ending depot, job or shipment, pickup/delivery pair, shipment quantity/demand, service time, time window, driver/shift, route stop, relation/precedence and unassigned cause.

**App evidence:** App 17 (Routemaster) imports Google Sheets tabs named `vehicles` and `jobs`; source mentions about 40 vehicles and 236 jobs across NJ/TX/OH/CA, a 10-minute service time and date range Dec 15–19, 2025. The reported working script produces a new Route Plan sheet with summaries, per-vehicle ordered steps and unassigned reasons. Apps 13 and 18 represent special scale and multi-run constraints, not generalized solved patterns. App 20 is a deliberately bounded one-vehicle planner with max 10 stops, but the RO integration remained broken in the export.

**NextBillion.ai fit:** truck routing and route optimization; distance matrix for pairwise costs; Directions/navigation for roads and leg visualization; map tiles for spatial review. Official use cases include dispatch planning, load optimization, LTL, multi-day/week routes and HOS-related workflows; use [use cases](https://nextbillion.ai/use-cases) and relevant product demos as starting points, then confirm product/version specifics in the integrated API docs.

**Constraints worth making explicit when relevant:** vehicle dimensions/weight, load demand/capacity, pickup before delivery, delivery before return, shift start/end, service duration, time windows, allowed road profile, route toll/avoidance policy, depot run limit, compatibility with equipment/attachment, driver availability and mandatory route stop order.

**Scale-specific case:** Apps 13 and 18 show why a physical process must be modeled as entities and dependencies, not just a list of points. Weigh-in → customer → weigh-out can require a strict sequence and potentially depot-run/load-reset semantics. The export does not establish a verified fix for the `max_depot_runs` + relation incompatibility. Do not promise a solution until a minimal payload is tested.

### 6.4 Electric-vehicle routing and charging

**Operating model.** A route planner must determine whether a vehicle can reach jobs within its usable range, where to charge, and how to plan the remaining stops after charging. This is not equivalent to drawing a charger icon on a map.

**App evidence:** App 12, Nextbillion Routes, proposes a two-leg process: calculate a first leg to a candidate charger, render the actual driving geometry, then optimize remaining jobs from the charging location. The app includes a battery/range panel and route-leg visibility toggles. The assistant's summary reports 11/11 tests; interpret as reported test status.

**Required inputs where supported by the customer:** starting battery/usable range, safety reserve, estimated consumption assumption, candidate charging points, charging duration/availability, job locations/windows, vehicle capacity and shift constraints. Keep assumptions visible if the API or source data does not model them directly.

**Recommendation:** treat “charger reachable” as a feasibility check using a road route and distance/energy assumptions, not a straight-line radius. Route-visibility toggles must not reset the map camera. Clearly distinguish API-derived route distance from model-estimated remaining range or charge duration.

### 6.5 Field scheduling and appointment viability

**Operating model.** A calendar or service-booking system needs to judge whether a new appointment fits between existing appointments once travel time is considered. A free slot is not necessarily a feasible slot if it is geographically too far away.

**App evidence:** App 19, Schedule Finder, uses a single-surveyor example (“Josh”) and three stages: Gap Finder, Viability Check and Preference Filter, with editable Master Configuration. The original Excel is the intended source of truth but the merged text does not preserve every cell/formula. The user rejected relying on an inaccessible Breeze-It API/N8N route and asked for a standalone web implementation using their data.

**Recommendation:** represent appointments, durations, postcode/coordinates, availability windows, travel buffers, customer preferences and resource shifts separately. Use postcode geocoding then Directions for actual road times when a key is configured. If a fallback Haversine estimate is shown, label it `Est`; use `Road` only for a genuine road-route result. Do not claim exact fidelity before comparing output against the source workbook.

### 6.6 Incident, traffic and weather intelligence

**Operating model.** A dispatcher/analyst needs to discover relevant disruptions, inspect them spatially, understand validity and severity, and relate them to operating areas or routes. Weather or traffic layers are contextual signals, not necessarily route optimization inputs unless the data and product integration explicitly support that behavior.

**App evidence:** App 4 asks for an incident map around Columbus, Ohio with a two-click rectangular search area, category/severity filters, validity, road polylines and popup details; weather polygons are a separate layer with region parameter, type, category and level. It later had a reported bug where weather types rendered as “Precip” even for snow, plus wrapper/map bugs. Never hide this unresolved issue.

**Recommended UX:** explicitly show query area and refresh action, last retrieval time, active filters, layer legend, incident validity and distinct empty/error states. Avoid automatic camera resets when popups open/close or layers toggle. Do not relabel raw returned fields into domain interpretations without verifying semantics.

### 6.7 Route discovery and points of interest

**Operating model.** A traveller, sales representative or field worker wants to route between origin and destination, then find relevant places along the actual route and understand detour or route-distance implications.

**App evidence:** Apps 14–16 cover Directions + Search Along Route, POI category selection, map markers/list, address geocoding and autocomplete, click-to-set endpoints, draggable markers, geolocation and shareable URLs. The user explicitly preferred strict use of NextBillion.ai capabilities for App 14. App 15 explicitly rejects mock POI markers when no results are returned or the API errors.

**Recommendation:** query against the route geometry rather than a straight-line corridor inferred from endpoints; make category and detour controls visible; synchronise map and result list; use readable labels and marker popups; distinguish “no POIs found” from “search failed.” A share URL should contain only intentional, non-sensitive trip parameters.

### 6.8 Developer productivity and result analysis

Apps 7, 8, 9 and 11 are support tools rather than vertical customer products:

- **App 7, Nbai Route Report:** offline JSON-to-report tool; user uploads RO input and result JSON, expects robust PDF reporting and charts. Do not require an API key or silently interpret missing metric values as zero.
- **App 8, Nextb Techguide:** OpenAPI/Postman collection generation from a large spec. A “request not found” report means packaging/import correctness remains a concern; the transcript doesn't prove all consumers can import it successfully.
- **App 9, Nextbillion Compare:** A/B analysis of two async optimization results, each with its own key, result/request ID and description. User asks for vehicle count, total cost, total distance and duration, route-level metrics and graphs. Explicitly rejected utilization percentage and route-wise distance graph. Convert units and clearly say which raw metrics support each chart.
- **App 11, Nextbillion RO API:** payload/request-building and developer support. This is not an end-user dispatch application, and the shared API reference should remain the authoritative source for exact parameter schema.

**Useful pattern:** validate file format and data shape at upload; identify the exact metric fields actually present; use explicit missing-data indicators; allow report download; attach source task/request IDs; keep parsing errors actionable and non-destructive.

### 6.9 Waste, fuel, NEMT and other possible verticals

These verticals appear in official NextBillion.ai product demos/use cases but are **not all represented by a detailed client application in the source export**. Treat the following as prospect-discovery templates, not observed customer requirements.

- **Waste and municipal collection:** periodic or on-demand stops, vehicle types/capacity, disposal/transfer sites, service territories, access constraints, collection sequence and missed-service exceptions. Ask whether routes repeat, whether loads need disposal trips and what proof of service is required.
- **Fuel and hazardous-material delivery:** product/customer compatibility, truck/trailer constraints, hazardous-material restrictions, quantity/capacity, safe access, delivery windows and return-to-depot patterns. US hazmat requirements depend on commodity, quantity, jurisdiction and carrier; consult current [PHMSA Hazardous Materials Regulations](https://www.phmsa.dot.gov/standards-rulemaking/hazmat/hazardous-materials-regulations). A general route planner is not itself a compliance validator.
- **Non-emergency medical transportation (NEMT):** riders, pickup/drop-off windows, trip eligibility, vehicle accessibility, passenger capacity, recurring trips, appointment time, pickup tolerance and return trip. Requirements vary by state/program and provider. Use [CMS NEMT resources](https://www.cms.gov/medicare/medicaid-coordination/states/non-emergency-medical-transportation) and [Medicaid transportation assurance](https://www.medicaid.gov/medicaid/benefits/assurance-of-transportation); never assume a demo's routing result proves medical, payer or accessibility compliance.
- **Food/beverage distribution:** delivery schedules, temperature-sensitive product, equipment, sanitation, quantities and multi-stop load plans. US sanitary transportation obligations apply in scope-specific cases; consult the [FDA Sanitary Transportation rule](https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-sanitary-transportation-human-and-animal-food). Model temperature or equipment rules only if provided.
- **Truck-safe routing/fleet telematics:** vehicle-specific routing and distance/time estimates can support telematics or dispatch. Official case studies include [truck-safe distance matrix and fleet telematics](https://nextbillion.ai/case-studies/truck-safe-distance-matrix-api-fleet-telematics) and [global logistics truck routing](https://nextbillion.ai/case-studies/global-logistics-truck-routing-60-countries). Treat them as vendor case studies, not independent performance benchmarks.

For any new vertical, first clarify the workflow and resource model. Do not infer that because NextBillion.ai markets a solution, a particular route constraint, compliance status, or exact business outcome is guaranteed by an API.

---

## 7. Reusable application archetypes and workflow patterns

These are reusable archetypes inferred from the 22 examples. They are not all one canonical product or required screens. Each new request should choose the smallest appropriate pattern and preserve any client-specific exceptions.

### 7.1 Archetype catalogue

| Archetype | Typical screens/modules | Primary workflow | Closest source apps | Important distinctions |
|---|---|---|---|---|
| Scheduled multi-vehicle planner | Data selection, vehicle selector, constraint panel, optimize action, manifest, map, unassigned list | Import/seed → validate → select → submit → poll → assign → inspect/export | 1, 10, 17, 22 | Must retain job/vehicle identity, scheduling scope and per-vehicle manifest. |
| Live dispatch/order console | Overview KPIs, orders, drivers, restaurants/customers, notifications | Receive/update orders → assign → dispatch → respond to exception | 1 | Live order workflow is different from tomorrow's batch plan. |
| Single-vehicle multi-stop planner | Stop list, objective, map, optimize button, ordered route | Add/reorder stops → optimize → compare sequence/map | 20 (scope); 3 (manual route change) | App 20 integration remained unresolved; use as intent, not verified implementation. |
| Route editing and re-sequencing | Route list, draggable stops, map, save/share/export | Load plan → reorder → re-optimize/recalculate → persist/share | 3, 2 | A changed display order alone is not an updated RO plan. |
| Cluster-to-schedule planner | Customer/job import, clustering controls, cluster map, agent schedule, weekly routes | Cluster → map IDs to jobs → allocate → optimize → review weekly plan | 5, 10, 22 | Keep clustering output contract separate from RO input contract. |
| Route result analysis | Two result inputs or JSON upload, overall metrics, per-route table, charts, PDF/CSV export | Retrieve/parse → normalize units → compare/report → download | 7, 9 | Metrics must be present in data; never fabricate a field to populate a graph. |
| Route and POI discovery | Origin/destination fields, category/detour controls, route map, POI list | Geocode → Directions → route geometry → Search Along Route → synchronize results | 14, 15, 16 | Empty results and errors are different states; no fake markers. |
| Geocoding utility | Address search/autocomplete, result map, history/bookmarks, key settings | Enter query → geocode/autocomplete → select → inspect/save | 6 | Debounce requests, enforce minimum query length if specified, and preserve accessible theme contrast. |
| Incident/weather intelligence | Region/bbox selection, filters, incidents table/map, weather layer controls | Query → display geometry/details → filter/inspect → toggle context layers | 4 | Preserve raw returned type/category/level semantics; map state must remain stable. |
| EV route-stage planner | Vehicle range panel, charger selection, leg controls, job plan and map | Verify range → route to charger → charge assumption → optimize remaining jobs | 12 | Explicitly distinguish calculated route distances from assumed battery/charge values. |
| Appointment slot viability | Calendar/timeline, master config, open gaps, travel viability, preferences | Find gaps → evaluate road travel feasibility → filter by preference | 19 | A time gap without sufficient travel time is not a feasible slot. |
| Spreadsheet optimization automation | Sheet menu/config, validation, run/progress feedback, output worksheet | Read tabs → validate → submit/poll → write plan and unassigned reasons | 17 | Must use actual result GET, not only request acceptance; output should be traceable to task ID. |
| Offline result report | JSON upload, validation, metrics/charts, PDF report | Upload → parse → validate → summarize → export | 7 | No API key required unless the tool actually calls an API. |
| API/developer helper | Key/config, request template/payload viewer, response/error preview, download | Configure → build/validate request → submit or preview → inspect error/result | 8, 11, and App 1's debug flow | Never reproduce keys, and do not pretend a request template is an authoritative API schema. |
| Third-party SDK integration troubleshooting | Credential settings, instance/site configuration, diagnostics | Validate REST auth → validate SDK/client license → render → diagnose independently | 21 | Not a NextBillion feature. A REST success does not validate a separate SDK license. |

### 7.2 Generic planning workflow

Use this sequence only when it fits the requested domain:

1. **Define the operating problem.** Is it static future planning, rolling replanning, a consumer-facing live order flow, route exploration, report analysis, or an offline calculation?
2. **Acquire data.** Import from the stated workbook/CSV/notebook, call the applicable API, or seed synthetic demo data. Mark synthetic records.
3. **Validate data before optimization.** Check coordinates, unique IDs, time zone, timestamp units, resource availability, capacity dimensions and referential integrity. Do not silently coerce invalid IDs.
4. **Build constraints from the real process.** Add pickup/delivery relationships, service durations, time windows, capacities, vehicle/agent skills, depots, shifts, sequence dependencies and other constraints only if needed.
5. **Submit to the backend/API.** Record the actual request/task ID and show progress. Respect asynchronous response lifecycle.
6. **Retrieve the result.** Poll/fetch the result using the correct identifier; distinguish “accepted” from “finished successfully.”
7. **Reconcile.** Match each returned job/stop/vehicle back to input IDs. Expose unassigned jobs and reasons; check that every input job is accounted for.
8. **Visualize.** Decode real route geometry when present; map ordered stops, route legs, status and assignments consistently.
9. **Review/edit.** Let users inspect and make permitted changes. A manual change should trigger the appropriate server/API calculation if updated optimization output is claimed.
10. **Dispatch/export/measure.** Produce a manifest or output sheet only when the use case requires it. Provide route-level and overall metrics only from verified result fields.
11. **Handle change.** Add/delete/update events must result in either a supported re-optimization flow or a clear manual re-run; show the affected plan version and whether the previous plan remains active.

### 7.3 Re-optimization is a lifecycle, not a toast

For an event such as adding or cancelling an order, the application needs enough state to identify the previous solution/task, the changed set, the active plan, and the constraints that remain fixed. A toast stating “re-optimizing” is not evidence that the API call succeeded. When the optimization product supports re-optimization for that case:

- Keep the prior successful plan until the update succeeds, unless the business explicitly requires immediate invalidation.
- Track the changed entity and old/new solution identifiers.
- Show `pending`, `succeeded`, `failed`, or equivalent clearly; do not report success merely because a request was sent.
- Display affected routes and unassigned jobs after the new result is received.
- Offer a retry or full optimization fallback only if it's valid for that API/workflow, and disclose that this is a fallback.
- Define behavior for cancellation after pickup, newly infeasible time windows, unavailable driver and changes arriving while another optimization is in flight.

App 1 is the clearest source of a cancellation/re-optimization requirement but does not fully establish that its final flow was reliable. App 3's manually reordered stops likewise need to become a real updated plan, not just a changed list order.

### 7.4 Result-comparison workflow

For App 9-like comparison tools, require independent source identifiers and optionally API keys per side; validate each result separately before comparing. Normalize compatible units (for example, meters to kilometres, seconds to hours/minutes) while retaining the original values in detail views. Compare only like-for-like objectives, problem size, constraints, vehicle profiles and time scope. Label differences as observed, not causal. If a field is missing or semantically different between result versions, suppress that comparison rather than substituting zero.

---

## 8. Data entities and relationship model

Treat this as a conceptual vocabulary rather than an assumed universal database schema. Use only entities the customer workflow needs. The same real-world concept may have different names in source data; maintain a clear mapping layer.

### 8.1 Core entities

| Entity | Typical attributes | Relationships and rules |
|---|---|---|
| Customer/site/outlet | Stable ID, name, address, latitude, longitude, service notes, active status | May have repeated visits or multiple jobs; don't use array index as durable identity. |
| Job/stop | Stable source ID, type, location reference, service duration, time windows, demand/quantity, priority, status, required skills | Can be an independent visit or part of a pickup-delivery/sequence relation. |
| Shipment/order | Order ID, pickup location, delivery location, quantities, promised interval, customer/restaurant IDs, lifecycle status | Preserve pickup-before-delivery and any quantity/capacity semantics. |
| Vehicle | ID, profile/type, capacities and units, start/end, depot, shift window, skills, availability, multi-run setting | A single vehicle must not be accidentally assigned conflicting simultaneous routes. |
| Driver/agent/technician | ID, skills, shift, schedule, service territory, availability, assigned vehicle if applicable | Person and vehicle are related but not always the same entity. |
| Depot/charger/scale | Stable ID, location, opening windows, service time, capabilities | Special node type often affects route feasibility, not just map icon styling. |
| Route/manifest | Plan ID/version, resource ID, ordered stop list, distance, duration, cost, start/end, status, geometry | Each step should resolve to a known input entity and location index. |
| Optimization task/result | Task/request ID, submit time, state, objective, result payload/version, error | Request accepted, completed and result retrievable are different states. |
| Cluster | Cluster ID, member source IDs, center/index, geometry, cost/quantity if returned | Preserve original IDs so downstream scheduling does not lose jobs. |
| Incident/weather feature | ID, type, category, severity/level, validity, geometry, raw fields | Retain raw response values where semantic interpretation is uncertain. |
| Appointment/slot | Resource ID, start/end, location, duration, preferences, viability state | Must include drive-time feasibility where travel between appointments matters. |
| Configuration/credential reference | Settings, objective, region, units, API key reference | Keep secrets out of URLs, exported plans, screenshots, logs and shared links. |

### 8.2 IDs, locations and type safety

- Keep **input IDs**, **database IDs**, **array indices**, **API location indices**, and **returned task IDs** distinct. Never assume that `location_index = job.id - 1` unless that mapping is intentionally built and validated.
- App 10 contains a reported string-versus-integer ID bug between clustering/CSV data and database jobs. Preserve original IDs and maintain an explicit normalized join key.
- Use one internal coordinate type with named fields such as `{ latitude, longitude }`; convert only at API/SDK boundaries. See Section 9 for the serialization and GeoJSON distinction.
- Validate finite coordinate values, valid ranges, missing addresses/coordinates and duplicate location records before constructing API inputs.
- Time windows must declare timezone and units. Unix seconds vs milliseconds or local clock strings are common failure sources. Avoid “tomorrow” ambiguity without a chosen operating timezone.
- Distances and durations must carry units; do not assume a number is metres/kilometres or seconds/minutes without using the current source schema.
- Model statuses with an explicit enum/state transition rather than free-text status. Avoid treating `cancelled`, `deleted`, `completed`, `unassigned` and `pending` as synonyms.

### 8.3 Input/output reconciliation contract

Before showing a plan as ready, validate:

1. Every requested input entity has a known ID and supported location.
2. Every location index referenced by a job, shipment, vehicle or depot resolves to a valid coordinate in the exact location list supplied for that request.
3. Pickup-delivery and ordering dependencies remain connected to the same business entities after serialization.
4. Returned stop and resource IDs can be mapped back to the input records without ambiguous coercion.
5. Every job is assigned or appears in an unassigned/exception list; a zero-unassigned claim must be computed from result data.
6. Distance, duration, cost, load, route geometry and status fields are only rendered when present and valid.
7. Output manifest/sheet contains request ID, run timestamp, input scope and result state to support diagnosis and reproduction.

### 8.4 Data model for synthetic demos

Generate samples with consistent relational integrity, not merely random strings. For a food-delivery scenario, sample orders need known restaurant pickup, customer delivery, unique order ID, plausible service duration, future schedule window, amount/currency if displayed, required capacity and a stable driver list. For weekly beats, outlet IDs must persist across clusters and schedule assignments. For a truck/scale scenario, equipment type and job compatibility must be explicit. Do not use realistic-looking fake API metrics as if they came from a live response.

---

## 9. Geospatial and routing implementation requirements

### 9.1 Coordinate conventions: never mix representations

The export contains a concrete debugging cycle around the Route Optimization `locations.location` payload. In App 1, the user supplied an example whose string coordinates were latitude,longitude and asked to use that order after an out-of-service-area error. The lesson is not “latitude/longitude everywhere”; the lesson is to treat every boundary contract explicitly.

- Internally use named coordinate fields, e.g. `latitude` and `longitude`, so order is unambiguous.
- At each API boundary, follow that API's current official schema and sample exactly. The integrated NextBillion.ai API reference remains authoritative for the actual RO payload.
- At the mapping boundary, GeoJSON coordinates are conventionally `[longitude, latitude]`. Do not pass a `lat,lng` string directly into GeoJSON without conversion.
- For a route map, use the coordinate/geometry contract from the returned source, not a remembered convention from another API.
- Validate regional service coverage and geographic scope. A syntactically valid coordinate can still be outside a product's supported service area.
- Add tests with a known point and verify its rendered location visually; coordinate swaps can create plausible but geographically wrong routes.

Never repeat the App 1 claim that the string format is universally fixed in one order. Use the API schema current at build time.

### 9.2 Map-library and SDK boundaries

The source repeatedly exposes integration bugs caused by treating wrappers as interchangeable:

- App 4's custom map wrapper did not expose methods expected by code written for a raw MapLibre-style object (`fitBounds`, `addSource`); Leaflet has different lifecycle and marker behavior, including the need for a valid canvas/container for some marker integrations.
- App 14 ran into SDK method-access problems and needed access to the underlying map object for source/layer operations.
- App 22 needed to replace a Leaflet/OSM map with NextBillion Maps SDK tiles, while retaining decoded route polylines.
- Other apps used Leaflet/OSM for their own requirements, so this export does not establish one universal mapping library for all demos.

**Implementation rule:** isolate the mapping library behind a clear adapter. Determine whether a method belongs to the React wrapper, an exposed raw map, a layer/source abstraction or the library itself. Don't assume similarly named APIs are drop-in replacements. Verify map construction, style loaded state, event registration, layer/source ownership and teardown in the chosen SDK version.

### 9.3 Route geometry vs stop sequence

An ordered list of stops and a road-following route geometry are distinct objects. A straight line between stops is not route geometry. In App 22 the user explicitly noticed that a direct polyline was misleading and asked for decoding the returned polyline. App 1 also asks to decode an encoded polyline from the result viewer.

- Prefer returned route geometry when the API provides it.
- Follow the geometry encoding and precision defined by the relevant response/schema. App 22's transcript identifies precision 5 for the specific encoded-polyline decoder it implemented; don't apply this precision to every encoded geometry source without checking.
- For multiple driver routes or leg types, preserve each route's identity and order. Use clearly differentiated colors and a compact legend.
- Distinguish a missing-geometry response from a failed API call and from a deliberately estimated/straight-line fallback.
- If geometry is unavailable, label the fallback explicitly; don't visually imply road adherence.
- On map click/edit, update the actual origin, destination or stop state and recalculate dependent outputs as intended.

### 9.4 Presenting multiple routes without clutter

App 1 explicitly requests that all driver manifest routes be visible without clutter. Use stable driver colors, lightweight route strokes, ordered stop numbers or compact markers, selective highlighting on hover/selection, and a legend with route/driver identity. Provide a per-driver visibility toggle or focused-detail mode if needed. Use a sensible initial extent that contains active routes; do not indiscriminately refit on every click.

Map camera behavior is part of user intent:

- Initial route/incident fetch may fit the extent once.
- Closing a popup, switching a layer, toggling Route 1/Route 2, changing a row or opening details should not reset zoom/pan unless the user asks to fit again.
- App 4's intended workflow explicitly asks for a bbox-based zoom after fetch and no reset when dismissing popups or selecting incidents.
- App 12's route-leg visibility toggles should preserve the camera.
- Coordinate `fitBounds`, selected feature changes and React state effects so rerenders do not cause unexpected camera jumps.

### 9.5 POI discovery and incident maps

For route/POI tools (Apps 14–16), use Directions to establish route geometry and the supported Search Along Route operation for route-based discovery. Preserve category and detour settings, display the selected route and keep map markers in sync with result list rows. Use geocoding/autocomplete where specified; App 15's autocomplete starts after at least three characters. If geolocation/reverse geocoding is offered, request browser permission appropriately and allow manual entry when denied.

For App 4, represent incidents, road geometry and weather polygons as distinct layers with independently controlled visibility. Preserve returned incident/weather properties, validity and region. Do not turn a numeric `level` into an unsupported label or infer `type` from `category`. The exported conversation contains an unresolved weather type display bug where all rows were labelled “Precip”; include a regression test for snow and any other available types before considering the issue fixed.

### 9.6 Basemap choice and attribution

Apps 14 and 22 explicitly request NextBillion.ai map tiles/Maps SDK, while some other projects used Leaflet with OpenStreetMap tiles. These are per-project choices, not a global recommendation. If a client demo specifically requires NextBillion Maps SDK/tiles, don't silently substitute OSM or another provider. If a project intentionally uses OSM, comply with the provider's tile usage and attribution terms. Validate required tile authentication, style loading, CORS/proxy policy, map attribution and license obligations for whichever source is chosen.

### 9.7 Geocoding, user location and address quality

App 6 is a dedicated address locator with search, autocomplete, saved bookmarks and history. Apps 15–16 use address geocoding and draggable/map-click endpoints. App 19 uses a postcode-first slot checker and was explicitly changed from postcodes.io to NextBillion postcode/geocoding capability.

- Keep raw entered text, normalized address, resolved coordinates and result status separate.
- Do not treat a geocoder candidate as certain if multiple matches or a low-confidence result exists; show the selection before committing.
- Avoid excessive keystroke requests; honor any specified minimum query length and debounce inputs.
- If a marker is dragged, update the location and any address display consistently.
- Store bookmark/history intentionally, not as accidental hidden persistence when the user asked for in-memory data.
- A reverse-geocoded address is a label for coordinates, not guaranteed proof that a delivery entrance/access point is correct.


---

## 10. Integration lifecycle, errors and observability

### 10.1 API key lifecycle and trust boundaries

Several demos ask the user to paste a NextBillion.ai key in Settings or at first use (Apps 1, 4, 6, 12, 14–16, 20); App 9 specifically requests a separate key per comparison partition. App 7 is an offline JSON report and should not require an API key. App 21's Pointr credentials are for a separate service.

- Explain whether a key is kept in memory, browser storage or backend configuration. Don't persist a secret by default without an explicit need and secure handling design.
- Do not expose keys in URL query parameters, share links, generated reports, public browser console output, server errors, screenshots, or shared spreadsheets.
- Prefer a backend proxy or secure server-side secret store where architecture supports it. If browser-side usage is required by the SDK, restrict key scope and document exposure/risk.
- Redact credentials from logs. Log key presence/reference metadata, not the secret value.
- Distinguish invalid credentials (401/403/auth errors), service-area/coverage errors, bad payload errors, request throttling and transient network failures.
- Never reuse or hardcode a credential from a prior conversation or example. Use a placeholder or secure configuration mechanism.

### 10.2 Asynchronous API operation

Multiple source apps call APIs that return a task/request ID and require a second request to fetch the result. This occurs in RO/result flows (Apps 1, 5, 9, 17 and other RO integrations) and in clustering (App 5). The first response commonly means accepted/submitted, not “the plan is ready.”

A robust lifecycle should:

1. Validate the proposed input locally.
2. Submit the request with a correlation ID, excluding secrets from logs.
3. Parse and save the returned task/request ID and initial state.
4. Poll or fetch results according to the current official API contract, with bounded retry/backoff and timeout policy.
5. Represent queued/running/waiting states, completion and failure accurately.
6. On completion, validate the response shape before rendering.
7. Preserve the request ID, elapsed time, result status and redacted error details for debugging.
8. Provide a retry/new-plan action when supported and avoid concurrent duplicate submissions from a double click.

App 17 demonstrates the distinction: the user found that the output sheet stayed empty, asked whether the result GET request was issued, and the reported fix explicitly fetched the result before populating `Route Plan`. App 5's actual clustering result shape also differed from the app's expected shape (`job_ids`, `center_location_index`, `geometry` rather than presumed `jobs`/`centroid`).

### 10.3 Build payload transparency into API demos

App 1 shows that browser console logging was not sufficient for the user to inspect a failed RO payload. They explicitly asked to show the exact JSON in the UI or download it. For developer-facing tools, include a **Preview payload** / **Download redacted JSON** facility that shows the actual request body prepared for the operation before or after submission.

A useful payload/debug view should include:

- Operation and API version/base URL without credentials.
- Actual request body serialized, including entities, location indexes and constraints.
- The input-to-location-index mapping used by the builder.
- Count of jobs, shipments, vehicles, locations and any other relevant collections.
- Request/task ID after submission, elapsed time and exact response status.
- Redacted error response and relevant validation messages.
- A warning when the viewer shows a generated preview rather than the exact submitted body.

Keep the body schema sourced from the already-integrated current API docs. This knowledge base should not become a second, potentially stale RO schema catalog.

### 10.4 Error-handling pattern

| Failure class | User-visible behavior | Diagnostic behavior | Do not do |
|---|---|---|---|
| Missing required field / invalid payload | Name the field/category and show corrective action | Show redacted request preview and response body/status | Show only “failed to optimize” or silently retry unchanged payload. |
| Invalid/expired key | Ask user to verify or replace credential | Record authentication failure and provider status without key | Leak the key or mislabel as a mapping failure. |
| Location outside service area | Identify offending input/location if response provides it | Show coordinate and index mapping with source IDs | Randomly flip coordinate order without checking API contract. |
| Async task pending/timeout | Show still-running/timeout state and retry/query action | Preserve task ID and poll history | Treat request acceptance as success or create unlimited duplicate tasks. |
| Result shape changed/missing field | Explain which expected data was unavailable | Capture a redacted sample and handle schema defensively | Use `.map()` on undefined, convert missing metrics to zero, or crash entire view. |
| Map style/source/layer failure | Show map error, retry/fallback only if appropriate | Track style loaded state and failed tile/source | Claim API optimization failed merely because map failed. |
| No route/POI results | Show explicit no-results state | Preserve successful empty response separately from API error | Invent fake POIs or straight-line route to imply success. |
| Infeasible plan/unassigned jobs | Show unassigned list and reasons if returned | Validate resource constraints and mapping | Claim 100% assignment when jobs are missing. |
| File import/parser problem | Identify line/field/type, retain upload context | Report validation errors safely | Generate NaN metrics or crash on missing fields. |

### 10.5 React/event-handler and map-state bugs seen in source

- **Stale closure:** App 16's map click handler captured the original `pickMode` and repeatedly placed the same endpoint. A `useRef`-backed handler that reads current state fixed consecutive origin/destination selection. For map events registered once, keep callbacks current and remove listeners when appropriate.
- **Library API mismatch:** Apps 4 and 14 call methods that exist on the raw map but not the wrapper object. Make the adapter boundary explicit.
- **Rendering absent fields:** App 4's `.toLowerCase()` on an undefined field and App 7's undefined `.map()` / NaN errors demonstrate why response parsing needs guards and validated normalized models.
- **Visual state drift:** App 4's markers/polylines drifted relative to the base map after zoom. Ensure overlays share the map's projection/container and lifecycle.
- **CSS imports:** App 1 had a Leaflet CSS import issue. Verify styles are imported at the right application entry point and markers/icons load after bundle changes.
- **Authentication side effects:** App 14 reported a 401 caused by an API key variable being truncated to its first letter. Verify exact value handling end-to-end, and never log its full content.

### 10.6 Observability without secret leakage

For production-quality demos and integrations, log operation name, source record count, request/task ID, duration, status, provider error code, and version of the payload builder. Avoid logging addresses/precise user location unless needed and authorized, and redact any secrets. Maintain an operation history that lets the user reproduce what input scope produced a manifest or report. If the app stores state only in memory (Apps 10/22 and others), explicitly state what refresh/restart loses.

---

## 11. Security and data governance

### 11.1 Credentials and sensitive implementation details

The merged export contains secret-like material from real debugging conversations, including at least one NextBillion.ai API key and Pointr token/password/client-secret context. This knowledge base intentionally does not repeat those values. If a source credential is still active, rotate/revoke it rather than assuming that obscuring it in this document is sufficient.

- Use placeholders in documentation and sample config (`NEXTBILLION_API_KEY=...`), never real secrets.
- Do not include credentials in URLs, route-sharing parameters, query logs, JSON manifests, Postman examples committed to source control, or public client logs.
- App 3 discusses storing an API key alongside a shareable plan. A share URL should reference a server-stored plan through an opaque, access-controlled ID and must not contain the key. Avoid allowing anyone with the link to retrieve sensitive plan/customer data unless the sharing policy explicitly intends that.
- Do not persist API keys in public Google Sheet cells. Use script properties or the host platform's protected secret mechanism where supported.
- Never put actual tokens, passwords, access keys or license/client secrets into this knowledge base or newly generated examples.

### 11.2 Customer/operational data

Location histories, customer addresses, route manifests, incident observations and driver schedules can be sensitive. Apply least-privilege access and retention appropriate to the customer's deployment. Demo fixtures should use synthetic information unless the user explicitly supplies data for that demo. Do not imply compliance with privacy or transport regulations merely because route optimization completed.

### 11.3 Link-sharing and statelessness

- If the demo supports shareable plans, decide whether the URL encodes public non-sensitive parameters or references private persisted data. Do not embed a credential or confidential customer list in query params.
- Apps 10 and 22 explicitly asked for in-memory/no persistent data. Do not quietly introduce a database or imply history survives reload; explain the loss-on-restart behavior.
- If a third-party integration (App 21) uses a separate identity model, isolate its secrets and configuration from NextBillion integrations. A working REST token should not be assumed to authorize a WebSDK bundle.

### 11.4 Browser API key exposure

An API key entered in a client-side web app may be inspectable by users or browser extensions. For demos, explain the tradeoff and restrict the key's permitted use where possible. Where a provider's SDK requires client-side authentication, follow that provider's documented public-key model rather than inventing a server proxy that the SDK cannot use. For secret-bearing REST calls, prefer a server-mediated request when feasible. Never call browser storage “secure” without an appropriate security basis.

---

## 12. UI/UX conventions and explicit preferences

There is no single established visual design system across all 22 apps. The source shows deliberately different experiences: a warm food-delivery storefront/admin app, an editorial/neutral route studio, a purple planning tab, dark result analysis and address utilities, an incident dashboard and map-heavy POI tools. Preserve explicit user preference by project; do not use the first example as a universal style guide.

### 12.1 Explicit preferences from the conversations

| App | Explicit user preference / constraint | What to preserve |
|---|---|---|
| 1 Delivery Navigator | No authentication; API key input in Settings; prioritize RO; future orders generated automatically; select all orders/drivers; route map not cluttered; expose actual JSON payload because console logs were not visible | Make batch planning and live order placement distinct; show manifests, notifications, result/error and a downloadable redacted request. |
| 2 Design Boost | React web app (not React Native); modernized design while preserving existing imperative logic/DOM contracts | Improve presentation without casually rewriting the old routing/controller behavior. |
| 3 Drag Drop Routes | Drag/drop route sequence, road route visualization, share/export plan | A drag action should update/recompute the actual plan; don't store plaintext API keys in shareable plan records. |
| 4 Incident Tracker | Columbus bbox; choose two corners by map clicks; zoom to incident area once; stable zoom after popups/selection/toggle; weather layer collapsible; display type/category/level; regions `europe`, `nam`, `usa`, `australia`, `latam` | Do not relabel weather values; regression-test snow and other types, given known unresolved display issue. |
| 5 Location Grouper | Use clustering result via second GET request; map clusters and center locations from real response | Respect actual result contract and original job IDs. |
| 6 Nb Address Locator | API key input; autocomplete; bookmarks/history; dark default but improve light-theme contrast | Debounce; minimum query length specified in app; accessible contrast. |
| 7 Nbai Route Report | Offline JSON upload; PDF/report; robust missing fields | No API-key requirement for offline processing; make invalid/missing fields visible. |
| 8 Nextb Techguide | Create usable Postman collection from OpenAPI | Importability matters as much as generating a file; user reported “request not found”. |
| 9 Nextbillion Compare | Dark; separate API key and request ID for each side; vehicles used, overall distance/duration, route-level metrics and graphs | Remove utilization percentage and route-wise distance graph as explicitly requested. |
| 10 Nextbillion Field | Weekly clustering/route planning using notebook concept | Normalize string/int IDs; keep app scoped to clustering and weekly plan unless user requests tracking/geofencing. |
| 12 Nextbillion Routes | EV battery/range panel and individual route-leg visibility controls; hide credentials | Visibility toggles must not reset camera; show first and second leg separately. |
| 13 Pre Post Weigh Scale | Need process with scale before and after delivery; two compatible full-load jobs; same shift but separate delivery/pickup loops | Don't assume two jobs work because one-job test passed. |
| 14 Route Discovery | API key requested from user; map-focused with sidebar controls + cards; all POI categories; allow manual origin/destination; strictly NextBillion APIs | Do not silently substitute basemap/provider/API or add unrelated AI services. |
| 15 Route Poi Finder | Editable route, no fabricated POIs, manual/map endpoint interaction | Empty/error state must be explicit; route can be adjusted. |
| 16 Route Search App | Use NextBillion capability, map click/address selection, geolocation and shareable URLs; no key leakage | Fix stale map-click mode; preserve selected trip on reload. |
| 17 Routemaster | Optimize data already in Google Sheets; output route-plan sheet and viewer URL | Keep source tabs intact, fetch results after submit, report unassigned reasons. |
| 18 Scale Wrap Logistics | Maintain scale sequence while using multi-run vehicles | This is unresolved; no false “fixed” claim. |
| 19 Schedule Finder | Use source workbook logic; standalone app; Gap Finder/Viability Check/Preference Filter; postcode API + Directions; editable Master Config | Distinguish estimated vs road travel; workbook formulas are missing from text export. |
| 20 Smart Router | Only one vehicle, max 10 stops; choose distance/time objective; simple route planner | Keep scope limited; actual RO payload error remains unresolved. |
| 21 Webdoc Helper | Use a specific Pointr instance/site, test config with Postman, provide downloadable HTML | Diagnose REST credentials and WebSDK/license configuration separately. |
| 22 Weekly Beats | 900 outlet/7 agent fixture; clustering + weekly plan; NextBillion map tiles, decoded route polyline; no login/persistence | Use in-memory state as requested; label fixture-specific results. |

### 12.2 Layout and information hierarchy

- For dispatch/optimization, a map paired with a table/sidebar is often useful, but the source does not require it for every app. Show critical controls and plan state without forcing the map to carry all operational details.
- Separate configuration (key, objective, constraints, region) from results (metrics, routes, assignment) unless a small tool benefits from one focused workspace.
- In dense maps, highlight one route/incident and de-emphasize others; provide a clear legend and visibility switches.
- Make selection state visible for chosen orders/drivers and show selection counts. The App 1 requirement asks for Select All/Deselect All for both orders and drivers.
- Show empty/loading/success/error/infeasible states with the correct meaning. A map canvas existing does not prove a route request succeeded.
- For comparisons, label Scenario A/B and expose separate source IDs and keys; graphs should be interpretable independently of the visual theme.
- For reports, expose upload validation and provide downloadable output, not just a rendered preview.

### 12.3 Interaction and accessibility requirements

- Every visible button should execute a real action and show pending/success/failure. Avoid decorative controls that imply functionality.
- Use keyboard-reachable selects, drawers, slider controls, tables, map actions where feasible; App 16 had keyboard focus delegation for a slider thumb in the backlog.
- Use confirmation for destructive actions, especially deleting/cancelling a planned order. Explain whether the plan updates automatically, must be manually reoptimized, or remains stale.
- Show what filters apply and provide a clear reset; don't silently reset camera/filters during a refresh.
- For map controls, retain accessible non-map ways to select/edit origin, destination, stops and POIs.
- Format distance, duration, money and time windows using units; make time zone context explicit when scheduling future orders or shift windows.

### 12.4 Typography, color and component decisions are per-app

Source-specific visual choices include Space Grotesk + Inter, Shadcn/UI and orange/red gradients in App 1; a cream/black editorial Route Studio with Fraunces, Inter Tight and JetBrains Mono in App 2; purple accents for route planning in App 1; and a dark theme in App 9. These are documented as choices in examples, not an enterprise-wide brand spec. Match NextBillion.ai brand assets only when a specific request/product page warrants it; don't force every demo to the same color palette.

---

## 13. Business rules, edge cases and validation checklist

Use the following as a validation framework and apply only the rules pertinent to the actual workflow. Constraint labels below are generic recommendations unless explicitly tagged as source-specific.

### 13.1 Before sending optimization/clustering requests

- Validate every location is present, finite and in the required format; check service area/coverage where relevant.
- Build a deterministic mapping from source records to indices and retain it for response decoding.
- Require non-empty resource/job sets where the flow needs them, while giving a meaningful empty-state for legitimate zero-result cases.
- Validate unique IDs and avoid unsafe type coercion between strings and integers.
- Validate that task time windows, vehicle windows and service durations are sensible and use the documented units/time basis.
- Check that each shipment pickup and delivery has a valid location and that all precedence constraints remain consistent.
- Check capacity demand and units match vehicle capacity definitions; don't compare unlike dimensions.
- Validate any skills/vehicle/job compatibility relationships and identify likely unassigned cases before submission.
- For a process that requires depot/scale/charger stops, validate the intended order and any resource/depot-run assumptions independently from the map view.
- Do not inject extra constraints just because they are common in the industry. Present a proposed constraint to the user if the source doesn't establish it.

### 13.2 After receiving a result

- Confirm the API result is complete and parses against the current response contract.
- Reconcile routes and tasks to the original IDs; detect duplicate assignment, missing assignments and impossible route references.
- Display unassigned jobs separately with returned reasons when available.
- Compute headline totals from result data or label them as derived; use correct unit conversions.
- Don't show “live”/“real-time” unless location or status updates are genuinely live. Sample data, fixed fixture times and estimates must be labelled.
- Separate the optimized stop sequence from the actual route line/road geometry.
- Include a plan timestamp/task ID so reruns and comparisons are reproducible.
- If the map rendering fails while API data succeeded, preserve the data view and report a map-specific failure, not an optimization failure.

### 13.3 Orders/jobs change after planning

- Decide whether edit is permitted under the active workflow (pending vs picked-up/completed/cancelled).
- Associate the change with the exact plan version/task ID; prevent double updates on duplicate click/retry.
- If re-optimization is invoked, await and validate its new result before swapping active manifest.
- If unsupported/infeasible, keep the last good plan visible and mark it stale or requiring operator action according to policy.
- Report downstream driver notifications only when the appropriate backend/event has actually succeeded. A toast can report “change saved; plan needs re-optimization” but must not say “routes updated” until confirmed.
- For concurrent order additions/cancellations, prevent an older result from overwriting a newer result.

### 13.4 Clustering and weekly scheduling

- Preserve member IDs and map center/index to correct coordinates, not presumed centroid property names.
- Ensure the downstream job exists for each clustered member and that it is not lost when converting CSV/notebook output to database/API input.
- Distinguish geographic cluster from final driver assignment and stop order.
- Validate agent availability across weekdays and recurring schedules; avoid scheduling same resource into overlapping windows.
- Explain the metric behind “balanced” workload, distance and cluster count.

### 13.5 Route and POI search

- Require a valid origin/destination before Directions submission.
- Distinguish “couldn't geocode,” “route unavailable,” “search returned no POIs,” and “request failed.”
- On route change, invalidate or refresh POIs computed against the old route, and keep list/map results synchronized.
- Only claim road distance/ETA when returned by the road-routing service. Label Haversine as estimate.
- Treat a geolocation denied/error as a normal alternative path to manual entry.
- Share only intended non-secret origin/destination/category/detour data; avoid embedding internal IDs or credentials.

### 13.6 Report and comparison tools

- Parse optional/missing fields defensively and validate data types before charts.
- Do not turn null, undefined, NaN or an absent metric into 0 unless that mapping is domain-correct and disclosed.
- Normalize units consistently and label derived formulas.
- Don't compare runs with materially different scope/objective/resources as if they were equivalent; show differences in metadata.
- Generate PDFs that preserve labels/units, avoid clipped charts and include source request ID and generation time.
- Make the report reproducible from uploaded files and state whether any metric is input-derived or result-derived.

### 13.7 Map interaction and UI validation

- Check selected marker, list row and details panel refer to the same entity after selection, drag, filter and refresh.
- Keep `fitBounds` intentional; preserve camera for ordinary toggle/popup interactions.
- Check geometry/markers after zooming and resizing; avoid independent pixel offsets that drift with projection.
- Verify map tiles/style are loaded before adding dependent layers, and clean up listeners on component teardown.
- Test at least one empty, one successful and one error result state.

### 13.8 Regression tests derived from source failures

1. RO request has correctly structured locations, valid references and a redacted preview. Use current docs, not this document, for exact schema.
2. Submitting optimization yields task ID → result fetch/poll → parsed solution; acceptance alone is not success.
3. Coordinate-order test: known input point appears at the correct physical location on the map and is serialized per each boundary's contract.
4. App 1: select-all/deselect-all for orders and drivers; manifest generation; cancellation/new order; map of multiple routes without clutter; updated plan or truthful failure status.
5. App 4: bbox selection, stable zoom, markers aligned after zoom, weather layers independently toggled, snow not mislabeled as precip, optional fields do not crash.
6. App 5: actual clustering output member IDs/center/geometry map to original source IDs; GET result path called.
7. App 7: malformed JSON, absent fields and empty arrays never produce NaN or crash; PDF download works.
8. App 9: independent A/B inputs; conversions correct; expressly removed metrics/graph absent.
9. App 10/22: string/int job IDs map correctly; every fixture job accounted for; decoded geometry uses correct precision from schema.
10. App 12: each route leg displays correctly; toggles do not reset map camera; no false range feasibility claims.
11. Apps 14–16: autocomplete threshold, two distinct map clicks, drag endpoint, geolocation failure, no-result POI state, share URL reload; no fake POIs.
12. App 17: Google Sheet input is validated; result GET completes; route-plan output includes unassigned reasons and actual request ID.
13. Apps 13/18: one-job success is not treated as proof of multi-job scale/depot process; test multiple runs and equipment compatibility.
14. App 19: compare against the source workbook once available; road-vs-estimate label correct.
15. App 20: successful map render is not accepted as successful RO integration; missing-location error triggers useful payload preview.
16. App 21: valid REST token and a valid WebSDK license/client config are tested separately.
17. Security test: no actual key/token/password appears in logs, downloadable JSON, URL, report, generated sample or this knowledge base.

---

## 14. Industry-specific application recipes

Each recipe is an initial product shape to adapt, not a finished specification. Ask only for missing, decision-critical data; otherwise use transparent synthetic fixtures and make assumptions visible. Exact API selection and parameter behavior belongs to the integrated official API reference.

### 14.1 Food delivery: scheduled multi-rider plan

**Use when:** the prospect wants a concrete demonstration of batch route optimization for next-day or scheduled food deliveries, with the ability to inspect driver manifests.

**Start from:** App 1 Delivery Navigator.

**Minimum demo scope:** admin route-planning workspace; sample restaurant pickups and customer drop-offs; scheduled orders with stable IDs and realistic time windows; selectable drivers/riders; Select All/Deselect All; route optimization; assignment + per-driver manifest; route map with ordered stops; order cancellation/addition state and a supported re-optimization flow; exact redacted request/result diagnostics.

**Data and constraints:** pickup-delivery pairs, food readiness/service duration where known, delivery windows, rider availability, load/capacity if relevant, pickup-before-delivery, cancelled/active state. Do not add payment, customer checkout, geofence live tracking or authentication unless required.

**Demo proof points:** route geometry follows roads; each order appears once or is marked unassigned; route plan can be retrieved; new plan appears only after successful processing; UI explains which values are synthetic and which came from the API. Don't claim live tracking if the app only displays a static route.

### 14.2 Field-service / weekly beat plan

**Use when:** a prospect has a fixed customer/site list and wants to divide recurring work among agents and optimize the visits.

**Start from:** App 10 Nextbillion Field and App 22 Weekly Beats. Add App 5's cluster-result handling if clustering is a separate async stage.

**Minimum demo scope:** outlet/job import or fixture; agents and weekday schedule; clustering; map showing cluster/agent ownership; job ID reconciliation; weekly route generation; per-agent/day route manifests; unassigned job review; export.

**Inputs to clarify:** must-visit cadence, agent availability, territory boundaries, visit service time, priority, skill/equipment needs, whether every outlet is visited weekly or cadence varies, and whether each agent/day has a fixed starting location. If not provided, show the assumptions.

**Do not conflate:** clustering = grouping; RO = assignment/sequencing; Directions = a road route for a leg; map = visualization. A cluster result is not automatically a route or an agent schedule.

### 14.3 Freight/trucking with depots and load constraints

**Use when:** dispatchers choose among vehicles for multiple delivery/pickup tasks and require a realistic manifest.

**Start from:** App 17 Routemaster for spreadsheet ingestion and output; App 13 / 18 only if weighing/equipment/multi-run stops matter.

**Minimum demo scope:** vehicle/job input validation; depot and shift data; capacity units; job windows/durations; explicit pickup-delivery or sequencing relations; RO submit + result fetch; route/step output; unassigned reasons; export to a spreadsheet or manifest.

**Ask before modeling:** vehicle profiles/dimensions, whether cargo quantities share a capacity dimension, pickup/drop-off dependencies, depot return rules, whether each job resets load, driver hours, equipment constraints and whether routes can span multiple days. Do not assume standard passenger car routing for heavy vehicles.

**Special caution:** the two App 13/18 scale cases have no confirmed final solution in the transcript. Surface them as a support/debug task, build a minimal reproduction, and test current optimizer behavior before proposing a production workflow.

### 14.4 EV route plan with charging

**Use when:** a driver or planner needs to know whether jobs are reachable in two or more legs separated by charging.

**Start from:** App 12 Nextbillion Routes.

**Minimum demo scope:** start point, vehicle range/battery assumptions, candidate charger, initial jobs, road route to charger, explicit charge-duration assumption, RO for remaining jobs, separate leg summaries, map visibility toggles that preserve camera position.

**Ask before implementing:** whether state of charge and charging time come from actual telematics or manual assumptions; acceptable battery reserve; compatible charger connectors/power; charging availability; whether the route optimizer can natively represent the energy model. If the API doesn't optimize energy directly in the required way, don't describe a two-stage heuristic as a globally optimal EV plan.

### 14.5 Route exploration and POI search

**Use when:** a user chooses an origin/destination then inspects services, restaurants or other POIs near the route.

**Start from:** App 14 Route Discovery and Apps 15–16 Route POI/Search.

**Minimum demo scope:** API key input/protected proxy; geocoding/autocomplete; route generation; distance/ETA; POI categories and optional detour width; road-following line; linked map/list markers; clear no-results/error state; editable endpoints; copy/share trip URL without credentials.

**Quality checks:** NextBillion basemap is used when explicitly required; encoded route geometry is decoded using the relevant spec; POIs are tied to the actual route search, not generated from mock data; moving a marker invalidates stale POI results and refreshes as appropriate.

### 14.6 Traffic incident + weather map

**Use when:** operations staff inspect incidents and contextual weather over a region or chosen bounding box.

**Start from:** App 4 Incident Tracker.

**Minimum demo scope:** region or bbox input; incident query; road/incident geometry; popup details; filters; weather layer with separate visibility; legend; last-updated state; map camera persistence. Keep traffic incident semantics separate from weather alert semantics.

**Quality checks:** verify supported `region` values in current docs, preserve raw type/category/level, and test multiple weather types. Do not infer a route closure or automatic re-route from display-only incident data without an implemented link to route logic.

### 14.7 Result comparison and PDF reporting

**Use when:** the user has two optimizer results or exported JSON and wants to understand cost, resource count, distance/duration and route-level differences.

**Start from:** App 9 Compare and App 7 Route Report.

**Minimum demo scope:** import/request IDs; validation; per-run metadata; summary table; route-by-route breakdown; charts for fields actually present; unit conversions; PDF/CSV download; raw values for drill-down; missing-field handling.

**Explicit constraints:** App 9 user rejected a utilization percentage and the route-wise distance graph. Don't re-add these for a similar fork without asking. A PDF pipeline needs to handle empty and malformed inputs without emitting NaN.

### 14.8 Slot feasibility / schedule insertion

**Use when:** the business books field appointments and needs to find open gaps that have feasible drive times.

**Start from:** App 19 Schedule Finder.

**Minimum demo scope:** existing appointments, appointment durations, working hours, gap finder, postcode/address geocoding, Directions road-time check, customer preference filters, editable master config and a clear `Road`/`Est` indicator.

**Source gap:** actual workbook formulas/cell values are not complete in the merged text export. Retrieve and compare the source workbook before claiming a faithful translation. Do not silently replace business formula rules with generic scheduling heuristics.

### 14.9 API payload/debug console

**Use when:** the user needs to build/test requests or troubleshoot an integration, rather than deliver an operational end-user product.

**Start from:** App 11 Nextbillion RO API and debugging requirements in App 1; use App 8 only for collection generation.

**Minimum demo scope:** capability and operation selector; typed input model; validation messages; actual redacted request preview/download; submit and display task ID; retrieve result; render provider error fields; copy/download response; credentials managed separately.

**Quality checks:** current official docs remain the schema authority; don't embed a stale large OpenAPI spec in this domain file; avoid real secrets in examples; a generated Postman collection must be imported and tested, not just written successfully.

---

## 15. Common failures and durable lessons from the export

These lessons are directly useful to an agent generating an application from a brief. The originating application number is included so that the detailed context can be retrieved rather than relying on this condensed list.

| Failure or risk | Evidence | Durable lesson | Status/qualification |
|---|---|---|---|
| RO request rejected: missing `locations.location` | App 1; App 20; App 17 initially required correction | Validate the final serialized request and index mapping against current official RO docs; offer a payload preview | A recurring integration issue, not proof the API itself is broken. App 20 remained unresolved in the export. |
| Coordinate-order/service-area confusion | App 1 received 403 for location at index 0 | Separate internal coordinate names from API string formatting and GeoJSON; confirm with a known point and current schema | User's sample and current RO docs use `latitude,longitude` strings for that RO boundary; don't apply to every other API. |
| Payload looked right but still failed | App 1 iterative payload debugging | Log exact redacted request body, response status/body and source-index map; a plausible object shape is not enough | App 1's completed-state summaries came after multiple failure loops. |
| Browser console logs were unavailable to the user | App 1 user explicitly asked to see JSON | Build a UI payload inspector/download for demo/debug tools | Download should be the actual body used or labelled preview, and must redact secrets. |
| Assistant summary claims completion despite previous failures | Apps 1, 4, 5, 8, 20, 21 and others | Reconcile statements against the complete timeline; later errors and unresolved reports lower confidence | This knowledge base labels evidence instead of repeating success claims as fact. |
| Result endpoint/polling omitted | Apps 5, 17 and RO workflows | Track task ID and explicitly fetch result; request acceptance isn't completion | App 17 user spotted an empty sheet until the GET result path was considered. |
| Response schema assumed from memory | App 5 expected `jobs`/`centroid`, received `job_ids`, `center_location_index`, geometry | Normalize the real response shape and map back to source IDs; keep raw response sample in tests | Verify actual fields in current API response docs. |
| String/integer ID mismatch | App 10 | Introduce typed mapping keys and maintain original IDs end-to-end | Don't silently convert or use array positions as IDs. |
| UI says real-time when data is static | Apps 1, 4, 12 and other demos | Label static fixtures, estimates, polling and live telemetry differently | “Real-time” must refer to an actual live/update mechanism. |
| Map draws straight lines instead of returned roads | Apps 1, 22, 14–16 | Decode/use route geometry with correct format/precision; a stop sequence isn't the road geometry | When no geometry exists, label any fallback. |
| Map wrapper methods don't match raw SDK | Apps 4 and 14 | Confirm library and wrapper API surface; adapt intentionally | Don't reuse MapLibre methods blindly on Leaflet or wrapper object. |
| Map markers or route lines drift when zooming | App 4 | Use correct map overlay/projection/lifecycle; test zoom/resize | Visual correctness is a geospatial requirement, not decoration. |
| Map camera resets when state changes | Apps 4 and 12 | Separate initial fit operation from ordinary state toggles/popups | Make re-fit an explicit interaction when possible. |
| Event handler captures stale state | App 16 `pickMode` closure | Use up-to-date refs/functional state and remove/re-register map handlers correctly | Consecutive click-to-origin/destination test required. |
| API key is truncated or incorrectly passed | App 14 | Validate key plumbing end-to-end, without logging full secret | 401 was attributed to one-character/truncated value in that conversation. |
| Secret appears in shared link or stored plan | App 3, plus credential-bearing source exports | Share opaque plan reference, never API credential; rotate exposed secrets if active | Security remediation is independent from app correctness. |
| Weather layer labels wrong type | App 4 `Precip` displayed for snow | Preserve and test raw type semantics; use typed display mapping | Unresolved in transcript. |
| Undefined field causes runtime exception | Apps 4 and 7 | Parse/validate response before rendering; normalize optional fields | Must test missing, null, empty and unexpected values. |
| Missing metrics turn into NaN or zero | App 7 and App 9 | Unit-normalize and guard data; missing differs from zero | Keep a missing indicator when no source value exists. |
| Result graph included after user rejected it | App 9 | Preserve negative UI requirements as first-class constraints | No utilization percentage and no route-wise distance graph for this use case. |
| Postman collection built but “request not found” later | App 8 | Validate import/runtime compatibility, request names and variables after generation | Final outcome not proven for all requests in transcript. |
| Multi-job scale process worked for one job but not two | Apps 13 and 18 | Expand test matrix when resource/sequence/run semantics change | The proposed workarounds were not validated; don't present them as solved. |
| Third-party REST auth works but SDK doesn't initialize | App 21 | Validate each authentication/license layer independently | Pointr is not NextBillion; secrets omitted. |
| Sample route/POI appears after API returned empty/error | App 15 | Empty state is a legitimate successful state; don't fabricate data | Explicit user request says no mock POIs in no-result/error case. |
| Source workbook formula logic unavailable | App 19 | Recover the original workbook and test equivalence | Do not claim exact reproduction from high-level notes. |
| In-memory demo state lost on restart | Apps 10/22 and other ephemeral prototypes | State data persistence boundary plainly, preserve explicit no-database requests | No persistence may be intentional, not a missing feature. |
| Duplicate tasks submitted during long async operation | Inferred from async patterns | Disable/restrict repeated submit and associate results with input snapshot | Recommendation to avoid duplicate cost and race conditions. |
| Re-optimization notification mistaken for plan success | App 1 requirement | Separate user event, API request, returned result and plan activation | Do not report routes updated until new result passes validation. |

### 15.1 Claims that must not be generalized

- A single demo's successful fixture doesn't prove production scale or all constraint combinations.
- An assistant-reported test pass is not a customer acceptance record, SLA or independent benchmark.
- A UI showing ETA does not mean ETA is live-traffic driven; App 19 explicitly had estimated vs road-based values.
- A successful Directions call does not prove RO constraints are feasible or that every job is assigned.
- A successful cluster operation does not complete downstream agent assignment.
- A rendered map does not prove that the provider API was called or that response geometry is correct.
- Public marketing claims/case studies do not validate a feature in a particular customer's region, account or API version.
- The source examples don't prove that every named product/API is included in every account plan. Verify entitlement/key access when relevant.

---

## 16. How an AI application builder should apply this knowledge

### 16.1 Pre-generation checklist

Before generating code, answer these questions from the new customer prompt and known source evidence:

1. **Business identity:** Which industry and workflow is actually present? Is this a named customer or only an anonymized demo? Do not invent the customer's name.
2. **Primary outcome:** Reduce distance/time/cost, assign work, expose a route, locate POIs, report a result, or troubleshoot an API? Identify one core goal.
3. **Planning mode:** Live/on-demand, scheduled single-day, multi-day/week, offline report, interactive route exploration or API integration test?
4. **Actors:** Admin, dispatcher, driver, agent, customer, analyst or developer? Build only the role boundaries needed for the actual workflow.
5. **Resources and jobs:** Identify entities/IDs, location sources, constraints, output and downstream action.
6. **Relevant prior apps:** Use the cross-reference below. Load their detailed profiles and applicable failure lessons, not only names.
7. **NextBillion capability:** Select based on the workflow, using current official documentation. This KB is not a substitute for the API spec already in the knowledge pipeline.
8. **Map requirement:** Determine required provider, SDK, layers, route geometry, controls and camera behavior. Don't default blindly to OSM/Leaflet or another provider.
9. **Data origin:** Real customer data, uploaded files, sample fixture, notebook data or API result? Mark synthetic/estimated values.
10. **Persistence/share:** Session only, in-memory, database or shareable plan? Don't introduce storage that violates the prompt.
11. **Security:** How will credentials be supplied/stored, and where must they be excluded?
12. **Acceptance tests:** Define one happy path, one malformed input, one async error, one no-result/infeasible case and any source-specific regression.

### 16.2 Requirements traceability

For each generated feature, maintain a short internal mapping:

`user requirement → relevant evidence/profile → data/constraint → screen/action → API capability → validation/test → visible status`

A feature should not be declared complete merely because there is a component for it. It is complete only when the action is connected to real state/API behavior, error handling exists and its acceptance criteria have been exercised.

### 16.3 Evidence-aware generation protocol

- Use **[SOURCE]** for requirements stated in a conversation; cite the corresponding App number/source range in implementation notes when helpful.
- Use **[NB-OFFICIAL]** for capability families or demos verified in official sources; verify exact parameters and behavior in current docs.
- Use **[EXT-OFFICIAL]** only for jurisdiction-specific requirements and label geography/scope.
- Keep **[INFERENCE]** and **[RECOMMENDATION]** visible as generated assumptions; do not make them look customer-approved.
- For **[UNVERIFIED]** cases, produce a test/validation plan rather than a confident implementation assertion.
- For **[SOURCE-GAP]**, ask for or retrieve the workbook/notebook/output if exact business fidelity matters. If continuing without it, disclose assumptions in-app or documentation.

### 16.4 Default deliverable checklist for an application

When the request implies a functional application (not just a concept or API helper), aim to deliver:

- Working inputs with validation and helpful defaults.
- Clear configuration for key/region/objective where required.
- Functional primary workflow and explicit loading/empty/success/error states.
- Honest sample-data indication and data provenance.
- Real result retrieval after any asynchronous task submission.
- Correct map/route geometry and accessible non-map detail view where geospatial.
- Stable IDs and result-to-input reconciliation.
- Download/export/share behavior if requested, with safe credential handling.
- A small set of automated or repeatable manual tests covering source-specific risks.
- A concise README explaining assumptions, data flow, environment setup, limitations and troubleshooting.

Don't add authentication, a database, AI-generated recommendations, generic order checkout, tracking, geofencing, or extra integrations simply because they're common features. The source contains both explicit requests for no authentication/stateless behavior and strict limitations to NextBillion APIs only.

---

## 17. Glossary

- **Agent / technician / field professional:** A person performing assigned visits or jobs; not necessarily synonymous with the vehicle carrying them.
- **API capability family:** A high-level API/service class (for example, routing, RO, clustering, geocoding, map tiles) without restating its endpoint schema.
- **Beat plan:** A recurring or time-bucketed set of customer/outlet visits assigned to a field agent, common in field sales.
- **Bounding box (bbox):** A rectangular geographic area defined by its corners or extent; App 4 uses two map clicks to set one.
- **Cluster:** A geographic/grouping result that associates multiple source jobs or sites. It is not by itself an optimized route.
- **Depot:** A route start/end or intermediate operational facility; its rules can affect loads and trips.
- **Directions:** A routing service returning road-route information for a pair or sequence of locations; use current API docs for exact input/output.
- **Distance matrix (DM):** Travel distance/time estimates across many origin/destination pairs; not interchangeable with a complete multi-vehicle assignment.
- **ETA:** Estimated time of arrival. Clarify whether it is static, calculated from current road conditions, or updated from live tracking.
- **Geocoding:** Resolving an address/place to coordinates; **reverse geocoding** resolves coordinates to an address label.
- **Geometry / polyline:** A spatial representation of the road path; an encoded polyline must be decoded according to the originating format and precision.
- **Hard constraint:** A condition that the solution must obey to be feasible, as defined by the actual optimization formulation.
- **Soft constraint / objective:** A preference/penalty or optimization goal that can trade off against other costs. Exact semantics should come from current RO docs.
- **Job / stop:** A visit/task, usually tied to one location, service time and possibly time window, skills or demand.
- **Manifest:** Human-readable route assignment with driver/resource, ordered stop sequence, timing/metrics and operational details.
- **Optimization task/request ID:** Identifier returned when a route-optimization operation is submitted; must be used to retrieve the solution, according to the current API.
- **Re-optimization:** Updating an existing plan with changes to tasks/vehicles and retrieving the new solution; not equivalent to re-sorting stops locally.
- **Route plan / solution:** The optimizer's assignment/sequencing result, distinct from the input, map-rendered line or dispatched/live route.
- **Service duration:** Time spent at a stop beyond travel time, for example loading, pickup handoff, inspection or appointment duration.
- **Shipment:** A pickup/delivery relationship that must preserve the relationship between its two endpoints where required.
- **Time window:** Allowed interval associated with a task/vehicle/route event. Preserve timezone and unit semantics.
- **Unassigned job:** A task not assigned in a result. Show the result-provided reason when available; do not hide it.
- **Vehicle/resource capacity:** A constrained quantity (weight, volume, items or another configured dimension). Units and dimensions must match.
- **VRP:** Vehicle Routing Problem, the general optimization class involving vehicles, tasks, locations and applicable constraints.
- **OpenViking L0/L1/L2:** Official OpenViking context layers: L0 abstract, L1 overview, L2 detailed/original content. Exact lengths/settings can change and should be taken from current docs.

---

## 18. External references and research limitations

Research checked for this document on **16 October 2026**. This section gives traceable URLs and scope. Public pages can change; the consuming agent should verify live behavior and version-specific requirements before implementation. Links below were inspected at the page/description level. Where marked as not inspected, the limitation is explicit.

### 18.1 OpenViking official documentation

- [OpenViking documentation home](https://docs.openviking.ai/) — primary official reference.
- [Context layers (L0/L1/L2)](https://docs.openviking.ai/en/concepts/03-context-layers) — abstracts and overviews guide retrieval before loading original detail; current guide shows L0 abstract budget ~256 characters and L1 overview budget ~4,000 characters by default. They are described as directory-level semantic sidecars, not necessarily one sidecar per ordinary file.
- [Retrieval mechanism](https://docs.openviking.ai/en/concepts/07-retrieval) — retrieval orientation and the distinction between search/find approaches.
- [Extraction](https://docs.openviking.ai/en/concepts/06-extraction) — ingestion/extraction processing and task completion considerations.
- [Memory API](https://docs.openviking.ai/en/api/16-memory) — official memory capability reference.
- [Skills API](https://docs.openviking.ai/en/api/04-skills) — official skill capability reference.
- [Data organization](https://docs.openviking.ai/en/guides/23-data-organize) — resource organization guidance.
- [Context compilation overview](https://docs.openviking.ai/en/context-compilation/01-overview) — context loading/compilation overview.

**Practical consequence for this file:** preserve application-level summaries and source provenance while keeping detailed profiles and cross-cutting implementation details in one navigable document. Let OpenViking derive its own resource structures, indexes, sidecars, memories and skills. No internal path/schema assumptions are made here.

### 18.2 NextBillion.ai official sources

- [Main site](https://nextbillion.ai/) — general platform positioning.
- [Product demos](https://nextbillion.ai/product-demos) — describes demonstrations including Traffic Incidents, Clustering, Field Service Routing, Truck Route Planning, NEMT, Waste Collection, Fuel Delivery, and Food & Beverage Logistics.
- [Use cases](https://nextbillion.ai/use-cases) — public descriptions include dispatch planning, load optimization, LTL, multi-day/week routes, waste and hours-of-service-related workflows.
- [Solutions](https://nextbillion.ai/solutions) — broader solution taxonomy.
- [Platform overview](https://nextbillion.ai/platform-overview) — platform and product overview.
- [Field service routing/optimization](https://nextbillion.ai/solutions/field-services) — public description of scheduling, skill/territory allocation, re-optimization, live alerts/ETAs and related capabilities.
- [Field service API examples](https://docs.nextbillion.ai/solutions/field-services) — API-focused examples such as scheduling, skills, territory and last-minute changes.
- [On-demand delivery solution guide](https://docs.nextbillion.ai/solutions/on-demand-delivery) — delivery-related patterns; check current page before relying on specific capabilities.
- [Route Optimization API](https://docs.nextbillion.ai/optimization/route-optimization-api) — source of truth for RO request submission, result retrieval, re-optimization and exact payload contract. It describes POST submission, a returned task ID, GET result retrieval, and a separate re-optimization operation returning a new reference ID.
- [Basic route optimization tutorial](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials/basic-route-optimization) — example flow including request, locations and result retrieval.
- [Skill-based field task allocation tutorial](https://docs.nextbillion.ai/solutions/field-services/allocate-tasks-based-on-skills) — concrete example of how skills affect job assignment and may cause tasks to remain unassigned.
- [Case studies index](https://nextbillion.ai/case-studies) — vendor-published customer/solution stories.
- [Fuel delivery / hazmat optimization](https://nextbillion.ai/case-studies/north-america-fuel-delivery-hazmat-optimization) — vendor-published case study.
- [Truck-safe distance matrix and fleet telematics](https://nextbillion.ai/case-studies/truck-safe-distance-matrix-api-fleet-telematics) — vendor-published case study.
- [Global logistics/truck routing](https://nextbillion.ai/case-studies/global-logistics-truck-routing-60-countries) — vendor-published case study.
- [Truck route/fleet management](https://nextbillion.ai/case-studies/truck-route-fleet-management) — vendor-published case study.
- [Time-critical logistics and transportation](https://nextbillion.ai/case-studies/nextbillionai-route-optimization-for-time-critical-logistics-transportation) — vendor-published case study.
- [Route optimization for transport management](https://nextbillion.ai/case-studies/route-optimization-for-transport-management) — vendor-published case study.

**Source boundary:** API docs are deliberately referenced, not copied. The user reports that the official API documentation from `docs.nextbillion.ai` is already integrated in the downstream OpenViking knowledge pipeline.

### 18.3 External regulatory/authoritative sources

- [US FDA: FSMA final rule on sanitary transportation of human and animal food](https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-sanitary-transportation-human-and-animal-food) — scope-dependent requirements for sanitation and transportation of covered food products.
- [US PHMSA: Hazardous Materials Regulations](https://www.phmsa.dot.gov/standards-rulemaking/hazmat/hazardous-materials-regulations) — applicable US hazmat regulations; use current jurisdiction-specific guidance, not generic routing assumptions.
- [US CMS: Non-Emergency Medical Transportation](https://www.cms.gov/medicare/medicaid-coordination/states/non-emergency-medical-transportation) — Medicaid NEMT policy/context.
- [Medicaid: Assurance of transportation](https://www.medicaid.gov/medicaid/benefits/assurance-of-transportation) — transportation assurance context and links.
- [FMCSA: Summary of Hours of Service Regulations](https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations) — US commercial driver HOS information. Verify current rules, exemptions, vehicle/operator type and applicability before building compliance claims.

The regulations cited are geographically specific. This document is not legal advice and does not establish the rule set for an unnamed customer or jurisdiction.

### 18.4 Research and source limitations

1. **Full application export analyzed by numbered heading/source range:** the full Markdown source is approximately 31,379 lines/756 KB and includes 22 numbered application conversations. Profiles preserve unique requested behaviors, significant intermediate corrections, known failure modes and final reported state.
2. **The app source is conversation text, not all generated code or live instances.** It may refer to external workbooks, notebook assets, screenshots, JSON responses and files not fully embedded in the merged text. Where exact artifacts are absent, the knowledge base marks a source gap rather than pretending to inspect them.
3. **Videos/interactive demo contents:** official product demo pages and descriptions were inspected. Some direct video/interactive playback paths were inaccessible to the available browsing path; this document does not claim that every demo video was watched or every interactive demo was exhaustively clicked.
4. **API behavior can change.** The RO guide was checked directly and confirms an asynchronous POST → task ID → GET result flow and a separate re-optimization operation. Exact schema, limits, units, coordinate formats, response shapes and service availability must be reconfirmed in current official docs for each implementation.
5. **Public case studies are vendor-published.** Their claims may be useful for identifying domains and problem patterns, but they are not independent performance verification and are not attached to any named customer unless the source says so.
6. **Undisclosed customer identity:** conversation exports use generic descriptions and application names. This knowledge base does not infer actual customer companies from an industry or URL.
7. **Contradictions are retained:** App 1 has conflicting sample-order counts/claims, coordinate/request debugging and later errors; App 4's weather type problem remains unresolved; Apps 13/18 do not establish a verified multi-job scale workaround; App 20's RO request remained broken; App 21 does not prove a working Pointr WebSDK. App 8's import error and App 19's workbook-fidelity gap also remain open.
8. **Security redaction:** raw tokens, passwords, keys and client secrets from conversation content are intentionally omitted. Rotate/revoke any real secret that may still be active.

---

## 19. Coverage and completeness audit

### 19.1 Application coverage ledger

| # | Source application | Source lines in merged export | Domain and knowledge preserved | Status recorded conservatively |
|---:|---|---:|---|---|
| 1 | Delivery Navigator | 1–3,770 | Food delivery, consumer/admin flow, batch scheduling, multi-driver RO, manifests, re-optimization, Select All, map, payload debugging, service-area/coordinate errors | Multiple later errors and conflicting summary counts; do not assume production-ready. |
| 2 | Design Boost | 3,771–4,716 | React web redesign, preserve existing imperative behavior/DOM IDs, design system and map layout | Code/compile reported; retain controller/DOM constraints. |
| 3 | Drag Drop Routes | 4,717–5,714 | Async RO, drag/drop route resequence, share/export, plan state and key-risk | Behavior described; plaintext secret storage risk noted. |
| 4 | Incident Tracker | 5,715–8,870 | Incident bbox/filter/road geometry, weather polygons, SDK wrappers, map state | Weather types mislabelled as Precip in later report; unresolved. |
| 5 | Location Grouper | 8,871–12,205 | Clustering async lifecycle, output shape, cluster/map IDs and geometry | Response mismatch identified, but final user report still says result fetch failed. |
| 6 | Nb Address Locator | 12,206–13,083 | Geocoding, autocomplete, history/bookmarks, map and theme accessibility | Use stated query threshold and maintain contrast. |
| 7 | Nbai Route Report | 13,084–14,453 | Offline RO JSON report, PDF/charts, missing-field/NaN handling | Reported working after defensive parsing; not an API caller. |
| 8 | Nextb Techguide | 14,454–16,182 | OpenAPI to Postman, collection/environment generation | User later reported “request not found”; importability remains uncertain. |
| 9 | Nextbillion Compare | 16,183–17,474 | A/B request/result inputs, route/overall metrics, charts, unit conversion, negative preferences | Preserve removed utilization % and route distance graph. |
| 10 | Nextbillion Field | 17,475–18,295 | Field-service cluster + weekly route plan, sample CSV, string/integer ID bug | Use ID normalization; distinguish clustering from RO assignment. |
| 11 | Nextbillion RO API | 18,296–19,873 | RO payload-building/developer helper | Use integrated/current API docs for schema; no duplicate schema catalog here. |
| 12 | Nextbillion Routes | 19,874–21,466 | EV charger/route legs, distance matrix/directions/RO, battery panel | Assistant summary reports 11/11 tests; treat as reported status. |
| 13 | Pre Post Weigh Scale | 21,467–22,559 | Pre/customer/post scale dependencies, full-load jobs and compatible equipment | One job reported working; two-job behavior not verified. |
| 14 | Route Discovery | 22,560–24,361 | NextBillion vector map, Directions, ETA/distance, Search Along Route POIs | Earlier completion summary conflicts with final user report that map tiles are missing; unresolved. |
| 15 | Route Poi Finder | 24,362–26,468 | Editable endpoints, geocoding/autocomplete, drag markers, POI no-result/error | Explicitly no fake POIs on empty/error result. |
| 16 | Route Search App | 26,469–27,469 | Route+POI search, click/address selection, geolocation, share URL | Stale event closure corrected; alternatives/clustering/mobile/a11y backlog remains. |
| 17 | Routemaster | 27,470–28,206 | Google Sheets input/output, route optimization, task result retrieval | User reported working after GET result/data-output fix. |
| 18 | Scale Wrap Logistics | 28,207–28,442 | Scale stop order with vehicle multi-runs/depot run settings | Several ideas proposed; no confirmed solution. |
| 19 | Schedule Finder | 28,443–29,462 | Excel-driven slot viability, postcode geocode, Directions, estimated-vs-road times | Excel details not fully in text export; exact parity unverified. |
| 20 | Smart Router | 29,463–30,081 | Single-vehicle max-10-stop route planner, objective choice, map | RO call still failed with missing locations field in the export. |
| 21 | Webdoc Helper | 30,082–30,688 | Pointr indoor-map REST/WebSDK/license troubleshooting | Separate provider; no proven final SDK success; secrets redacted. |
| 22 | Weekly Beats | 30,689–31,378 | Clustering + weekly beat plan, NextBillion map tiles, decoded geometry, no persistence | Reported fixture run: 62 assigned jobs / zero unassigned; not a scale guarantee. |

### 19.2 Coverage of requested knowledge categories

- **Application identity and business problem:** individual profile sections 5.1–5.22, plus cross-reference/archetypes.
- **Customer profile and roles:** captured when explicitly present; unnamed prospect demos remain unnamed rather than inferred.
- **Workflows and decisions:** detailed in app profiles, Sections 6, 7 and 14.
- **Operations and business constraints:** capacity, timing, availability, sequence, depots, scale/equipment, battery/charging, regional/weather inputs, address validity and appointment feasibility where the source supports it.
- **UI/UX features and negative constraints:** Section 12 plus individual profiles and application matrix.
- **Data entities, identifiers, units and relationships:** Section 8.
- **Geospatial rendering and interaction:** Section 9.
- **Implementation decisions and recurring bugs:** Sections 9–10 and 15.
- **Security and keys:** Section 11; exposed secrets excluded.
- **Verified official product/domain enrichment:** Sections 6 and 18; API docs referenced but not duplicated.
- **OpenViking organization:** Section 2 and official refs in Section 18.
- **Validation, acceptance tests and unresolved issues:** Sections 13, 15, 18.4 and this ledger.

### 19.3 Final operating rule

Use this document to understand **what business problem and application pattern** to build, and use the already-integrated current NextBillion.ai API documentation to determine **the exact request/response contract and product behavior**. Use customer-provided data and explicit requirements to override generic patterns. If evidence is incomplete, make the assumption visible, test it, and do not turn an inference or a prior assistant's optimistic summary into a fact.

---

## 20. Generator pitfall rules (durable, must always apply)

> **Evidence note:** Consolidated from recurring observed failures in generated NextBillion.ai applications (milk-run 404 diagnosis, pinpoint/fleet-pilot "Worker failed to load" failures, fragmented ApiKeyDialog implementations across route-rush, route-rush-2, milk-run, fleet-pilot, pinpoint, groundwork family). These are generator-enforcement rules, not app-specific history.

### 20.1 Server handler placement (Nitro/Vite apps)

Client-facing API handlers MUST live in `server/api/` (e.g. `server/api/geocode.get.ts` serves `GET /api/geocode`). The standalone `nitro` package mounts `server/routes/` at the root path — a handler at `server/routes/api/geocode.get.ts` is reachable only at `/routes/api/geocode`, so the client's `/api/geocode` call returns 404 even though the handler exists and is "correctly defined". Never place the same handler in both trees. After adding, moving, or editing handler files, restart the app's dev server — Nitro does not reliably rescan handlers on hot reload.

### 20.2 MapLibre worker configuration (Vite apps)

Any Vite app that imports `maplibre-gl` MUST set `optimizeDeps: { exclude: ["maplibre-gl"] }` in `vite.config.ts`. Without the exclusion, Vite pre-bundles maplibre-gl, rewrites its map worker URL, and the map fails at runtime with `Error: Worker failed to load. Check that the worker URL is correct.` (observed in generated apps pinpoint and fleet-pilot, 2026-10-17). Known-good recipe in generated apps: rush-route-x, groundwork-4, groundwork-mac, groundwork-web-2.

### 20.3 API key collection UX (every keyed app)

Every app that calls a keyed NextBillion API must ship a working key-entry UI at first use:

- Masked input: `type="password"`, `autoComplete="off"`, `spellCheck={false}` — the key is a secret; never render it in plain text.
- Explicit Save button plus Enter-to-save, with visible saved confirmation and real error surfacing (401 bad key / 403 region disabled / 429 quota).
- Persistence: `localStorage` under a single app-constant storage key, wrapped in try/catch with graceful private-mode fallback; the key must survive page reloads. Keeping the key only in React state is a defect.
- Transport: client sends `x-nb-key` header per request to the app's own server handler; the handler forwards as `key` query param upstream. Never put the key in URLs, share links, exports, logs, or client-side direct calls. Never display the saved key back in plain text.
- Observed defect pattern: only 2 of 12 generated apps masked the input; 4 carried near-identical hand-rolled `ApiKeyDialog.tsx` copies with different storage-key names; the newest app kept the key in React state only with no persistence.

### 20.4 Upstream endpoint paths must come from the API docs, never guessed

Generated handlers MUST proxy to real NextBillion endpoints taken from the API reference (the distilled docs / knowledge base), not invented plausible-looking paths. Observed in pinpoint (2026-10-17): handlers were generated with `nbSearchHandler("/places")` and `nbSearchHandler("/reverse/geocode")` — neither endpoint exists. Actual endpoints: nearby/POI free-text search is `GET /discover?q=&at={lat},{lng}`; reverse geocoding is `GET /revgeocode?at={lat},{lng}` (param is `at`, NOT `center` or `lng,lat` order). Before shipping a handler, verify the upstream path and parameter names against the distilled docs — a wrong path produces a misleading 404 that looks like a missing handler but is an upstream rejection.

### 20.5 Relative import depth changes when relocating Nitro handlers

When moving handlers between `server/routes/**` → `server/api/**`, the relative import depth changes: from `server/api/`, `server/lib/nb.ts` is `../lib/nb`; from `server/routes/api/`, it is `../../lib/nb`; from `server/routes/api/nb-proxy/`, `../../lib/nb`. After copying/relocating handler files, FIX EVERY RELATIVE IMPORT for the new depth — do not copy imports verbatim. A stale `../../lib/nb` from the old location fails at runtime with `Failed to load url ../../lib/nb ... in ./server/api/nb-map-style.get.ts` → 500 "Map failed to load", even though the file looks fine in the tree. Prefer copying with sed depth-correction or use the `@/` alias if configured for server files.

### 20.6 MapLibre style sprite/glyphs must be absolute when style is proxied

MapLibre validates `sprite` and `glyphs` in the style spec as absolute URLs. If the app serves the style through its own proxy with rewritten relative URLs (`/api/nb-proxy/...`), constructing the map with `style: "/api/nb-map-style"` fails with `Invalid sprite URL "...", must be absolute`. Fix pattern in the client: `fetch` the style JSON, absolutize `sprite` (handle both string and `{plain, hidpi}` forms) and `glyphs` against `window.location.origin`, then pass the style object to the map constructor. Absolutize with string concat (`window.location.origin + url`), NOT `new URL(url, origin).href` — `new URL` percent-encodes the `{fontstack}`/`{range}` template braces in the glyphs URL and MapLibre then fails with `"glyphs" url must include a "{fontstack}" token` (observed in pinpoint, 2026-10-17). Note: a bare `.../sprite` 404 is expected — MapLibre appends `.json`/`.png`/`@2x` itself; verify `sprite.json`/`sprite.png` return 200, not the bare path (observed in pinpoint, 2026-10-17).
