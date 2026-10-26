# NextBillion.ai support-ticket lessons — real customer issues, diagnoses, resolutions

Source: 102 internal support tickets (ClickUp-style ids such as `86d3...` / `14ym...`) joined to 242 thread messages. Many tickets carry only a title and a status. Only the ones with a diagnosis or resolution in the thread are quoted in detail. Where the thread gives no root cause, this document says so and does not guess. Customer names appear only where the ticket names them.

Ticket status mix: most are `complete`. A few are `awaiting confirmation`, `to do`, `dev review`, `on hold` or `discard`. Closure usually means "customer confirmed", "fix deployed to prod", or "customer went silent after the fix was deployed".


Structure: for every theme, first the analyst notes (cross-ticket diagnosis and builder rules), then the FULL per-ticket records with the customer description and every thread message kept verbatim (only HTML tags/whitespace normalised). Ticket thread bodies were thin in the source; empty threads are marked as such.


---

## 1. Truck routing (the largest cluster)

### 1.1 `truck_size` order is height, width, length (in cm) — the most common self-inflicted truck bug
- Ticket `14ym01uk3t7` ("wrong length limit on I-17 exit 242, Black Canyon City AZ"). The diagnosis was a parameter-order issue, not a map-data fault.
  - `truck_size` is **height, width, length in centimetres**.
  - The customer sent `500,200,200`, which is a 5.00 m-high truck. A third value of `671,259,290` was read as 6.71 m high.
  - There is a real low-clearance structure at I-17 Exit 242 (Rock Springs interchange). TomTom has a 4.80 m (189 in) height limit there, matching the ADOT bridge record. Anything over 4.80 m high is therefore correctly kept off I-17.
  - For a truck 2.90 m high, 2.59 m wide and 6.71 m long, the correct value is `truck_size=290,259,671`. With it the route runs straight down I-17.
  - Do not "fix" this by overriding the restriction in Road Editor. It reflects a physical clearance.
- Builder rule: always name the order in code comments (`height,width,length`, cm). Never pass length-first. Build a typed helper that takes `{heightCm, widthCm, lengthCm}` and serialises in that order.
- Related example in the chats: right-turn-only waste routing used `"truck_size": "350,250,900"` (3.5 m high, 2.5 m wide, 9 m long), which is consistent with that order.

### 1.2 Units: `unit=imperial` changes how `truck_weight` is read
- Ticket `86d2dupq3` ("Incorrect truck safe route", Geotab). The customer sent `truck_weight=10433` with `unit=imperial` and the route did not avoid a 10-ton / 20,000 lb restriction (Skyline Drive).
  - Engineering suspicion: under `unit=imperial` the weight is interpreted in **lb**, so 10,433 lb is about 4.7 t and does not trigger a 10 t restriction.
  - Suggested test: either (A) `unit=metric` with `truck_weight=10433` kg, or (B) keep imperial and send about 23,000 lb.
  - The ticket was closed after a **map-data rebuild** ("need recreate NAM map data", then "deployed"). So both a units pitfall and a data gap were in play.
- Builder rule: make units explicit and consistent for every truck attribute (weight, size). Do not mix `unit=imperial` with kg values. Convert once at the boundary.

### 1.3 `mode=truck` without truck dimensions
- Ticket `86d2ezm4p` ("6w route takes towards low bridge-USA"). Engineering asked what `mode=truck` does when `truck_height` and the other dimensions are not given. The thread does not record a definitive answer.
- Ticket `14ym01uh3dk` ("Route distance diagnosing") shows flexible directions debug URLs whose `truckInfo` with `width/length/height/weight` all `0`, which means "no constraint".
- Builder rule: a truck request with no dimensions gives **no low-bridge protection**. Always send height, width, length and weight for a real vehicle. Do not rely on `mode=truck` alone.

### 1.4 Low-clearance / restriction data comes from the map provider and is fixed by manual overrides plus map rebuilds
- `86d3zamyp` "Truck safe route ignores low-clearance bridge": data manually fixed and live in prod. Engineering notes each map rebuild plus testing takes **48+ hours and a few hundred dollars**, so fixes are batched into one build.
- `14ym01uk2hv` "Height Restrictions Regina": in the TomTom source only Winnipeg Street underpasses carry a 3.8 m limit. Albert Street, Ring Road and Lewvan Drive carry none.
  - Support can temporarily add limits manually and rebuild.
  - The restriction tiles shown in the app are served by TomTom's tile server via a gateway pass-through, so the **displayed tiles cannot be changed by NextBillion**. The proper fix is to report the missing limits to TomTom.
- `14ym01ujpzh` "[Geotab] World Trade Bridge, Laredo TX": fix shipped in a transformer change (`tomtom-transformer-v2 #44`), live in production, and verified in both directions for cars and trucks. A 36 t truck heading into downtown Laredo still got `NoRoute` because of a weight restriction near the destination. That was a separate, unrelated restriction.
- `86d43u7fb` "[Geotab] truck-safe directions final-approach behaviour in IN/OH": confirmed as a **map conversion issue**. The fix was released in the next version.
- `86d3tax60` "Truck Route Optimization — multiple jobs 'Location Unreachable'" (Ottawa and Vancouver regions only). Customer said the locations were routable until the day before. It was resolved by a **rollback** of the map/engine change. This shows a regression pattern: sudden regional "unreachable" results that previously worked point to a recent data or engine deploy, not the customer's payload.
- `86d2qb49f` "Construction / road updates" (Geotab): a detailed RCA with preventive measures was requested by the customer.
- `14ym01ug4y6` "[ZUS Coffee] Jalan DB 5: OSM exit restrictions differ from TomTom" and `86d0r1d4q` "Routing along a private road, Greenfield MA": private-road and exit-restriction mismatches. TomTom data updates **quarterly**, so some fixes wait for the next map ingest. Ops was also investigating how to infer more private roads.
- `86d3n3rz8` "Route taking through gated communities": raised as an OpenStreetMap handling question. The thread gives no systematic fix.
- Builder rule: treat "route goes somewhere it shouldn't" as data, not code. Capture request id, coordinates, truck parameters and the expected restriction, and report it. Do not build app-side workarounds that silently reroute.

### 1.5 `honor_restrictions` and failing instead of relaxing
- `14ym01ukmgk` "[Geotab] Investigate honor_restrictions 422 and expose blocking restriction details": the 422 is the engine refusing to return a route that would violate restrictions. The ask was to expose which restriction blocked the route.
- `86d3n2qd5` "Add honor_restrictions option to fail instead of returning relaxed restricted route":
  - `honor_restrictions` was supported **only by the Matrix and Directions APIs, not Navigation**.
  - Geotab's drivers use the Navigation endpoint, so support was added and an updated error message was deployed.
- `86d3fw9gx` "2 Trucks Routed Incorrectly" was closed in favour of the `honor_restrictions` ticket above.
- Builder rule: for trucks, decide per use case whether a relaxed route is acceptable. If not, set `honor_restrictions` and handle the 422 as "no legal route", surfacing the message rather than retrying with weaker parameters. Check that the endpoint you call actually supports the parameter.

### 1.6 `avoid` vs `exclude`, and `shortest` ignoring avoids
- `86d42ga4v` "Shortest Route with Avoid Preferences": `route_type=shortest` appeared to ignore driver avoid inputs (tolls, U-turns, sharp turns). Resolution: explained **avoid vs exclude** on a call. `avoid` is a soft preference. **`exclude` is the hard constraint** and is recommended if the requirement is mandatory.
- `86d3z6bj6` "Difference in route calculation using fastest and shortest route types": closed by recommending the customer **always use Flexible**.
- `86d1uea3v` "[route engine] cross_border affects route for truck shortest" and `86d12rbgq` "Directions Flexible ignoring `cross_border=false` with `route_type=shortest`": an engine-side fix was tested. No customer errors were seen afterwards.
- Chat evidence (right-turn-only waste routing) confirms the same pairing: `avoid:["left_turn"]` is soft; `exclude:["left_turn","uturn"]` is hard.
- Builder rule: hard business rules (no tolls, no left turns, no U-turns) belong in `exclude`, not `avoid`. Prefer the Flexible option for anything beyond basic routing.

### 1.7 Truck matrix reliability and sizing
- `86d43etgj` "Geotab UK DCM: fast truck distance matrix returns zero for routable OD pairs": ticket is `on hold` with no recorded resolution.
- `86d249k0w` "Distance matrix failing with 422 for EUR-4W": no diagnosis in the thread.
- `86d21ebvw` "Investigate large Distance Matrix request & truck mode errors (Australia region)": resolved by adding two new SKUs to the SGP cluster (`sea-avgspeed-4w` and `sea-avgspeed-6w`, initially 1 CPU / 4 GB). Large truck matrices can need more engine capacity, not just a different payload.
- `86d3y58kx` "Default Mode of Direction API": a request with no `mode` parameter was billed under the SKU `SEA-6W`. The root cause was a **deployment-script bug**, fixed. Specify `mode` explicitly so you never depend on a default SKU.

### 1.8 Truck ETA quality
- `14ym01ucbh4` "Truck ETA Optimization — validate test results": before/after ETAs were compared against measured drive times (per-segment CSV) and also against HERE and TomTom truck routing. Ground truth was trip data from Velocitor.
- `86d2unpxd` "Ryde technical evaluation — ETA accuracy & latency concerns impacting renewal": the customer later cancelled the contract. ETA accuracy and latency are commercial risks.
- Builder rule: if ETA matters, validate against real trip data and tell users which traffic and speed model applies.

### Full ticket records — 1. Truck routing

#### Ticket `14ym01uk3t7` — Re: Truck mode: wrong length limit on I-17 at exit 242 (Black Canyon City, AZ)
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] Hi this one is a parameter-order issue, not a length restriction. truck_size is height, width, length in centimetres, so 500,200,200 is a 5.00 m-high truck, and 671,259,290 is 6.71 m high. There is a real low-clearance structure at I-17 Exit 242 (Rock Springs interchange): TomTom has a 4.80 m (189 in) height limit there, which matches ADOT's record of the bridge, so anything above 4.80 m high is correctly kept off I-17. For Pluto's truck (2.90 m high, 2.59 m wide, 6.71 m long) the request should use truck_size=290,259,671; with that, the route goes straight along I-17 as expected. Nothing needs to be removed from the map, and the restriction should not be overridden in Road Editor since it reflects a physical clearance. Suggest customer to retry with the correct order~

#### Ticket `14ym01ukmgk` — [Geotab] Investigate honor_restrictions 422 and expose blocking restriction details
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] applink.larksuite.com/client/message/link/open?token=Ammzl91lgA7gas3wF%2BxATxI%3D

#### Ticket `14ym01uk2hv` — Height Restrictions Regina
- Status: to do
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] This looks like missing data in the map source: in our current TomTom map, only Winnipeg Street underpasses carry a height limit (3.8 m), while Albert Street, Ring Road and Lewvan Drive have none, which is why they are not flagged like the surrounding restrictions. We can temporarily add these limits manually and rebuild the map so routing avoids them, but the data itself comes from TomTom, and the restriction tiles shown in the app are served directly by TomTom's tile server (we only forward the requests through our gateway), so we cannot change what the tiles display. To fix this properly, the missing height limits need to be reported to TomTom~
  - [Reply (threaded) / RISHABH KEDIA] okay

#### Ticket `14ym01ujwvy` — Verify truck restrictions near Adoncour, Quebec
- Status: dev review
- Thread: none recorded (title and status only).

#### Ticket `14ym01ujpzh` — [Geotab] Re: Map Data correction - World Trade Bridge, Laredo TX
- Status: to do
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] The fix (tomtom-transformer-v2 #44) is live on production since 10/12 and verified in both directions for cars and trucks. A 36 t truck heading into downtown Laredo gets NoRoute because of a weight restriction near the destination, which is unrelated to the bridges and will be followed up separately.

#### Ticket `14ym01ug4y6` — [ZUS Coffee] Jalan DB 5: OSM exit restrictions differ from TomTom
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d43u7fb` — [route engine][Geotab] Investigate truck-safe directions final-approach behavior in IN/OH
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] @Zheng Shaolin @Shivam Yadav Please investigate this
  - [Reply (threaded) / Youzhi Yang] @RISHABH KEDIA For Case 1, we’ve confirmed that this is a map conversion issue. The fix is currently in progress and, if everything goes smoothly, will be included in the next version, which we expect to release this week.
  - [Reply (threaded) / RISHABH KEDIA] We have tested it and also informed customer and waiting for his response.
  - [Comment / RISHABH KEDIA] Closing this ticket as it is working as expected

#### Ticket `86d43etgj` — Geotab UK DCM: fast truck distance matrix returns zero for routable OD pairs
- Status: on hold
- Thread: none recorded (title and status only).

#### Ticket `86d3zamyp` — Truck safe route ignores low-clearance bridge
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Qiang Fu] The data has been manually fixed and is live in production. Please verify. @Vignesh Kumar S @Shivam Yadav
  - [Reply (threaded) / Qiang Fu] Hi @RISHABH KEDIA is this the only case to be added?
  - [Comment / RISHABH KEDIA] Screenshot 2026-08-17 at 10.18.55 AM.png
  - [Comment / Qiang Fu] As an urgent feature also needed a map rebuild the last week, and since each rebuild plus testing takes 48+ hours and a few hundred dollars, I merged the two into one build. It is now live in production.
  - [Reply (threaded) / RISHABH KEDIA] @Youzhi Yang running some internal tests to find the real cause of the issue.

#### Ticket `86d3tax60` — Truck Route Optimization - Multiple Jobs Marked as "Location Unreachable"
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] Additional customer input: The customer confirmed that these locations were all routable until yesterday and that the issue is currently limited to the Ottawa and Vancouver regions.
  - [Comment / Vignesh Kumar S] Thanks @Youzhi Yang Customer has confirmed that the issue is resolved on their side following the rollback

#### Ticket `86d3ree7c` — Truck route not snapped to origin/destination
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Hello Team closing this ticket as it is a prospect only not a customer. we will reopen if the issue comes back

#### Ticket `86d3n3rz8` — Route taking through Gated Communities
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Zheng Shaolin] @Xu rui Do we have a systematic approach for handling such communities in OpenStreetMap?

#### Ticket `86d3n2qd5` — Add honor_restrictions option to fail instead of returning relaxed restricted route
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Youzhi Yang] Hi @Vignesh Kumar S , currently honor_restrictions is supported only by the Matrix and Directions APIs, not by the Navigation API. If needed, we can add support for this parameter to the Navigation API as well.
  - [Comment / Vignesh Kumar S] Yes their truck drivers use Navigation app which uses Navigation endpoint
  - [Reply (threaded) / Youzhi Yang] Will update tomorrow
  - [Comment / Youzhi Yang] Hi @Shivam Yadav , the updated error message has now been deployed to production. If any further adjustments are needed, please create a new ticket. I’ll close this ticket for now.

#### Ticket `86d3fw9gx` — 2 Trucks Routed Incorrectly
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Vignesh Kumar S] Closing this ticket for now and we'll follow up on the new parameter addition separately. 86d3n2qd5

#### Ticket `86d2ezm4p` — 6w route takes towards low bridge-USA
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Vignesh Kumar S] @Qiang Fu Thanks. Could you please help clarify the purpose of using mode=truck when parameters like truck_height are not explicitly provided? Does it still apply any default truck-specific assumptions or restrictions?

#### Ticket `86d2dupq3` — Incorrect Truck Safe Route
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Xu rui] Quick suspicion: with unit=imperial, truck_weight may be interpreted in lb (not kg). Customer sends truck_weight=10433 while unit=imperial; if treated as 10,433 lb (~4.7t) it would NOT trigger a 10-ton/20,000lb restriction. Can you try either (A) set unit=metric and keep truck_weight=10433 (kg), or (B) keep unit=imperial but set truck_weight≈23000 (lb) and see if Skyline Drive gets avoided? If this flips behavior, it’s a docs/param-unit bug (or conversion bug) rather than map data.
  - [Comment / Qiang Fu] Need recreate NAM map data to resolve this~
  - [Comment / Qiang Fu] the plan was: if everthing is going smoothly will deploy tdy, otherwise early the next week, going to test will see
  - [Comment / Qiang Fu] deployed
  - [Comment / Vignesh Kumar S] I’ve informed the Geotab team about the deployment

#### Ticket `86d2qb49f` — Question of Construction / Road updates
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] already done in 86d2pvrqp
  - [Comment / Qiang Fu] there's also another issue, to consolidate the fix we are working on that now
  - [Reply (threaded) / Qiang Fu] done
  - [Comment / Shivam Yadav] cc: @Vignesh Kumar S
  - [Comment / Vignesh Kumar S] @Shivam Yadav @Qiang Fu Could you please share a detailed RCA along with the preventive measures implemented to avoid this issue going forward? Jason from geotab requested for it
  - [Reply (threaded) / Vignesh Kumar S] Thanks @Zheng Shaolin

#### Ticket `86d0r1d4q` — Routing along a private route GreenField MA
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] @Sachin Krishna could we always also verify what TomTom will do?
  - [Reply (threaded) / Sachin Krishna] Will check that and get back to you shaolin
  - [Comment / Vignesh Kumar S] Thanks @Sachin Krishna Let me know once we receive updates
  - [Comment / Vignesh Kumar S] @Sachin Krishna Do we any update from Tomtom?
  - [Comment / Xu rui] Tomtom is updated quarterly and is expected to update our map next month, updates will start at the end of the month, at the same time, the ops team is also investigating how to infer more private roads
  - [Comment / RISHABH KEDIA] We are expecting to integrate the tom tom map data updated by Jan end

#### Ticket `14ym01ucbh4` — Truck ETA Optimization &#8211; Validate Test Results
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] Please see the two attached files: truck_eta_validation.md for the summary statistics and explanation, and truck_eta_validation.csv for the per-segment before/after ETAs against measured drive times. @Vignesh Kumar S @Zheng Shaolin
  - [Comment / Qiang Fu] Also compared with Here and Tomtom truck routing.
  - [Comment / Zheng Shaolin] Where are the ground truth actual_min in this coming from?
  - [Reply (threaded) / Qiang Fu] We use the trip data from Velocitor

#### Ticket `86d2unpxd` — Ryde Technical Evaluation &#8211; ETA Accuracy &amp; Latency Concerns Impacting Renewal
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Closing this ticket as Rydesharing has cancelled the contract.

#### Ticket `86d1uea3v` — [route engine] cross_border affects route for truck shortest
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Hello @Youzhi Yang This is the duplicate ticket created under customer success page for 86d1ue61g
  - [Comment / RISHABH KEDIA] FYI - update has been shared with the customer waiting for Connor feedback

#### Ticket `86d12rbgq` — Directions Flexible API Ignoring cross_border=false with route_type=shortest
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Youzhi Yang] cc: @Qiang Fu
  - [Reply (threaded) / Shivam Yadav] @Anil Yamarti @Anusha Lanka please help test this customer request
  - [Comment / Zheng Shaolin] @Vignesh Kumar S
  - [Comment / RISHABH KEDIA] @Shivam Yadav We can close this ticket as we have not seen any error coming

#### Ticket `86d42ga4v` — Shortest Route with Avoid Preferences
- Status: complete
- Customer query / description (verbatim): When using shortest route over fastest route, we noticed that driver avoid inputs (e.g. avoid tolls, avoid U-turns, avoid sharp turns) are being ignored&#8212;the API returns the shortest route regardless. Is it possible to have shortest route respect those avoid preferences? Ideally, if a driver has "avoid tolls" enabled, the shortest route returned would exclude toll roads.
- Thread (verbatim, in order):
  - [Customer query / ticket description / RISHABH KEDIA] When using shortest route over fastest route, we noticed that driver avoid inputs (e.g. avoid tolls, avoid U-turns, avoid sharp turns) are being ignored—the API returns the shortest route regardless. Is it possible to have shortest route respect those avoid preferences? Ideally, if a driver has "avoid tolls" enabled, the shortest route returned would exclude toll roads.
  - [Comment / Vignesh Kumar S] @Shivam Yadav Please check this 86d40py87
  - [Comment / RISHABH KEDIA] Now following up on 86d4387dh
  - [Comment / RISHABH KEDIA] Yang has deployed the fixed version to staging but haven't receive any response yet.he'll follow up on the testing and share any updates.
  - [Comment / RISHABH KEDIA] Closing this ticket as the customer has been explained the avoid vs exclude over the call and we recommended them to use exclude if it is a hard constraint.

#### Ticket `86d3z6bj6` — Difference In Route Calculation Using Fastest and Shortest Route Types
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Qiang Fu] @RISHABH KEDIA @Shivam Yadav
  - [Comment / RISHABH KEDIA] Acknowledged by the customer and we recommendd them to always go with Flexible, so closing this ticket

#### Ticket `86d3y58kx` — Default Mode of Direction API
- Status: complete
- Customer query / description (verbatim): Hello Team Has there been any change in the default mode for direction API call as we are seeing a request where when direction api call is made without the mode parameter the default SKU used is SEA-6W
- Thread (verbatim, in order):
  - [Customer query / ticket description / RISHABH KEDIA] Hello Team Has there been any change in the default mode for direction API call as we are seeing a request where when direction api call is made without the mode parameter the default SKU used is SEA-6W
  - [Comment / Lifu] real bug in deployment script; has fixed
  - [Comment / Lifu] github.com/nextbillion-ai/prd-deploy/pull/1489

#### Ticket `86d21ebvw` — Investigate large Distance Matrix request &amp; truck mode errors (Australia region)
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Gaurav Bubna] Yes go ahead @Qiang Fu
  - [Reply (threaded) / Qiang Fu] @Youzhi Yang 2 new skus to sgp cluster, sea-avgspeed-4w/sea-avgspeed-6w, let's go with 1cpu/4g first
  - [Reply (threaded) / Vignesh Kumar S] Thanks @Youzhi Yang I also verified that API returns successful results & I will notify the Geotab team.

#### Ticket `86d249k0w` — Distance matrix failing with error code 422 for EUR-4W
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `14ym01ujufv` — Optimization API returning "location unreachable" for a valid residential address
- Status: complete
- Thread: none recorded (title and status only).


---

## 2. Distance Matrix

- `14ym01unhh8` "Flexible Distance Matrix marks off-road stop unreachable only when request has **13+ stops**" (ready for deployment, no root cause recorded). The failure threshold depends on stop count. Test with realistic stop counts, not 3 to 5 samples.
- `14ym01ucgrr` "[ZUS Coffee] Malaysia Flexible Matrix NoRoute / snapping mismatch with TomTom roads": snapping mismatch against the base map.
- `86d0xnw1f` "Distance Matrix API slow response / timeouts": resolved by **increasing resources for the Europe SKU**.
- `86d2dmf08` "Flexible Optimization API: single-vehicle 125–150 stop jobs remain in 'Job still processing'": folded into a follow-up performance ticket.
- `86d44ru7n` "Optimization performance and scaling" and `86d090b19` "Performance issue using multi vehicle profiles" (a 35-minute case): engineering asked for the request id to analyse.
- `86d1ce5w9` "Route Optimization throwing erroneous timestamp": engineering change: "When the matrix part fails, return all failures."
- Builder rules:
  - Treat NoRoute / unreachable as per-pair data. Check snapping and approaches before blaming the API.
  - Long-running jobs return as a polled job. Never assume synchronous completion for large inputs.
  - Capture `request id` for every call. It is the first thing support asks for.

### Full ticket records — 2. Distance Matrix

#### Ticket `14ym01unhh8` — Flexible Distance Matrix marks off-road stop unreachable only when request has 13+ stops
- Status: ready for deployment
- Thread: none recorded (title and status only).

#### Ticket `14ym01ucgrr` — [ZUS Coffee] Malaysia Flexible Matrix NoRoute / snapping mismatch with TomTom roads
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Thanks Youzhi
  - [Comment / RISHABH KEDIA] We will notify customer.
  - [Comment / RISHABH KEDIA] img_v3_0215r_6eb434bc-920a-4078-885a-46d5ea42afhu.png
  - [Reply (threaded) / RISHABH KEDIA] Thanks @Youzhi Yang

#### Ticket `86d0xnw1f` — Distance Matrix API Slow Response / Timeouts
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] @Xu rui increased the resource of europe SKU
  - [Comment / Zheng Shaolin] We already increased the resource yesterday, have we verified it?

#### Ticket `86d2dmf08` — Flexible Optimization API: single-vehicle 125&#8211;150 stop jobs remain in "Job still processing"
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] Closing this ticket and following the updates here 86d2u9kvm

#### Ticket `86d44ru7n` — Optimization performance and scaling
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Ritu Josan] @Shivam Yadav We need to start working on this ticket. Can you please prioritize this and let us know the next steps?
  - [Reply (threaded) / Shivam Yadav] @Yao Fu is already looking into it. Will check with him for update and share it here.

#### Ticket `86d090b19` — Performance issue while using multi vehicle profiles
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Yao Fu] @Vignesh Kumar S Could you share the request id for this 35 minutes case?
  - [Reply (threaded) / Vignesh Kumar S] Reached out to the customer
  - [Reply (threaded) / Yao Fu] Thanks!

#### Ticket `86d1ce5w9` — Route Optimization throwing erroneous timestamp
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Yao Fu] [image]
  - [Comment / Xu rui] When the matrix part fails, return all failures.（done）


---

## 3. Route Optimization

### 3.1 Unreachable / unassigned jobs
- `14ym01ujufv` "Optimization API returning 'location unreachable' for a valid residential address": no resolution text recorded.
- `86d3tax60` (see 1.4): regional unreachable burst, resolved by rollback.
- `86d1mqgaa` "Some jobs intermittently not mapped to routes despite valid constraints": customer business impact. It was closed after the engineering reply, with no root cause recorded.
- `86d3ftzrd` "Unexpected unassigned job when using precedence relation": **engine fix** deployed to staging, then verified by the customer.
- `86d3dh95a` "Unexpected break distance": engine fix; customer confirmed.
- `86d23b0z8` "Chronological ordering and validation for breaks in RO requests": still unresolved (`to do`, low priority). Order your `breaks` chronologically yourself.

### 3.2 Capacity dimension mismatch and re-optimization
- `86d2mzj34` "Capacity dimension mismatch in solution despite matching vehicle/job dimensions": the recommendation was to use the **re-optimization endpoint** instead of resubmitting a `solution`.
- Chat evidence: re-optimization keeps the previous plan's structure with minimal disruption. It is not a fresh global optimization (see chat doc). If you need a full re-sequence, submit a new `/optimization/v2` request.

### 3.3 Response format surprises
- `86d09zbd2` "Arrival, duration timestamps returned in **nanoseconds**" (AJEX): not nanoseconds. It was a **signed/unsigned integer problem** in the engine. Fixed and deployed.
- `86d1af27e` "Missing correlation between input vehicles and solution view": the response does not list unassigned or unused vehicles directly. The app has to compute them by diffing input against output.
- `86d210aju` "Standardize step-wise distance calculation format in output JSON" and `86d37ax3v` "Route Planner — saved CSV header mappings not retrieved": Route Planner UI issues. Only the Vehicle mapping was saved by design. Order (job/shipment) mapping was then added.
- `86d22ycu3` "AttriX | Navigation Flexible API returning **105 route objects** instead of a single route": engine fix, deployed. After it, only one route is returned.

### 3.4 Webhooks on Route Optimization
- `86d3028fk` "Error using the webhook options for Route Optimization": fixed on the engine side. The customer was slow to confirm. It was closed after internal verification.

### 3.5 Samsara dispatch / service time
- `86d132dgb` / `86d15b2qk` "Samsara — service time handling": Samsara's route API supports **arrival/departure times, not service time**, so service times were altered when dispatched. A change at **account level** (not for all dispatches) was rolled out, starting with one customer account, and verified in prod.

### 3.6 Fuel truck and other design questions
- `86d2ueh29` "Route Optimization — fuel truck": handed to engineering to recommend an approach; no recorded outcome.
- `86d393h46` "Early arrival / excessive waiting time at drop-off locations": title only.

### Builder rules for RO
- Always check `unassigned` plus `reason`, not only `routes`.
- Fix all matrix/location preconditions first (snapping, approaches, truck limits). Most "location unreachable" cases were upstream data or deploy problems.
- Order breaks chronologically yourself.
- For changes after a plan exists, use the dedicated re-optimization endpoint and understand its stability bias.

### Full ticket records — 3. Route Optimization

#### Ticket `86d3ftzrd` — Unexpected unassigned job when using precedence relation
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Tang Muchen] @Yao Fu We should have released a fix in staging, let's try whether it work as expected or not
  - [Comment / RISHABH KEDIA] We have also verified the fix and notified customer about the fix.
  - [Comment / RISHABH KEDIA] Closing this ticket as Ben confirmed it is working as expected

#### Ticket `86d3dh95a` — Unexpected break distance
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Notified customer waiting for his response
  - [Reply (threaded) / RISHABH KEDIA] Have informed customer regarding the fix
  - [Comment / RISHABH KEDIA] Ben is happy with the Fix and it is working as expected so closing the ticket

#### Ticket `86d23b0z8` — Chronological Ordering and Validation for Breaks in Route Optimization Requests
- Status: to do
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Jim confirmed that this issue is still unresolved. Since it is currently a low-priority ticket, we will prioritize it once the engineering team has sufficient bandwidth to work on it.

#### Ticket `86d2mzj34` — Capacity dimension mismatch in solution despite matching vehicle/job dimensions
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Hello @Yao Fu We can close this ticket as we have suggested the customer to use re-optimiation API endpoint instead of using "solution".

#### Ticket `86d09zbd2` — Arrival, Duration Timestamps returned in Nanoseconds- AJEX
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Yao Fu] It's not timestamps returned in nanoseconds. it's a signed/unsigned integer problem. Fix has been deployed.

#### Ticket `86d1af27e` — Missing Correlation between Input Vehicles and solution view
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] @Zheng Shaolin how do you suggest we retrieve the unassigned/unused vehicles ? Not sure if it is available in the response.

#### Ticket `86d210aju` — Standardize Step-Wise Distance Calculation Format in Output JSON
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] @Peisong Xiong the recalculation of step level timing is purely from the route planner edit page.
  - [Comment / Peisong Xiong] @RISHABH KEDIA @Arnav Malik Most probably user has edited this solution in v1's editor, which still has this bug. V2 should work fine. I will apply the same fix to v1.
  - [Comment / Arnav Malik] @saikumar is this verified in prod. ?

#### Ticket `86d37ax3v` — Route Planner - Saved CSV Header Mappings Not Being Retrieved
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] Based on @Peisong Xiong, by design, only Vehicle mapping preference are being saved, neither Order nor Shipment will be saved. @Arnav Malik would you please confirm the preferred logic here
  - [Reply (threaded) / Arnav Malik] We should save the Order (Job/Shipment) mapping as well.
  - [Reply (threaded) / saikumar] @Yao Fu working fine now and we are able to generate route
  - [Comment / Arnav Malik] @Peisong Xiong can we expedite this, its for mtm.
  - [Reply (threaded) / saikumar] Tested in prod and working fine for above cases.
  - [Reply (threaded) / Arnav Malik] Created a Task from this thread:86d3a18zc

#### Ticket `86d22ycu3` — AttriX | Navigation Flexible API returning 105 route objects instead of single route
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] We’ve basically completed the fix, after testings, it will be released early next week together with the fix for the other snap issue.
  - [Comment / Qiang Fu] Deployed, only one route observed from the result now~
  - [Reply (threaded) / Qiang Fu] The format was broken, could u put the reqeust into a file?
  - [Reply (threaded) / Qiang Fu] Is it a new request? We verified the old one~
  - [Reply (threaded) / Ritu Josan] The customer has escalated this. Could you please share the date by when this will be released next week, so that we can communicate this to the customer.
  - [Reply (threaded) / Ritu Josan] Sure, thank you

#### Ticket `86d3028fk` — Error using the webhook options for Route optimization
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Hello @Yao Fu Have updated customer waiting for his response
  - [Comment / RISHABH KEDIA] Have shared with the customer waiting for customers response.
  - [Comment / RISHABH KEDIA] Sent a follow-up email as we haven't heard back after the fix was deployed.
  - [Comment / RISHABH KEDIA] We are closing this ticket as we have checked this internally and verified.

#### Ticket `86d132dgb` — Service Times Altered When Dispatching from NextBillion &#8594; Samsara
- Status: discard
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] Shared this on Lark channel earlier - Samsara API supports dispatch of Arrival / Departure time and not service time. developers.samsara.com/docs/creating-routes-via-api
  - [Comment / Zheng Shaolin] It's possible that they do support service time but they didn't expose it in their API. Maybe we can reach out to their support?
  - [Comment / Zheng Shaolin] Currently after Yun's departure, we didn't have a formal transition on Fleetify. @Shi Yingbin should be the right person for this project.
  - [Comment / Zheng Shaolin] @Arnav Malik Yingbin will take this forward
  - [Comment / Arnav Malik] Before we implement any change - lets review current customer usage who are using fleet hub for samsara dispatch. @Shi Yingbin
  - [Comment / Zheng Shaolin] 86d15b2qk will use this ticket to track. Discard this one.

#### Ticket `86d15b2qk` — Samsara - Service time handling
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] @Shi Yingbin we should do this change at a customer/account level - not for all dispatches together. This updated roll out should be done for Okridecare ( pvragon ) first.
  - [Comment / Shi Yingbin] it's deployed to staging. To perform testing, a Pvragon account must be created first, followed by setting up a Samsara integration in NCC.
  - [Reply (threaded) / Arnav Malik] @Shi Yingbin not sure how to create a pvragon account on staging ? I suggest we can pick a regular test account for which we can enable this samsara dispatch change ?
  - [Reply (threaded) / Shi Yingbin] We can create an account on Maaas-stg, but I'm not sure if you have access to it. Let me enable this samsara dispatch change for all account on staging to make testing easier. @Arnav Malik
  - [Reply (threaded) / Shi Yingbin] Updated on staging
  - [Comment / Shi Yingbin] It seems staging wasn’t on the latest version. I’ve redeployed it and confirmed everything looks good now. Please check again. @saikumar
  - [Comment / saikumar] Working fine in prod

#### Ticket `86d2ueh29` — Route Optimization - fuel truck
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Shivam Yadav] @Xu rui @Yao Fu please help investigate and recommend and approach
  - [Reply (threaded) / Vignesh Kumar S] Any update on this?
  - [Reply (threaded) / Shivam Yadav] @Xu rui

#### Ticket `86d393h46` — Early Arrival / Excessive Waiting Time at Drop-off Locations
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d1mqgaa` — Some jobs intermittently not mapped to routes despite valid constraints
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] @Zheng Shaolin can we prioritize it as the customer is bussiness is getting impacted and the client it regularly asking for update
  - [Comment / Arnav Malik] @Peisong Xiong @Yao Fu Please check.
  - [Reply (threaded) / Yao Fu] @Shivam Yadav
  - [Comment / Yao Fu] image.png
  - [Comment / Yao Fu] image.png
  - [Reply (threaded) / Vignesh Kumar S] Got it. We can close this ticket then @Rishabh Singh @Shivam Yadav
  - [Reply (threaded) / RISHABH KEDIA] Okay

#### Ticket `86d173b8h` — Update Servicetitan MAAAS account details
- Status: discard
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] what is the correct domain ?
  - [Reply (threaded) / Vignesh Kumar S] servicetitan.com
  - [Comment / Zheng Shaolin] also need the contact information
  - [Reply (threaded) / Vignesh Kumar S] [ServiceTitan contact email – omitted in this export]
  - [Comment / Zheng Shaolin] @Peisong Xiong we can make the change directly in database, or we can build a new simple UI in MaaaS to allow editing

#### Ticket `86d3hkb95` — [MVRO] Complete storage config stage 2 with explicit storage block
- Status: discard
- Thread: none recorded (title and status only).

#### Ticket `86d3hkb8k` — [MVRO] Redact sensitive fields from startup config logs
- Status: discard
- Thread: none recorded (title and status only).


---

## 4. Directions / snapping / navigation geometry

- `86d3fxg2z` "Bike mode returns a longer distance than Car mode": the customer fed **raw GPS traces as mandatory Directions waypoints**. 2W/motorcycle routing then detoured to avoid unpaved roads. Recommendation: use **Snap-to-Roads** to reconstruct travelled distance. Resolved on that basis.
- `86d18vqax` "Unexpected routes returned by Directions API": `bearing` only picks direction when the origin sits on a bidirectional road and does **not** affect the snap stage. Best practice: use `travelled_raw_locations`.
- `14ym01ue7bn` "[Saneforce] Snap-to-Road partial geometry and incorrect travelled distance"; `86d3uj1zu` "Snap to Road API throwing error" (found proactively, not reported by the customer); `86d1vj51b` "[Urgent] Snap to roads API is failing": no resolution text recorded.
- `86d321z9k` "Geometry mismatch when using turn exclusions / `exclude`" and `86d321t1d` "Missing geometry when using `avoid none`": both retested; geometry is returned. Customer informed.
- `86d2gf8g7` "Exits systematically in directions": `road_info=max_speed` is currently not affecting the road. A fix was confirmed by the customer.
- `86d42g94m` "Traffic light & stop sign data": built into the map data pipeline. Exposed through Directions via `road_info`. New fields added: `traffic_light`, `stop_sign`, `way_id`, `gers_id`, `toll_distance`, `toll_cost`, `toll_info`. The Navigation API and docs were updated.
- `86d3ree7c` "Truck route not snapped to origin/destination": came from a prospect, not a customer. It was closed.
- `14ym01ubuga` "Route when using ferry": the Route Planner viewer only renders what the optimization response returns. The first step is to check why Directions does not return correct ferry geometry. Resolved by changing the request body.
- `86d3t9d8j` "Route Planner — unexpected detour around Bishop Monkton": in `dev review`; no diagnosis recorded.
- Builder rules:
  - Never use raw GPS points as mandatory waypoints. Snap first.
  - Prefer `travelled_raw_locations` over `bearing` for snapping control.
  - Request `road_info` when you need turn, speed, toll or sign context.

### Full ticket records — 4. Directions, snapping, navigation

#### Ticket `14ym01uh3dk` — Route distance diagnosing
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / Qiang Fu] compass.nextbillion.io/directions?origin=39.13958,-77.97953&dest=39.13958,-77.97953&waypoints=39.20772,-77.96917&waypoints=39.20081,-77.94508&waypoints=39.2029723,-77.9439008&waypoints=39.181,-77.96686&waypoints=39.1582323,-77.980977&waypoints=39.1578563,-77.9809657&travelMode=4&serviceProviders=Production&flexible=true&routeType=fastest&departureTimeOption=now&alternative=false&alternativeNum=1&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted
  - [Reply (threaded) / Qiang Fu] compass.nextbillion.io/directions?origin=29.99534,-90.16117&dest=29.99534,-90.16117&waypoints=29.9536382,-90.0502212&waypoints=29.97488,-90.10261&waypoints=30.0155316,-90.106224&waypoints=29.97269,-90.07376&waypoints=29.943372,-90.107154&travelMode=4&serviceProviders=Production&flexible=true&routeType=fastest&departureTimeOption=now&alternative=false&alternativeNum=1&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&departureTime=1791468140735&session=0NkJH1&annotation=false&bidirectional=bi&crossBorder=false&sharpTurnAngleRange=0&snapAvoid=&truckInfo=%7B%22width%22:0,%22length%22:0,%22height%22:0,%22weight%22:0,%22hazmat%22:false,%22hazmat_type%22:%22general%22,%22truck_axle_load%22:0,%22truck_axle_count%22:0,%22truck_type%22:%22%22%7D&driveTimeLimits=&restTimes=&arriveTimeOption=departure&arriveTime=Thu%20Oct%2008%202026%2022:02:20%20GMT%2B0800%20(Singapore%20Standard%20Time)&geometry=polyline&overview=full&steps=false&czSwitch=false&customizeParameters=
  - [Reply (threaded) / Qiang Fu] compass.nextbillion.io/directions?origin=35.59537,-97.56914&dest=35.59537,-97.56914&waypoints=35.47531,-97.72754&waypoints=35.47253,-97.75626&waypoints=35.45556,-97.72967&waypoints=35.45467,-97.76507&travelMode=4&serviceProviders=Staging&flexible=true&routeType=fastest&departureTimeOption=now&alternative=false&alternativeNum=1&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&approaches=unrestricted&avoid=toll&departureTime=1791468140959&session=w4SppT&annotation=false&bidirectional=bi&crossBorder=false&sharpTurnAngleRange=0&snapAvoid=&truckInfo=%7B%22width%22:0,%22length%22:0,%22height%22:0,%22weight%22:0,%22hazmat%22:false,%22hazmat_type%22:%22general%22,%22truck_axle_load%22:0,%22truck_axle_count%22:0,%22truck_type%22:%22%22%7D&driveTimeLimits=&restTimes=&arriveTimeOption=departure&arriveTime=Thu%20Oct%2008%202026%2022:02:20%20GMT%2B0800%20(Singapore%20Standard%20Time)&geometry=polyline&overview=full&steps=false&czSwitch=false&customizeParameters=

#### Ticket `86d3fxg2z` — Bike mode returns a longer distance than Car mode
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] @Qiang Fu @Xu rui Please prioritize this. The customer is waiting for our response before they can go live.
  - [Reply (threaded) / Shivam Yadav] completed required documentation change
  - [Comment / Xu rui] The customer is using raw GPS traces as mandatory Directions waypoints, causing 2W/motorcycle routing to take a long detour to avoid unpaved roads; we recommend using snap_to_roads for actual travelled-distance reconstruction.
  - [Comment / Xu rui] [Attachment: snap-to-roads-analysis.png]
  - [Comment / RISHABH KEDIA] Closing this ticket as this issue is resolved. using snap to road api call

#### Ticket `86d18vqax` — Unexpected Routes Returned by Directions API
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / Gaurav Bubna] @Zheng Shaolin I guess bearing should also help?
  - [Reply (threaded) / Zheng Shaolin] @Gaurav Bubna bearing only helps decide the direction if origin is on a bidirectional road. It does not affect snap stage. Best way is to leverage travelled_raw_locations
  - [Comment / RISHABH KEDIA] Sent a note to the customer waiting for there response
  - [Comment / Zheng Shaolin] @RISHABH KEDIA have we heard back from them?

#### Ticket `14ym01ue7bn` — [Saneforce] Investigate Snap-to-Road partial geometry and incorrect travelled distance
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] img_v3_0215p_d0687751-af28-4f9c-b914-7342947e70hu.png

#### Ticket `86d3uj1zu` — Snap to Road API throwing error
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / RISHABH KEDIA] closing this ticket as it wasn't shared by customer but it was when we were proactively checking for error report we noticed this so we reported

#### Ticket `86d1vj51b` — [Urgent]: Snap to roads API is failing
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d321z9k` — Geometry mismatch when using turn exclusions/exclude parameters in routing response
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Shivam Yadav] @Vignesh Kumar S
  - [Comment / Vignesh Kumar S] Notified the customer and closing this one

#### Ticket `86d321t1d` — Missing geometry when using avoid none
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Yao Fu] @Vignesh Kumar S @Zheng Shaolin ^
  - [Comment / Vignesh Kumar S] Tested this and confirmed that Geometry is returned. Informed the customer and let's close this ticket @Yao Fu

#### Ticket `86d2gf8g7` — Exits systematically in directions
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] @Youzhi Yang yes currently road_info=max_speed is not effecting the road
  - [Comment / RISHABH KEDIA] The customer acknowledged the fix and confirmed it is working as expected.Screenshot 2026-04-06 at 7.04.04 PM.png

#### Ticket `86d42g94m` — Traffic Light &amp; Stop Sign Data
- Status: complete
- Customer query / description (verbatim): This is something we're actively working on. Rather than exposing it through a separate API, we're incorporating traffic lights and stop signs directly into the map data pipeline. Once available, this information will also be exposed through the Directions API via the road_info parameter, allowing traffic light and stop sign data to be returned for any calculated route.
- Thread (verbatim, in order):
  - [Customer query / ticket description / RISHABH KEDIA] This is something we're actively working on. Rather than exposing it through a separate API, we're incorporating traffic lights and stop signs directly into the map data pipeline. Once available, this information will also be exposed through the Directions API via the road_info parameter, allowing traffic light and stop sign data to be returned for any calculated route.
  - [Reply (threaded) / Qiang Fu] @Zheng Shaolin @Shivam Yadav maybe also need update the docs
  - [Reply (threaded) / Qiang Fu] Sure will add traffic_light、stop_sign、way_id、gers_id、toll_distance、toll_cost、toll_info and need to sync docs once done
  - [Reply (threaded) / RISHABH KEDIA] @Qiang Fu any estimate timeline which we can communicate with the customer.
  - [Reply (threaded) / Qiang Fu] @RISHABH KEDIA done already, cc @Shivam Yadav
  - [Reply (threaded) / RISHABH KEDIA] Intimated customer.
  - [Comment / RISHABH KEDIA] closing this ticket as the navigation API is also updated with all the parameters and also updated on the documents.

#### Ticket `14ym01ubuga` — Route when using ferry
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] @Peisong Xiong @Shi Yingbin can we support ferry view in solution & viewer (route planner) - just show the route geometry.
  - [Reply (threaded) / Shi Yingbin] The MVRO response is the single source of truth, NCC just renders it. So I'd suggest we first investigate why the direction API isn't returning the correct route geometry with ferry option.
  - [Reply (threaded) / RISHABH KEDIA] Okay I will try changing the request body once
  - [Comment / RISHABH KEDIA] Closing this ticket as customer also confirmed.

#### Ticket `86d3t9d8j` — Route Planner - Unexpected Detour Around Bishop Monkton
- Status: dev review
- Thread: none recorded (title and status only).

#### Ticket `86d3g7u7n` — Miscalculated Route
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d1w86et` — {guidence} Placeholder Appearing in Voice Instructions API Response
- Status: complete
- Thread: none recorded (title and status only).


---

## 5. Geocoding / search

- `14ym01ufvdm` "Autocomplete: issue with new addresses": "Abby Road" (41 Abby Rd, Peapack Gladstone NJ) is not in TomTom data. Use the **Orbis** geocoder (`/orbis/geocode?q=...&at=lat,lng&limit=3`). Internal guidance: recommend that clients migrate to Orbis entirely; the missing "Walden" case was reported to the data provider. A TomTom ticket was filed (`CS0015359`).
- `86d1up8ak` "geocode, discover API request result — `stateCode`": title only.
- `14ym01ucg95` "SFMTA — incorrect geocoding for numbered street address ranges" and `86d3xh599` "Investigate geocoding result for address-range query 600–699 Golden Gate Ave, San Francisco": for address ranges, query with `types=addressblock` and compare results against Google Maps. The test set came from Velocitor / SFMTA sheets (first 25 rows as a sample).
- `86d2a0zbd` "Address lookup discrepancy": title only.
- `86d2ag9f2` "Verify speed limit returned in Reverse Geocode API (Linxio)": TomTom ticket `CS0009130` raised.
- `86d2ehdbn` "Easy Health 499 error timeout": 499 on Geocode during a day when the upstream provider **TomTom** had an outage. There was nothing NextBillion could do. The client was asked for its client-side implementation.
- `86d2ncuxq` "AlongRoute API returning empty results without errors": title only.
- `86d1pnrxu` "Skynet Search Around API not reflecting updated attributes": title only.
- Builder rules:
  - A missing address is usually a provider data gap. Try the alternative geocoder (Orbis) before building fallbacks.
  - Handle empty results explicitly. AlongRoute and Search can return an empty list with no error.
  - For range or block addresses, set `types=addressblock`.
  - A client-side 499 means the caller disconnected. Check timeouts on your side and upstream outages.

### Full ticket records — 5. Geocoding and search

#### Ticket `14ym01ufvdm` — Auto complete:- Issue with new addresses
- Status: to do
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] Abby Road It would be better to use Orbis for this case, TomTom does not have the data of this Abby Road.https://api.nextbillion.io/orbis/geocode?q=41%20Abby%20Rd%2C%20Peapack%20Gladstone%20NJ%2007977&at=40.7065753,-74.6433679&limit=3&key=
  - [Comment / Zheng Shaolin] Let's recommend that clients migrate to Orbis entirely; we say it yields better results. As for the Walden case, let's say we reported back to our data provider
  - [Comment / RISHABH KEDIA] Tomtom ticket: CS0015359

#### Ticket `86d1up8ak` — geocode,discover API request result - stateCode
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `14ym01ucg95` — SFMTA &#8211; Incorrect Geocoding for Numbered Street Address Ranges
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] Reference chat : claude.ai/share/7e63bf90-920f-4905-a577-90d432d6eea5

#### Ticket `86d3xh599` — Investigate Geocoding Result for Address Range Query: 600&#8211;699 Golden Gate Ave, San Francisco, CA
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Reply (threaded) / Arnav Malik] @saikumar this is the latest sheet we can refer to as received from velocitor/sfmta(column G). we should enter the results with types=addressblock and compare it with google maps. First 25 rows should be enough as sample set.

#### Ticket `86d2a0zbd` — Address lookup discrepancy
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d2ag9f2` — Verify Speed Limit Returned in Reverse Geocode API (Linxio)
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] Raised a tomtom ticket: CS0009130

#### Ticket `86d2ehdbn` — Easy Health-499 error timeout
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] @Lifu would you please to take a look into this first
  - [Comment / Vignesh Kumar S] @Lifu I’ve reached out to the EasyHealth team with our findings and asked them to share their client-side implementation
  - [Comment / Lifu] since there is no further update I'll mark this as done. do reopen if the client reports any thing else
  - [Reply (threaded) / Lifu] @RISHABH KEDIA this is different customer, different endpoint, different timing, different problem than the original ticket?
  - [Reply (threaded) / RISHABH KEDIA] Yes @Lifu this is a different customer but the endpoint and the error scenario was same ie Geocode API he also reported that the service was down and when we checked it in logs it was same 499 error and also within some time the services went up and working.
  - [Reply (threaded) / Zheng Shaolin] The system outage that day was caused by an issue with the upstream provider TomTom. There was nothing we could do about it.

#### Ticket `86d2ncuxq` — AlongRoute API Returning Empty Results Without Errors
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d1pnrxu` — Skynet Search Around API not reflecting updated attributes
- Status: complete
- Thread: none recorded (title and status only).


---

## 6. Maps, styles and SDKs

- `86d38j2xd` "Satellite style fails to render in MapLibre due to **invalid colour value**": traced to the upstream style data; a TomTom ticket was raised and the customer later confirmed the fix. If a third-party renderer rejects a NextBillion style, check the style JSON for invalid colour expressions.
- `14ym01ufv8g` "SCI — API call with IP caller" (Maps SDK): rendering operations inside `onMapCreated` could crash before the style loaded. SDK **3.4.2** now defers such operations until the style is fully loaded. Use `onStyleLoadedCallback` for rendering.
- `86d20e4rk` "InstaRoute — iOS 26 NSExpression restriction breaking navigation view, SDK 3.1.4": the iOS native SDK's `ngl_interpolate` and `NGL_MATCH` were fixed in a new build (TestFlight version 1.3.1) and tested without crashes.
- `86d1w86et` "{guidence} placeholder appearing in Voice Instructions API response": title only.
- Builder rules: wait for the style to be loaded before adding sources or layers. (Chat evidence: calling `map.loaded()` on the SDK v2 wrapper fails with "map.loaded is not a function"; the wrapper exposes `isStyleLoaded()`.)

### Full ticket records — 6. Maps, styles and SDKs

#### Ticket `86d38j2xd` — Satellite Style Fails to Render in MapLibre Due to Invalid Color Value
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] We will raise a Tomtom ticket
  - [Comment / Ritu Josan] Diego has been informed. He needs to confirm if this is resolved.
  - [Comment / RISHABH KEDIA] Closing this ticket as customer confirmed the fix.

#### Ticket `14ym01ufv8g` — Re: SCI | API Call with IP caller
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Reply (threaded) / zhengshen] We have the callback onStyleLoadedCallback , Users can perform various rendering operations in this callback 2. I updated to version 3.4.2. This version has taken some protective measures for onMapCreated. If a user performs a rendering operation in this callback, the operation will be executed only after the style is fully loaded, rather than crashing directly
  - [Comment / Lifu] @zhengshen ^^
  - [Comment / zhengshen] Got it , will pickup this ticket asap .
  - [Comment / RISHABH KEDIA] Hello @zhengshen any update?
  - [Comment / RISHABH KEDIA] Have reverted back to customer and waiting for there reply

#### Ticket `86d20e4rk` — InstaRoute - iOS 26 NSExpression Restriction Breaking Navigation View &#8211; SDK 3.1.4
- Status: complete
- Thread (verbatim, in order):
  - [Comment / zhengshen] I have fixed the ngl_interpolate and NGL_MATCH in the iOS maps native sdk , I will build a new version for testing . if no crash occurs , I'll release a new sdk version soon.
  - [Comment / zhengshen] I have fixed the issue and uploaded a new test build on TestFlight , the version is 1.3.1
  - [Comment / zhengshen] @Shradha Pabsetti please let me know once the tesing done. I can release the sdk asap.
  - [Comment / Shradha Pabsetti] @zhengshen yes this is tested, we have not observed crash in this version


---

## 7. Webhooks, geofences, integrations

- `14ym01uh8r2` "[Rspndr] Clarify **`x-nb-hmac`** webhook verification for Geofence / Live Tracking": the ticket is complete but the thread does not include the verification algorithm. The header name is `x-nb-hmac`; the ticket thread does not record the signing algorithm or key, so confirm both in the current docs before coding (do not guess).
- `14ym01uhg2d` "RSPNDR ETL cannot reliably use asset latest location to select history": a design limitation on asset history lookups. The finding was shared with the customer.
- `86d12adhk` "Geofence_id not working for AttriX":
  - A geofence created without `custom_id` gets a **machine-generated UUID**. `name` is a separate field.
  - On a **POST** directions request, `option=flexible` must be on the URL. Without it the request is served by the older `nbroute` service, which does not support avoiding a `geofence_id` and returns the plain-text error "unsupport avoid object". GET callers were already passing `option=flexible`.
  - An engine fix was shipped and verified.
- `86d0t0azc` "MTM — translate Michigan postal codes to geofences": postal-code-based geofences have many sub-scenarios and problems. The recommended alternative was drawing polygons and creating GeoJSON.
- `86d0rz877` "MTM — incorrect traffic timestamp key and format causing API rejection": a Route Planner payload format bug, a duplicate of another ticket.
- `86d3ggu1m` "Asset API connectivity issues" and `86d28ht4b` "Display Live Tracking units in the console": no technical detail recorded.
- Builder rules: set `custom_id` when creating geofences so you can reference them. Always put `option=flexible` on the URL when using POST directions with avoid-geofence. Verify webhook signatures on the raw body before parsing.

### Full ticket records — 7. Webhooks, geofences, integrations

#### Ticket `14ym01uh8r2` — [Rspndr] Clarify x-nb-hmac webhook verification for Geofence / Live Tracking
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `14ym01uhg2d` — RSPNDR ETL cannot reliably use asset latest location to select history
- Status: awaiting confirmation
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Reverted back to the customer with the finding

#### Ticket `86d12adhk` — Geofence_id not working for AttriX Technologies
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] I listed all their Geofence via this link https://api.nextbillion.io/geofence/list?key= and did not see any geofence with this groupe_robert_b26B_b128E ID. Can we ask them to share how they created the Geofence in the beginning? Also to notice, they should be using custom_id field while creating, otherwise Geofence ID will be machine generated UUID, and also do notice the name field is separate from the custom_id .
  - [Reply (threaded) / Zheng Shaolin] thanks, will dig further
  - [Reply (threaded) / Xu rui] one important thing, when you use the post methord, option=flexible should be put on the url
  - [Reply (threaded) / Xu rui] @RISHABH KEDIA
  - [Reply (threaded) / Zheng Shaolin] Do we generate warning of avoid geofence are provided without option=flexible
  - [Reply (threaded) / Xu rui] if without option=flexible will call nbroute, nbroute not support avoid geofence_id, will return "unsupport avoid object" plain text return
  - [Reply (threaded) / RISHABH KEDIA] but customer is saying that it worked for them with the get call , not sure weather they are using option=flexible in there call will reach out to the customer to get this confirmed
  - [Reply (threaded) / RISHABH KEDIA] We checked with the customer for the get request and they are using option=flexible .
  - [Comment / Xu rui] fixed, ready for testing @RISHABH KEDIA
  - [Comment / Zheng Shaolin] @RISHABH KEDIA any update on this?
  - [Comment / RISHABH KEDIA] @Zheng Shaolin its working on our end and we have notified the customer but haven't heard back anything as we mentioned in the weekly support review call
  - [Comment / RISHABH KEDIA] And also as per datadog I don't see any failed triggers

#### Ticket `86d0t0azc` — MTM &#8211; Translate Michigan Postal Codes to Geofences
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Jim Welch] Can we provide an estimate for completion? Thx
  - [Reply (threaded) / Gaurav Bubna] @Anil Yamarti @Shradha Pabsetti @Sachin Krishna could you guys look into this? This is important so possible to finish by tomorrow?
  - [Reply (threaded) / Arnav Malik] @Peisong Xiong - Can you confirm which ones we could create ?
  - [Reply (threaded) / Ritu Josan] @Shradha Pabsetti please share the estimate timeline for completion.
  - [Reply (threaded) / Shradha Pabsetti] Sure @Ritu Josan will discuss with @Arnav Malik in a while and have the ticket updated.
  - [Reply (threaded) / Shradha Pabsetti] @Jim Welch we have shared possible sub scenarios and solutions corresponding to them on lark MTM channel. Please go through this doc. I think it's better to align with MTM also on this once. WDYT?
  - [Reply (threaded) / Jim Welch] Yes - I've reviewed the doc and can see that there are a number of issues with using postal code(s) for geofence definition. On our last call with MTM I was promoting use of a polygon drawing tool to create geojson as a better method. I'll ask them during our call today on progress.

#### Ticket `86d0rz877` — MTM | Route Planner: Incorrect traffic timestamp key and format causing API rejection
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Arnav Malik] this is a duplicate clickup, issue addressed here 86d0qyryt and updated on mtm lark channel.

#### Ticket `86d3ggu1m` — Asset API Connectivity Issues
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Updated customer but he is on leave and will be back by next week
  - [Reply (threaded) / RISHABH KEDIA] Okay @Lifu and will try to find some time for a call
  - [Reply (threaded) / RISHABH KEDIA] Notified customer waiting for his reply
  - [Comment / RISHABH KEDIA] closing this ticket. If customer comes back again will reopen it

#### Ticket `86d28ht4b` — Display Live Tracking Units in NextBillion Console for Customer Visibility
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d38m2qt` — Re: SCI | Q &amp; A Order Exisiting Issue
- Status: complete
- Thread: none recorded (title and status only).


---

## 8. API keys, access and account setup

- `86d09kcz3` "Optimization API access blocked from customer server (IP :544/444)": IP/port access issue; no resolution recorded in the thread.
- `86d2b495d` "Urgent: zones not working post-update & API key error impacting MI runs": resolved and customer notified.
- `86d2agemd` "Wildcard domain restriction support in NCC (Analytix)": UI placeholder updated to show wildcard domain restrictions.
- `86d3cn1bd` "MaaS — API expiry date addition" and `86d1dryxa` "Customer admin role without billing access (partner setup, TomTom)": account/console features.
- `86d1acreb` "Advantmed data residency not compliant with contract (SGP vs US)": the fix is to add **`region=america`** to API calls (tested working). Access to the US RO cluster is granted without removing Singapore access. If the parameter is missing, data stays in the Singapore infrastructure.
- `86d1t2b08` "Customer API usage monitoring & alerting": MVP approach: monitor `gateway_req_count` per `org_code` in Datadog and alert on a sustained 7-day drop versus a 30-day baseline. Daily reports go to a new email group (with CSV).
- Builder rules: keep keys server-side. If the app needs a browser key, restrict it by domain (wildcards are supported in the console). Set `region` explicitly for data-residency contracts.

### Full ticket records — 8. API keys, access, account setup

#### Ticket `86d09kcz3` — Optimization API Access Blocked from Customer Server (IP: 157.20.214.230:544/444)- Zouma
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d2b495d` — Urgent: Zones Not Working Post-Update &amp; API Key Error Impacting MI Runs
- Status: complete
- Thread (verbatim, in order):
  - [Comment / RISHABH KEDIA] Closing this ticket as the issue is resolved and the customer also notified

#### Ticket `86d2agemd` — Wildcard Domain Restriction Support in NCC (Analytix)
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Yao Fu] @Shivam Yadav
  - [Comment / Peisong Xiong] I will update the placeholder on UI

#### Ticket `86d3cn1bd` — Jarvis | MaaS | API Expiry date Addition
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d1dryxa` — Customer Admin Role Without Billing Access (Partner Setup)-Tomtom
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Shivam Yadav] The changes for this request are being tracked using 86d1hm0c3

#### Ticket `86d1acreb` — Advantmed data residency not compliant with contract (SGP vs US)
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Zheng Shaolin] We can migrate them to the US region just like MTM, but the problem is, they will need to make change to the API call by adding region=america
  - [Reply (threaded) / Jim Welch] OK I can inform them that they are missing this parameter in their requests and that as a result the data is not being sent to the America's infrastructure.
  - [Reply (threaded) / Jim Welch] Have we tested this @Vignesh Kumar S with their API key that it works in Americas?
  - [Reply (threaded) / Vignesh Kumar S] @Jim Welch I tested using region=america parameter and it is working
  - [Comment / Zheng Shaolin] @Lifu can we grant them access to RO in US?
  - [Comment / Zheng Shaolin] but do not stop their access to SG

#### Ticket `86d41v6b2` — Application Restrictions
- Status: complete
- Thread: none recorded (title and status only).

#### Ticket `86d1t2b08` — Customer API Usage Monitoring &amp; Alerting (Usage Dips, Spikes, Errors)
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Shivam Yadav] Discussed this with @Zheng Shaolin earlier today. We will research the next steps and suggest an approach.
  - [Comment / Arnav Malik] We can do an MVP in Datadog by monitoring gateway_req_count per org_code and alerting on sustained 7-day usage drops vs a 30-day baseline.
  - [Comment / Arnav Malik] @Lifu ^
  - [Reply (threaded) / Lifu] Who should be in the group?
  - [Reply (threaded) / Lifu] image.png
  - [Comment / Lifu] @Arnav Malik what email group should this daily report be sent to? or alternatively I can create a new one with the members who would like to see this
  - [Reply (threaded) / Arnav Malik] leets create a new one.
  - [Reply (threaded) / Lifu] image.png
  - [Comment / Ritu Josan] Can we also along with these reports, also get the csv files.


---

## 9. Latency and reliability

- `86d37gam8` "Latency in RO V2 GET request" (Neuvo): findings shared with the customer; no reply, closed.
- `86d2ehdbn` (see 5): 499s correlated with an upstream outage.
- `86d0xnw1f`: more resources for the Europe SKU.
- `86d21ebvw`: new SKUs and more CPU/memory for truck matrix.
- `86d2cjd08` "Route Report API returning 422 despite valid route output via polyline decoder": the thread asks whether the number of points had grown, since it had worked for a long time. A request-size limit is the likely angle, but the thread does not confirm it.
- Builder rules: add client timeouts and retry with backoff on idempotent calls. Log the request id. For long optimization jobs use polling, not long-held connections.

### Full ticket records — 9. Latency and reliability

#### Ticket `86d37gam8` — Latency in RO V2 GET request- Neuvo
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Vignesh Kumar S] Shared the findings with the customer on June 3rd but have not received a response. Sent a follow-up today. Closing this ticket now and reopening if the customer comes back with additional concerns

#### Ticket `86d37d3pz` — Invalid Error Message
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Youzhi Yang] @Shivam Yadav will check!
  - [Comment / RISHABH KEDIA] Hello @Lifu We tested it again and working as expected. Closing this ticket
  - [Comment / RISHABH KEDIA] Screenshot 2026-06-17 at 11.14.05 AM.png

#### Ticket `86d2cjd08` — Route Report API Returning 422 Error Despite Valid Route Output via Polyline Decoder
- Status: complete
- Thread (verbatim, in order):
  - [Reply (threaded) / RISHABH KEDIA] Hello Qiang has the number of point increased recently as he has been using it successfully for a long time

#### Ticket `86d1y7uvt` — Precisely: Isochrone Traffic Profile Discontinuity at Saturday 23:00 &#8594; Sunday 00:00 (Multiple Cities)
- Status: complete
- Thread (verbatim, in order):
  - [Comment / Ritu Josan] @Zheng Shaolin @Shivam Yadav What should be our first customer response be on this, also please share expected timeline for resolution so we can communicate accordingly to the Precisely team?
  - [Comment / RISHABH KEDIA] All issues have been addressed over Slack channel and Lifu has directly addressed all the query.


---

## 10. Process notes that matter for app builders

- Hard facts are fixed by data rebuilds, not by hot patches. Plan for days, not minutes, for a map-data correction.
- Engine bugs were commonly fixed on staging first. Support re-tests with the customer's exact request before closing.
- Duplicate tickets are common across the CS and engineering boards. Always search for the earlier id.
- Cases that closed without a root cause (`86d1mqgaa`, `14ym01ujufv`, `86d09kcz3`, snap-to-road failures) are marked "no cause recorded" here. Do not assume a solution for them.

### Full ticket records — other / internal ops

#### Ticket `86d2e0bpy` — CS Ops | Build open ticket dashboard with 48hr staleness view
- Status: to do
- Thread: none recorded (title and status only).

#### Ticket `86d2e0bkk` — CS Ops | Add "Last Customer Contact Date" and "Escalated" custom fields to all tickets
- Status: to do
- Thread: none recorded (title and status only).

#### Ticket `86d2e0bhb` — CS Ops | Redesign ticket status taxonomy for better visibility
- Status: to do
- Thread: none recorded (title and status only).

