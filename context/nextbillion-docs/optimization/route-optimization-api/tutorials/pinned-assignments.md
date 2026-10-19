# Pinned Assignments

## Why Does Pinned Assignments Matter?

Rout Optimizers are built to make cost-effective assignments across the fleet. However, sometimes when the business requires specific pairing between a task and a vehicle (eg: a contractual commitment to a client) leaving them to the optimizer's discretion is not acceptable. In such situations, operators rely on fragile workarounds (pre-assigning tasks, narrowing time windows etc) which can silently fail to honor real world constraints.

The Route Optimization API's **Pinned Assignment** feature provides a direct solution. By defining a `relations.type: pinned`, you can specify the tasks and the vehicle they must be assigned to. The optimizer then treats this as a non-negotiable assignment criteria: either the pinned tasks are assigned to the designated vehicle, or the entire optimization request fails.

## Use Case: Field Service Technician-Task Pairing

A field service company dispatches two technicians from a shared depot in Los Angeles to handle six service jobs across the city. Each job involves an equipment pickup from a customer site. Two of the six jobs - _Job 1_ and _Job 3_ - requires a specialist certification that only _Technician 2_ holds. As a result, the operations team has a contractual obligation to ensure these jobs are handled by _Technician 2_. If _Technician 2_ cannot complete them due to any other reason, the operators need to know immediately so they can reschedule, and not discover the problem after the fact from a misleading route plan.

The dispatch team wants the optimizer to:

- Guarantee _Job 1_ and _Job 3_ are assigned to _Technician 2_, without exception.
- Assign the remaining four jobs (2, 4, 5, 6) freely across both technicians based on routing efficiency.
- Fail the entire request immediately if _Technician 2_ cannot fulfil the pinned jobs.

Pinned Assignments feature delivers all three of these requirements simultaneously.

## How Pinned Assignments work?

Pinned Assignments is a **hard constraint** which is configured by setting `relations.type: pinned` and specifying a `relations.vehicle` to complete the pinned `relations.steps`. It **guarantees the assignment** of pinned tasks. It is worth highlighting that non-pinned tasks in the same request are still assigned freely by the optimizer. The pinned relation constrains only the designated steps on the designated vehicle and everything else is optimised normally.

Following are some more rules that govern the feature:

- **Specifying the vehicle is mandatory:** A pinned relation without a vehicle field is invalid and will return an error.
- **Steps cannot belong to multiple relations:** A step included in a pinned relation cannot also appear in any other `relations.type`.
- **Pinning does not enforce sequence:** Pinned steps are guaranteed to be assigned to the designated vehicle, but the optimizer decides the order in which they are served.
- **Cost and penalty overrides:** The pin takes absolute precedence over all optimisation objectives and the optimizer cannot leave pinned steps unassigned.

**There is no partial success for pinned steps** If any pinned step cannot be assigned to its designated vehicle, the entire optimization request fails. Hence, verify carefully the designated vehicle's capacity, time window, and physical reach before submitting.

## Configuring the Feature: Input Parameters

Pinned Assignment is configured entirely within the top-level `relations` array of the request. The table below summarises all required fields:

| Parameter             | Type / Location              | Description                                                                                                                                      |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `relations[].type`    | string (relation)            | Set to "pinned" to activate the Pinned Assignment type.                                                                                          |
| `relations[].vehicle` | string \| integer (relation) | The ID of the vehicle to which the steps must be assigned. Mandatory when type is "pinned".                                                      |
| `relations[].steps`   | array of objects (relation)  | The list of tasks to pin to the specified vehicle. Each step object contains a type ("job", "pickup", "delivery") and the corresponding task ID. |

**Pin all related steps in a single relation:** If multiple steps must go to the same vehicle, it is recommended to include all of them in a single pinned relation rather than creating separate relations per step.

## Example API Request & Response

### Example API Request

The request below sets up two technicians, six pickup jobs, and a single pinned relation that locks _Job 1_ and _Job 3_ to _Technician 2_:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Pinned Assignment Example",
  "locations": {
    "id": 1,
    "location": [
      "34.06719484,-118.29932683",   // index 0 – Shared depot
      "34.05315973,-118.30890749",   // index 1 – Job 1
      "34.04580248,-118.28168441",   // index 2 – Job 2
      "34.04125227,-118.24920365",   // index 3 – Job 3
      "34.02450155,-118.30902433",   // index 4 – Job 4
      "34.06467837,-118.26602821",   // index 5 – Job 5
      "34.05190130,-118.27233743"    // index 6 – Job 6
    ]
  },
  "jobs": [
    { "id": "Job 1", "location_index": 1, "service": 900,  "pickup": [5]  },
    { "id": "Job 2", "location_index": 2, "service": 1200, "pickup": [10] },
    { "id": "Job 3", "location_index": 3, "service": 600,  "pickup": [5]  },
    { "id": "Job 4", "location_index": 4, "service": 900,  "pickup": [10] },
    { "id": "Job 5", "location_index": 5, "service": 600,  "pickup": [5]  },
    { "id": "Job 6", "location_index": 6, "service": 1500, "pickup": [5]  }
  ],
  "vehicles": [
    { "id": "Technician 1", "start_index": 0, "end_index": 0, "capacity": [20] },
    { "id": "Technician 2", "start_index": 0, "end_index": 0, "capacity": [20] }
  ],
  "relations": [
    {
      "type":    "pinned",        // activates Pinned Relation
      "vehicle": "Technician 2", // mandatory: target vehicle
      "steps": [
        { "type": "job", "id": "Job 1" }, // pinned to Technician 2
        { "type": "job", "id": "Job 3" }  // pinned to Technician 2
      ]
    }
  ],
  "options": { "routing": { "mode": "4w" } }
}'
```

### Example API Response

The condensed response below shows routes for both technicians. All 6 jobs are assigned (`unassigned: 0`). Inline comments confirm which steps are pinned and which are freely assigned:

```json
{
  "description": "Pinned Assignment Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 4375,
      "routes": 2,
      "unassigned": 0,
      "service": 5700,
      "duration": 4375,
      "distance": 31478
    },
    "routes": [
      {
        "vehicle": "Technician 1",
        "cost": 1766,
        "steps": [
          { "type": "start", "location_index": 0, "load": [0], "distance": 0 },
          { "type": "job", "id": "Job 5", "load": [5], "distance": 3693 }, // freely assigned
          { "type": "job", "id": "Job 6", "load": [10], "distance": 5366 }, // freely assigned
          { "type": "job", "id": "Job 2", "load": [20], "distance": 6776 }, // freely assigned
          { "type": "end", "load": [20], "distance": 10856 }
        ],
        "pickup": [20],
        "distance": 10856
      },
      {
        "vehicle": "Technician 2",
        "cost": 2609,
        "steps": [
          { "type": "start", "location_index": 0, "load": [0], "distance": 0 },
          { "type": "job", "id": "Job 1", "load": [5], "distance": 2710 }, // pinned
          { "type": "job", "id": "Job 4", "load": [15], "distance": 5953 }, // freely interleaved
          { "type": "job", "id": "Job 3", "load": [20], "distance": 13693 }, // pinned
          { "type": "end", "load": [20], "distance": 20622 }
        ],
        "pickup": [20],
        "distance": 20622
      }
    ]
  },
  "status": "Ok"
}
```

## Interpreting the Output

To verify a pinned relation in the response, check the route for the designated vehicle and confirm that all pinned steps appear in its `steps` array. If the request succeeded, all pinned steps are guaranteed to be on the designated vehicle.

The table below shows the complete assignment across both technicians:

| Vehicle      | Stop  | Pinned? |
| ------------ | ----- | ------- |
| Technician 1 | Job 5 | No      |
| Technician 1 | Job 6 | No      |
| Technician 1 | Job 2 | No      |
| Technician 2 | Job 1 | ✅ Yes  |
| Technician 2 | Job 4 | No      |
| Technician 2 | Job 3 | ✅ Yes  |

### Technician 1 Analysis

**Route:** Depot → Job 5 → Job 6 → Job 2 → End

- All three jobs are freely assigned since there were no pinned constraint for _Technician 1_.
- Neither _Job 1_ nor _Job 3_ appears on _Technician 1_'s route, meaning the optimizer successfully prevents their assignment to the wrong vehicle.

### Technician 2 Analysis

**Route:** Depot → Job 1 → Job 4 → Job 3 → End

- _Job 1_ (pinned) appears as the first stop as part of guaranteed assignment for _Technician 2_.
- _Job 4_ is a freely assigned job that the optimizer interleaved between the two pinned steps. Its placement between _Job 1_ and _Job 3_ is purely route-efficiency driven
- _Job 3_ (pinned) appears as the third stop as part of guaranteed assignment for _Technician 2_.

## What We Learned

This example illustrates several important takeaways about how Pinned Assignments behaves in practice:

- **Pinning guarantees assignment:** This is the defining characteristic that separates a pinned assignment relation from other relation types. Use it when partial success is operationally unacceptable (contractual obligations, certified technician requirements etc).
- **Pinning controls vehicle assignment, not stop sequence:** The optimizer remains free to determine when and in what order pinned steps are served on the designated vehicle. _Job 4_, an unpinned task, was interleaved between _Job 1_ and _Job 3_ on _Technician 2_'s route.
- **Pinned vehicles can receive freely assigned tasks:** Pinning a set of `steps` does not lock the vehicle to only those steps. The optimizer can assign non-pinned tasks if it is efficient to do so.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)’s Route Optimization API can solve seamlessly.
