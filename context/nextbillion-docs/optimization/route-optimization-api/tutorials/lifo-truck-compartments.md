# LIFO Routing for Truck Compartments

## What is Compartment based LIFO routing?

Trucks used in any fleet where cargo types must not mix, like fuel tankers or refrigerated multi-zone vehicles, have **physically separate compartments** with each of them capable of holding distinct types of goods. When modelling such vehicles using NextBillion.ai's Route Optimization API using the compartment mode, the optimizer assigns jobs to specific compartments based on goods type, respects the physical capacity of each compartment, and when `compartment_lifo: true` is set, the optimizer also enforces a last-in, first-out loading sequence across compartments.

Compartment mode activates automatically when any vehicle in the request defines the `compartments` field. Once active, it applies globally to all vehicles and jobs in the request.

## Use Case: Multi-Product Fuel Tanker Delivery

A fuel distribution company operates tanker trucks that carry both petrol and diesel simultaneously in physically separated compartments. Each compartment can hold only one fuel type at a time and mixing products is not allowed. The truck must also unload in a defined sequence: the most accessible compartment must be emptied first, working towards the least accessible compartment.

The sample dispatch involves a single tanker loaded with 200 units of petrol and 600 units of diesel, serving five gas stations. The operations team needs the optimizer to:

- Assign petrol jobs exclusively to the petrol compartment and diesel jobs to diesel compartments.
- Respect the physical capacity of each compartment
- Sequence deliveries so that compartments are emptied in LIFO order with the most accessible compartment unloaded first.

This is exactly the scenario LIFO Compartment feature is designed for.

## Understanding Compartment Access Priority

The order of compartments in the `vehicles.compartments` array directly determines the LIFO unloading sequence. **Index 0 is the most accessible compartment and is always unloaded first.** Higher indices are progressively less accessible and are unloaded one after the other.

In our fuel tanker example, the three compartments map to the following access and unloading order:

| **Compartment Index** | **Capacity** | **Access Priority**         | **Goods Loaded**   |
| --------------------- | ------------ | --------------------------- | ------------------ |
| 0                     | 200 units    | Most accessible (first out) | Petrol — 200 units |
| 1                     | 100 units    | Middle                      | Diesel — 100 units |
| 2                     | 500 units    | Least accessible (last out) | Diesel — 500 units |

The optimizer uses this priority to sequence deliveries: petrol jobs (served from C0) are scheduled before diesel jobs served from C1, which in turn are scheduled before diesel jobs served from C2. This ensures the driver always accesses the physically correct compartment at each stop.

## Configuring Compartment Mode

The table below summarises all new and modified parameters introduced by LIFO Compartment:

| **Parameter**                      | **Type / Location** | **Description**                                                                                                                                                                       |
| ---------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vehicles.compartments`            | array of objects    | Defines the physical compartments of the vehicle. Array order sets access priority: index 0 is the most accessible (unloaded first in LIFO mode), last index is the least accessible. |
| `vehicles.compartments[].capacity` | integer             | Total capacity of this compartment.                                                                                                                                                   |
| `vehicles.compartment_lifo`        | boolean             | When true, enforces LIFO unloading order across compartments.                                                                                                                         |
| `jobs.goods_type`                  | string              | Identifier for the type of goods in this job. Jobs sharing the same goods_type can be assigned to the same compartment. A compartment cannot hold more than one goods type at a time. |
| `jobs.delivery` / `jobs.pickup`    | array\[integer\]    | In compartment mode, it must be a single-element array. The integer value specifies the amount of goods to deliver or pick up.                                                        |

## Compartment Mode: API Response Changes

The table below summarises the new and modified fields that appear in the response when compartment mode is active:

| **Response Field**                      | **Type**         | **Description**                                                                                                                                          |
| --------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes[].steps[].compartment_loads`    | array of objects | Per-compartment loading state after each step completes. One entry per compartment, always in compartment index order. Only present in compartment mode. |
| `compartment_loads[].compartment_index` | integer          | Index of this compartment, matching the vehicle's compartments array.                                                                                    |
| `compartment_loads[].goods_type`        | string           | The goods type currently in this compartment. `null` if the compartment is empty.                                                                        |
| `compartment_loads[].load`              | integer          | Remaining load in this compartment after the current `steps`.                                                                                            |
| `routes[].steps[].load`                 | array\[integer\] | In compartment mode, a single-element array showing the total load across all compartments after this step.                                              |

## Compartment Mode: Constraints and Rules

Compartment mode activates implicitly when any vehicle defines the `compartments` field. However, following restrictions apply across the entire request:

- All `vehicles` must define compartments. Mixing compartment-enabled and standard vehicles in the same request is not allowed.
- All `jobs` must use the same action type i.e. either all jobs are `delivery` type, or all are `pickup` type.
- Goods-to-compartment assignment is solver-determined. Users cannot pre-assign a goods type to a specific compartment.
- Shipments are not supported in this mode.
- Each job carries exactly one `goods_type`.
- A compartment can hold only one goods type at a time. Even if a compartment has remaining capacity after partial delivery, a different goods type cannot be loaded into it.
- If capacity constraints require, then a single `goods_type` can be shared across multiple compartments.
- In compartment mode, the effective vehicle capacity is derived entirely from the compartment capacities while any `capacities` or `alternative_capacities` configured **are ignored**.

## Example API Request & Response

### Example API Request

The request below configures a three-compartment fuel tanker and five delivery jobs with two fuel types:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "LIFO Fuel Delivery with Compartments",
  "locations": {
    "id": 1,
    "location": [
      "34.05756272,-118.30431094",  // index 0 – Depot / Fuel Terminal
      "34.05576927,-118.29156308",  // index 1 – Petrol Delivery 1
      "34.04734953,-118.28428717",  // index 2 – Petrol Delivery 2 & Diesel Delivery 1
      "34.04286445,-118.29150360",  // index 3 – Diesel Delivery 2
      "34.04346375,-118.30906936"   // index 4 – Diesel Delivery 3
    ]
  },
  "vehicles": [
    {
      "id": "Fuel Tanker 1",
      "start_index": 0,
      "end_index":   0,
      "compartment_lifo": true,
      "compartments": [
        { "capacity": 200 },   // index 0 – most accessible, unloaded first
        { "capacity": 100 },   // index 1
        { "capacity": 500 }    // index 2 – least accessible, unloaded last
      ],
      "capacity": [800]        // ignored in compartment mode
    }
  ],
  "jobs": [
    { "id": "Petrol Delivery 1", "location_index": 1, "goods_type": "petrol", "delivery": [100], "service": 600 },
    { "id": "Petrol Delivery 2", "location_index": 2, "goods_type": "petrol", "delivery": [100], "service": 600 },
    { "id": "Diesel Delivery 1", "location_index": 2, "goods_type": "diesel", "delivery": [100], "service": 600 },
    { "id": "Diesel Delivery 2", "location_index": 3, "goods_type": "diesel", "delivery": [300], "service": 600 },
    { "id": "Diesel Delivery 3", "location_index": 4, "goods_type": "diesel", "delivery": [200], "service": 600 }
  ],
  "options": {
    "objective": { "travel_cost": "distance" },
    "routing":   { "mode": "truck" }
  }
}'
```

### Example API Response

The condensed response shows the single route for _Fuel Tanker 1_. All 5 jobs are assigned. Each step includes a `compartment_loads` array showing the per-compartment state after that stop:

```json
{
  "description": "LIFO Fuel Delivery with Compartments",
  "result": {
    "code": 0,
    "summary": { "cost": 8302, "routes": 1, "unassigned": 0, "distance": 8302 },
    "routes": [
      {
        "vehicle": "Fuel Tanker 1",
        "cost": 8302,
        "steps": [
          {
            "type": "start",
            "load": [800],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": "petrol", "load": 200 },
              { "compartment_index": 1, "goods_type": "diesel", "load": 100 },
              { "compartment_index": 2, "goods_type": "diesel", "load": 500 }
            ]
          },
          {
            "type": "job",
            "id": "Petrol Delivery 1",
            "load": [700],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": "petrol", "load": 100 }, // -100 from C0
              { "compartment_index": 1, "goods_type": "diesel", "load": 100 },
              { "compartment_index": 2, "goods_type": "diesel", "load": 500 }
            ]
          },
          {
            "type": "job",
            "id": "Petrol Delivery 2",
            "load": [600],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": null, "load": 0 }, // C0 empty
              { "compartment_index": 1, "goods_type": "diesel", "load": 100 },
              { "compartment_index": 2, "goods_type": "diesel", "load": 500 }
            ]
          },
          {
            "type": "job",
            "id": "Diesel Delivery 1",
            "load": [500],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": null, "load": 0 },
              { "compartment_index": 1, "goods_type": null, "load": 0 }, // C1 empty (more accessible diesel)
              { "compartment_index": 2, "goods_type": "diesel", "load": 500 }
            ]
          },
          {
            "type": "job",
            "id": "Diesel Delivery 2",
            "load": [200],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": null, "load": 0 },
              { "compartment_index": 1, "goods_type": null, "load": 0 },
              { "compartment_index": 2, "goods_type": "diesel", "load": 200 } // 500-300=200
            ]
          },
          {
            "type": "job",
            "id": "Diesel Delivery 3",
            "load": [0],
            "compartment_loads": [
              { "compartment_index": 0, "goods_type": null, "load": 0 },
              { "compartment_index": 1, "goods_type": null, "load": 0 },
              { "compartment_index": 2, "goods_type": null, "load": 0 } // all empty
            ]
          },
          { "type": "end", "load": [0], "distance": 8302 }
        ],
        "delivery": [800],
        "distance": 8302
      }
    ]
  },
  "status": "Ok"
}
```

## Interpreting the Output

In compartment mode, use the `compartment_loads` array at each step to understand which goods are being delivered and from which compartment. The summary `load` field becomes a single-element array showing only the total remaining load across all compartments.

The table below traces the full route, showing the compartment state at every step:

| **#** | **Step**      | **Job**           | **Load** | **Distance** | **Compartment State After Step**                   |
| ----- | ------------- | ----------------- | -------- | ------------ | -------------------------------------------------- |
| 1     | Start (Depot) | —                 | \[800\]  | 0 m          | C0: petrol 200 \| C1: diesel 100 \| C2: diesel 500 |
| 2     | Job           | Petrol Delivery 1 | \[700\]  | 1,386 m      | C0: petrol 100 \| C1: diesel 100 \| C2: diesel 500 |
| 3     | Job           | Petrol Delivery 2 | \[600\]  | 3,038 m      | C0: null 0 \| C1: diesel 100 \| C2: diesel 500     |
| 4     | Job           | Diesel Delivery 1 | \[500\]  | 3,038 m      | C0: null 0 \| C1: null 0 \| C2: diesel 500         |
| 5     | Job           | Diesel Delivery 2 | \[200\]  | 4,282 m      | C0: null 0 \| C1: null 0 \| C2: diesel 200         |
| 6     | Job           | Diesel Delivery 3 | \[0\]    | 6,058 m      | C0: null 0 \| C1: null 0 \| C2: null 0             |
| 7     | End (Depot)   | —                 | \[0\]    | 8,302 m      | C0: null 0 \| C1: null 0 \| C2: null 0             |

Three patterns emerge from the route:

- **Petrol served from C0 first (steps 2–3):** Compartment 0 (the most accessible) holds all 200 units of petrol. Both petrol deliveries drain C0 in sequence, emptying it completely before any diesel is touched.
- **Diesel served from C1 before C2 (step 4):** Once petrol is exhausted, the optimizer moves to diesel. C1 (100 units, more accessible) is fully drained at the first diesel stop before C2 is touched, honouring the LIFO order across diesel compartments.
- **C2 drained across multiple stops (steps 5–6):** The remaining 500 units of diesel in C2 are delivered across two stops: 300 units at location 3 and 200 units at location 4.

Also note that _Petrol Delivery 2_ and _Diesel Delivery 1_ share the same physical stop and the optimizer consolidates both jobs at the same location while still respecting compartment isolation: petrol is drawn from C0 and diesel from C1 in two separate service operations.

## What We Learned

This example illustrates several important takeaways about how LIFO Compartment behaves in practice:

- **Compartment array order is the LIFO sequence:** The optimizer reads the compartments array as index 0 to be always unloaded first. Define compartments in the physical access order of your vehicle. Getting this order wrong will produce routes that are logistically incorrect.
- **Goods-type isolation is absolute:** A compartment that has been used for one goods type cannot accept a different goods type, even if it is partially empty. Plan compartment capacities to match the total volume of each goods type being carried.
- **Vehicle-level capacity is ignored in compartment mode:** Even if you specify a `capacity` on the vehicle, the optimizer derives effective capacity entirely from compartment capacities.
- **Compartment mode is all-or-nothing across the request:** Once any vehicle defines compartments, all vehicles must define compartments and all jobs must conform to compartment-mode rules specified above. You cannot selectively enable compartment mode for a subset of vehicles.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)'s Route Optimization API can solve seamlessly.
