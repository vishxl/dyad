# Deadhead Distance & Duration

## What is Deadhead Travel?

In fleet operations, **deadhead travel** refers to the distance and time a vehicle travels without a passenger, cargo, or active task — essentially, empty running. This happens on two legs of every trip: the _first leg_ (from the depot or trip's starting location to the first task with zero load) and the _last leg_ (from the last task back to the depot or trip's end location with zero load).

Unconstrained deadhead travel inflates fuel costs, increases vehicle wear without generating any revenue to offset them, essentially reducing the productive utilisation of your fleet. For operations that span large geographies — field services, technician dispatch, NEMT, or last-mile logistics — small deadhead travels each day compound into significant operational costs over time.

The Route Optimization API's Deadhead Distance & Duration feature lets you set explicit limits on how much unloaded travel each vehicle is allowed to perform. The optimizer then factors these limits into the route-planning process, favouring assignments that keep deadhead within budget — without sacrificing overall service coverage.

## Use Case: Field Service Technician Dispatch

Consider a field service company managing a fleet of technicians across a metropolitan area. Each technician starts their shift from a designated location, visits multiple customer sites for repairs or appliance delivery, and ends their day either at a designated location or at the last task.

The operations team has identified that excessive empty driving — technicians travelling far before their first job or after their last — is eroding profitability and causing schedule overruns. They want the optimizer to generate routes where:

- Either the technician does not drive more than 1,000 metres unloaded to reach their first task.
- Or they do not drive more than 1,500 seconds unloaded after completing their last task.
- If a route unavoidably breaches these limits, then add penalty points. The solution with the fewest total penalty points is selected.

This is exactly the scenario the Deadhead Distance & Duration feature is built for.

## How do Deadhead limitations work?

Deadhead limits are implemented as a soft constraint in the optimizer. This means the optimizer will always produce a fully assigned solution — even if no route plan can satisfy the deadhead limits for every vehicle. In that scenario:

- The optimizer still assigns tasks to vehicles.
- Each violation of the deadhead limit adds a penalty score to the solution cost.
- The solution with the lowest total penalty score across all vehicles is chosen as the final output.

**Key Principle:** A higher penalty value means the optimizer treats that vehicle's deadhead limit more strictly. Set penalties proportional to the actual operational cost of empty travel for each vehicle or vehicle class.

### When Deadhead Is Calculated?

Only for the first and last legs of a trip where the vehicle is not carrying any load are counted towards the deadhead. Intermediate legs between tasks are not considered deadhead travel. The rules for which legs count depend on the job type:

| Task Type                                                  | First Leg (Depot → First Task)     | Last Leg (Last Task → Depot)       |
| ---------------------------------------------------------- | ---------------------------------- | ---------------------------------- |
| General (shipments / only service jobs)                    | ✅ Counted                         | ✅ Counted                         |
| At least one Delivery job (cargo loaded from start)        | ❌ Not counted (vehicle is loaded) | ✅ Counted                         |
| At lease one Pickup job (cargo in vehicle until trip ends) | ✅ Counted                         | ❌ Not counted (vehicle is loaded) |

**No start or end depot for a vehicle?** If a vehicle has no `start_index`, its first leg begins at the first task's location — so the deadhead for the first leg is zero. Likewise, if there is no `end_index`, the last leg ends at the last task's location and contributes zero deadhead.

## Configuring the Feature: Input Parameters

All deadhead parameters are set at the vehicle level. The table below summarises the four available fields:

| Parameter                         | Type              | Description                                                                                                                                           |
| --------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_deadhead_distance`           | integer (metres)  | Maximum deadhead distance allowed per vehicle trip (first + last leg combined, where applicable).                                                     |
| `max_deadhead_duration`           | integer (seconds) | Maximum deadhead duration allowed per vehicle trip.                                                                                                   |
| `costs.deadhead_distance_penalty` | integer           | Penalty score added per unit of deadhead distance that exceeds the specified limit. Higher values push the optimizer harder to stay within the limit. |
| `costs.deadhead_duration_penalty` | integer           | Penalty score added per unit of deadhead duration that exceeds the specified limit. Higher values push the optimizer harder to stay within the limit. |

In the field service example above, the two vehicles are configured as follows:

| Vehicle   | Max Deadhead Dist. | Max Deadhead Dur. | Distance Penalty | Duration Penalty |
| --------- | ------------------ | ----------------- | ---------------- | ---------------- |
| Vehicle 1 | 1,000 m            | \-                | 1,000 / unit     | \-               |
| Vehicle 2 | \-                 | 1,500 s           | \-               | 2,000 / unit     |

## Example API Request & Response

### Example API Request

The request below sets up two technician vehicles with different deadhead budgets and penalty costs, serving a mix of service tasks and shipments across Los Angeles:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Deadhead Example",
  "locations": {
    "id": 1,
    "location": [
      "34.03989791,-118.32869323",
      "34.04838488,-118.32637461",
      "34.04066772,-118.26346942",
      "34.01068455,-118.30956348",
      "33.99659970,-118.25596977",
      "33.96721245,-118.30467590",
      "33.96778674,-118.27044123",
      "33.95908514,-118.31902284",
      "33.97900243,-118.32246870"
    ]
  },
  "jobs": [
    {
      "id": 1,
      "description": "Task 1",
      "location_index": 1,
      "service": 300,
      "time_windows": [[1774431300,1774433100]]
    }
  ],
  "shipments": [
    {
      "pickup": {
        "id": "Shipment Pickup 1",
        "location_index": 2,
        "time_windows": [[1774433400,1774434300]]
      },
      "delivery": {
        "id": "Shipment Delivery 1",
        "location_index": 3,
        "time_windows": [[1774435500,1774436400]]
      },
      "amount": [
        10
      ]
    },
    {
      "pickup": {
        "id": "Shipment Pickup 2",
        "location_index": 4,
        "time_windows": [[1774431300,1774433100]]
      },
      "delivery": {
        "id": "Shipment Delivery 2",
        "location_index": 5
      },
      "amount": [
        10
      ]
    },
    {
      "pickup": {
        "id": "Shipment Pickup 3",
        "location_index": 6,
        "time_windows": [[1774433400,1774434300]]
      },
      "delivery": {
        "id": "Shipment Delivery 3",
        "location_index": 7,
        "time_windows": [[1774435500,1774436400]]
      },
      "amount": [
        10
      ]
    }
  ],
  "vehicles": [
    {
      "id": "Vehicle 1",
      "start_index": 0,
      "max_deadhead_distance": 1000,
      "capacity": [
        10
      ],
      "costs": {
        "deadhead_distance_penalty": 1000
      },
      "time_window": [1774429200,1774436400]
    },
    {
      "id": "Vehicle 2",
      "end_index": 8,
      "max_deadhead_duration": 1500,
      "capacity": [
        10
      ],
      "costs": {
        "deadhead_duration_penalty": 2000
      },
      "time_window": [1774429200,1774436400]
    }
  ],
  "options": {
    "routing": {
      "mode": "car"
    }
  }
}'
```

### Example API Response

The condensed response below shows the routes generated for both vehicles. All tasks are assigned (_”unassigned”: 0_). Note the `penalty.deadhead` field on _Vehicle 1_'s route — this signals a deadhead constraint violation:

```json
{
  "description": "Deadhead Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 3650,  "routes": 2,  "unassigned": 0,
      "service": 300,  "duration": 3650,  "distance": 36413
    },
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 1447,
        "steps": [
          { "type": "start",    "location_index": 0, "distance": 0,     "duration": 0    },
          { "type": "job",      "id": 1, "description": "Task 1",
                                "location_index": 1, "distance": 1257,  "duration": 168  },
          { "type": "pickup",   "id": "Shipment Pickup 1",
                                "location_index": 2, "distance": 9278,  "duration": 832  },
          { "type": "delivery", "id": "Shipment Delivery 1",
                                "location_index": 3, "distance": 16824, "duration": 1447 },
          { "type": "end",      "location_index": 3, "distance": 16824, "duration": 1447 }
        ],
        "duration": 1447,  "distance": 16824,
        "penalty": { "deadhead": 257000 }        },
      {
        "vehicle": "Vehicle 2",
        "cost": 2203,
        "steps": [
          { "type": "start",    "location_index": 0, "distance": 0,     "duration": 0    },
          { "type": "pickup",   "id": "Shipment Pickup 2",
                                "location_index": 4, "distance": 7814,  "duration": 0    },
          { "type": "delivery", "id": "Shipment Delivery 2",
                                "location_index": 5, "distance": 11402, "duration": 799  },
          { "type": "pickup",   "id": "Shipment Pickup 3",
                                "location_index": 6, "distance": 16834, "duration": 1262 },
          { "type": "delivery", "id": "Shipment Delivery 3",
                                "location_index": 7, "distance": 19589, "duration": 1875 },
          { "type": "end",      "location_index": 8, "distance": 19589, "duration": 2203 }
        ],
        "duration": 2203,  "distance": 19589
      }
    ]
  },
  "status": "Ok"
```

## Interpreting the Output

To understand deadhead impact, examine the first and last steps of each route — specifically the `distance` and `duration` values at those steps — and compare them against the vehicle's configured deadhead limits. The route-level `penalty.deadhead` field in the response is the definitive signal: if it is present, the constraint was breached; if absent, the vehicle's route satisfied its deadhead limits.

| Vehicle   | Deadhead Type | First-leg Deadhead     | Last-leg Deadhead                                       | Deadhead Total | Limit     | penalty.deadhead |
| --------- | ------------- | ---------------------- | ------------------------------------------------------- | -------------- | --------- | ---------------- |
| Vehicle 1 | Distance      | 1,257 m for _Task 1_   | 0 m (no end depot)                                      | 1,257 m        | 1,000 m   | 257,000 ⚠️       |
| Vehicle 2 | Duration      | 0 sec (no start depot) | 328 sec from _Shipment Delivery 3_ to the end location. | 328 s          | 1,500 sec | 0 ✅             |

### Vehicle 1 Analysis

**Route:** Depot → Task 1 → Shipment Pickup 1 → Shipment Delivery 1 → End

- The first task is a general service job (Task 1) — neither a delivery nor a pickup type. This means the first leg fully counts towards deadhead.
- First-leg distance from the start location (index 0) to Task 1 (index 1) = 1,257 m; exceeding the 1,000 m limit by 257 m.
- No `end_index` is defined, so the trip ends at the last task's location (_Shipment Delivery 1, location_index: 3_). Last-leg deadhead = 0 m.
- Total deadhead = 1,257 m. The response reports `penalty.deadhead: 257,000` i.e. the optimizer’s accumulated penalty cost for this violation.
- Despite the penalty, the optimizer assigned this route because it produced the lowest total penalty across the solution as a whole.

### Vehicle 2 Analysis

**Route:** Start → Shipment Pickup 2 → Shipment Delivery 2 → Shipment Pickup 3 → Shipment Delivery 3 → End depot

- _Vehicle 2_ has no `start_index` defined. Its trip effectively begins at the first task's location, so first-leg deadhead = 0 m.
- The route ends at a designated end location (index 8). The cumulative duration at the end step (2203 s) is 328 s more than the duration at the previous step (1875 s). Deadhead for last leg ≈ 328 s.
- Total deadhead = 328 s, while the deadhead limit is 1500 s. No `penalty.deadhead` field appears in the response since the deadhead constraint is fully satisfied.

## What We Learned?

This example illustrates several important takeaways about how the Deadhead Distance & Duration feature behaves in practice:

- **Task type determines which legs count.** Pickup and delivery jobs have specific exemptions — always account for your task mix when setting deadhead limits. As seen here in our example, _Task 1_ being a general job meant its first leg was fully counted.
- **Depot configuration shapes deadhead exposure.** Vehicles without a defined start or end depot automatically have zero deadhead on those respective legs.
- **Penalty scores are a tuning lever.** _Vehicle 2's_ higher penalty (2,000 vs. 1,000 for _Vehicle 1_) made its deadhead violations more costly to the optimizer. The optimizer therefore accepted the 257,000-point penalty on _Vehicle 1_ rather than forcing a comparable violation on _Vehicle 2_, demonstrating that penalty values directly influence which vehicle absorbs the trade-off when constraints cannot be fully met.
- **Soft constraints guarantee full coverage.** Unlike hard constraints that can leave tasks unassigned, deadhead limits as soft constraints ensure every task is served — violations are penalised, not blocked. In our example, the summary's `unassigned: 0` confirms that all tasks were successfully covered despite the _Vehicle 1_ violation.
- **Use penalty scores to audit violations programmatically**. The presence of a route-level `penalty.deadhead` value in response is the definitive indicator that a vehicle's deadhead limit was breached. Its absence, as with _Vehicle 2_ in this example, confirms the constraint was satisfied. Build this check into your solution validation logic.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)’s Route Optimization API can solve seamlessly.
