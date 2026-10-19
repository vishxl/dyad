# Minimum Stop Load

## What is Minimum Stop Load?

In heavy goods and freight delivery, dispatching a large truck to deliver a handful of lightweight parcels is rarely efficient. The vehicle incurs the same road time, fuel cost, and driver wages, but returns a fraction of the productive value of a fully loaded run. Yet, a route optimizer working to minimize distance or time may routinely make exactly these assignments.

NextBillion.ai's Route Optimization API's **Min Stop Load** feature provides a way to discourage this. By setting a minimum load threshold (`min_stop_load`) on a vehicle, you instruct the optimizer to apply a cost penalty whenever that vehicle is assigned a delivery stop with a load below the threshold. The penalty, combining a _per-unit shortfall_ cost and an optional _one-time fixed_ cost, steers the optimizer toward more load-efficient assignments without ever strictly blocking a task when no superior alternative is available.

## Use Case: Heavy Goods Freight Delivery

Consider a regional freight operator who runs two heavy delivery trucks out of a central depot in Las Vegas. Both trucks have a payload capacity of 500 units, and the operator has established from experience that each truck run is only cost-justified when it delivers at least 150 units to any given stop.

Today's dispatch includes six customer deliveries ranging from 50 to 300 units. The challenge: several of the smaller orders (50-140 units) sit below the 150-unit efficiency threshold, but they still need to be fulfilled. The operator wants the optimizer to:

- Prefer assigning above-threshold loads wherever possible.
- When necessary, assign stops that are below the standard threshold. This should be done, however, with an intelligent selection process, based on the penalties associated with vehicle load thresholds.

This is precisely what Min Stop Load is designed for.

**Caution:** `min_stop_load` without penalty parameters has no effect. Always pair the threshold with at least one penalty setting.

## How Min Stop Load Works?

### The Threshold: min_stop_load

Set at the vehicle level as an array of integers (matching the vehicle's capacity dimensions), `min_stop_load` defines the minimum per-stop delivery load the optimizer should prefer for that vehicle. It applies exclusively to delivery-type jobs.

**Grouped stops:** When multiple orders are consolidated at a single physical stop, the effective load at the stop is the sum of all orders grouped at that stop.

### The Penalties: unit and fixed

Two penalty parameters control how strongly the optimizer avoids below-threshold assignments:

- `min_stop_load_unit_penalty`: Applied per unit of load shortfall at every violating stop. This penalty accumulates across all violating stops on the route. Use _unit_penalty_ to create a proportional deterrent so that larger shortfalls cost more and nudge the optimizer to prefer stops closer to the threshold.
- `min_stop_load_fixed_penalty`: One-time penalty applied to the route if any stop on that vehicle's route falls below the threshold. It is applied once regardless of how many stops violate the threshold. This makes it effective for discouraging light-load routes entirely, even when individual shortfalls are small.

The total penalty on a route is the sum of all per-stop unit penalties plus the single fixed penalty. This total is reported in the response under `penalty.min_stop_load`.

## Configuring the Feature: Input Parameters

All Min Stop Load parameters are configured at the vehicle level. The table below summarises the three attributes:

| Parameter                     | Type / Location   | Description                                                                                                                                      |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `min_stop_load`               | integer           | Minimum load threshold per stop. Applies only to delivery-type jobs.                                                                             |
| `min_stop_load_unit_penalty`  | array of integers | Penalty applied per unit of load shortfall at a stop.                                                                                            |
| `min_stop_load_fixed_penalty` | integer (vehicle) | A one-time fixed penalty applied to the route if any stop on that vehicle's route has a load below `min_stop_load`. Applied only once per route. |

In our freight delivery example above, the two vehicles are configured as follows:

| Vehicle   | min_stop_load | unit_penalty (per unit) | fixed_penalty (per route) |
| --------- | ------------- | ----------------------- | ------------------------- |
| Vehicle 1 | \[150\]       | \[2\]                   | 300                       |
| Vehicle 2 | \[150\]       | \[3\]                   | 200                       |

## Example API Request & Response

### Example API Request

The request below sets up two heavy freight trucks with different penalty configurations and six delivery jobs ranging from 50 to 300 units:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Min Stop Load Example",
  "locations": {
    "id": 1,
    "location": [
      "36.15944795,-115.20659211",     // index 0 - Depot 1
      "36.16568350874093,-115.23738137291211", // index 1 - Job 1
      "36.15918738490483,-115.24306768034586", // index 2 - Job 2
      "36.16653558,-115.25079129",     // index 3 - Job 3
      "36.15926628,-115.26173001",     // index 4 - Job 4
      "36.14406466,-115.23069975",     // index 5 - Job 5
      "36.15171485,-115.24091363"      // index 6 - Job 6
    ]
  },
  "depots": [
    { "id": "Depot 1", "location_index": 0 }
  ],
  "jobs": [
    { "id": "Job 1", "location_index": 1, "delivery": [50]  },
    { "id": "Job 2", "location_index": 2, "delivery": [50]  },
    { "id": "Job 3", "location_index": 3, "delivery": [140] },
    { "id": "Job 4", "location_index": 4, "delivery": [210] },
    { "id": "Job 5", "location_index": 5, "delivery": [100] },
    { "id": "Job 6", "location_index": 6, "delivery": [300] }
  ],
  "vehicles": [
    {
      "id": "Vehicle 1",
      "start_depot_ids": ["Depot 1"],
      "capacity": [500],
      "min_stop_load": [150],
      "costs": {
        "min_stop_load_fixed_penalty": 300,
        "min_stop_load_unit_penalty":  [2]
      }
    },
    {
      "id": "Vehicle 2",
      "start_depot_ids": ["Depot 1"],
      "capacity": [500],
      "min_stop_load": [150],
      "costs": {
        "min_stop_load_fixed_penalty": 200,
        "min_stop_load_unit_penalty":  [3]
      }
    }
  ],
  "options": { "routing": { "mode": "truck" } }
}'
```

### Example API Response

The condensed response below shows routes for both vehicles. All 6 jobs are assigned (_"unassigned": 0_). Inline comments flag each stop's violation status. Both routes carry a `penalty.min_stop_load` value:

```json
{
  "description": "Min Stop Load Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1662,
      "routes": 2,
      "unassigned": 0,
      "duration": 1662,
      "distance": 14532
    },
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 643,
        "steps": [
          { "type": "start", "depot": "Depot 1", "load": [400], "distance": 0 },
          { "type": "job", "id": "Job 6", "load": [100], "distance": 3840 }, // delivery=300, ok
          { "type": "job", "id": "Job 5", "load": [0], "distance": 6018 }, // delivery=100 < 150
          { "type": "end", "load": [0], "distance": 6018 }
        ],
        "delivery": [400],
        "distance": 6018,
        "penalty": { "min_stop_load": 400 }
        // 1 violation: Job 5 (shortfall 50 x unit_penalty 2) + fixed_penalty 300 = 400
      },
      {
        "vehicle": "Vehicle 2",
        "cost": 1019,
        "steps": [
          { "type": "start", "depot": "Depot 1", "load": [450], "distance": 0 },
          { "type": "job", "id": "Job 1", "load": [400], "distance": 3497 }, // delivery=50  < 150
          { "type": "job", "id": "Job 2", "load": [350], "distance": 4746 }, // delivery=50  < 150
          { "type": "job", "id": "Job 3", "load": [210], "distance": 6863 }, // delivery=140 < 150
          { "type": "job", "id": "Job 4", "load": [0], "distance": 8514 }, // delivery=210, ok
          { "type": "end", "load": [0], "distance": 8514 }
        ],
        "delivery": [450],
        "distance": 8514,
        "penalty": { "min_stop_load": 830 }
        // 3 violations: (100x3)+(100x3)+(10x3) = 630 unit + 200 fixed = 830
      }
    ]
  },
  "status": "Ok"
}
```

## Interpreting the Output

To evaluate Min Stop Load compliance, compare each stop's delivery load against the vehicle's `min_stop_load` threshold. The route-level `penalty.min_stop_load` field reports the total penalty accumulated across all violating stops. Its absence would confirm all stops met the threshold.

### Stop-by-Stop Violation Summary

The table below shows each job's delivery load, whether it falls below the 150-unit threshold, the calculated shortfall, and which vehicle it was assigned to:

| Job   | Delivery Load | vs. Threshold (150) | Shortfall | Assigned To | Violation? |
| ----- | ------------- | ------------------- | --------- | ----------- | ---------- |
| Job 1 | 50            | Below               | 100       | Vehicle 2   | ⚠️ Yes     |
| Job 2 | 50            | Below               | 100       | Vehicle 2   | ⚠️ Yes     |
| Job 3 | 140           | Below               | 10        | Vehicle 2   | ⚠️ Yes     |
| Job 4 | 210           | Above               | \-        | Vehicle 2   | ✅ No      |
| Job 5 | 100           | Below               | 50        | Vehicle 1   | ⚠️ Yes     |
| Job 6 | 300           | Above               | \-        | Vehicle 1   | ✅ No      |

### Vehicle 1 Analysis

**Route:** Depot -> Job 6 -> Job 5 -> End

- Job 6 delivers 300 units - above the 150-unit threshold. No violation.
- Job 5 delivers 100 units - 50 units below the threshold. Unit penalty: 50 x 2 = 100.
- A Fixed penalty of 300 is triggered once because at least one stop violated the threshold.
- Total: 100 + 300 = 400. Matches _penalty.min_stop_load: 400_ in the response.

### Vehicle 2 Analysis

**Route:** Depot -> Job 1 -> Job 2 -> Job 3 -> Job 4 -> End

- Job 1 delivers 50 units - shortfall 100. Unit penalty: 100 x 3 = 300.
- Job 2 delivers 50 units - shortfall 100. Unit penalty: 100 x 3 = 300.
- Job 3 delivers 140 units - shortfall 10. Unit penalty: 10 x 3 = 30.
- Job 4 delivers 210 units - above threshold. No violation.
- Fixed penalty of 200 triggered once (first violation on this route).
- Total unit penalties: 300 + 300 + 30 = 630. Plus fixed 200 = 830. Matches _"penalty.min_stop_load": 830_ in the response.

## What We Learned?

This example illustrates several important takeaways about how Min Stop Load behaves in practice:

- **Penalty configuration determines which vehicle absorbs light loads:** The optimizer assigned all three sub-threshold orders (Jobs 1, 2, 3) to Vehicle 2, whose lower fixed penalty made it the less costly choice for accumulating light stops. Fine-tuning the ratio of fixed to unit penalties per vehicle lets you control exactly which vehicles in your fleet take on inefficient assignments.
- **Fixed penalty acts as a route-level deterrent; unit penalty acts per stop:** A high fixed penalty makes any route containing even one light stop expensive, hence useful for protecting premium or high-cost vehicles from small orders entirely. A high unit penalty creates a proportional cost that scales with how far below the threshold the load is consequently, useful for steering borderline cases.
- **Soft constraints always guarantee full delivery coverage:** All 6 jobs were assigned despite multiple threshold violations (_"unassigned": 0_). Min Stop Load shapes the optimizer's preferences - it never blocks an assignment when fulfillment coverage requires it.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)'s Route Optimization API can solve seamlessly.
