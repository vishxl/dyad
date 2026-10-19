# LIFO Ordered Deliveries

## Why Does Cargo Loading Sequence Matter?

A route optimizer working purely on distance and time will sequence pickups and deliveries to minimise travel, but it has no awareness of how cargo is physically stacked inside the vehicle. In many freight and logistics operations, this creates a real-world problem - the driver arrives at a delivery stop only to find that the required cargo is buried under several other shipments loaded later. Unloading and reloading takes time, risks damaging cargo, and undermines the efficiency the optimized route was supposed to deliver.

The Route Optimization API's `follow_lifo_order` feature solves this by encoding the physical loading constraint directly into the route plan. When LIFO is set on a task, the optimizer treats the truck bed as a stack i.e. the last shipment loaded must be the first one unloaded. The resulting route respects this physical reality, eliminating the need for mid-route cargo reshuffling.

## Use Case: Multi-Stop Freight Collection and Delivery

A freight operator dispatches a single truck from a central depot in Las Vegas to handle four shipments, each involving a pickup from one location and a delivery to another. The truck has a capacity of 50 units and each shipment load is 10 units.

Because the truck is loaded from the rear and unloaded from the front, the last item loaded must always be the first item delivered. The operator sets `follow_lifo_order: true` on all four shipments to ensure the optimizer produces a route that respects this constraint.

## How LIFO Ordering Works?

When `follow_lifo_order: true` is set on a task, the optimizer models the vehicle's cargo hold as a stack. At every point in the route, the most recently picked-up LIFO shipment must be delivered before any earlier-loaded LIFO shipments can be unloaded. This mirrors the physical reality of rear-loaded vehicles where cargo access is strictly sequential. Tasks without this flag are not subject to the constraint and can be sequenced freely alongside LIFO tasks.

LIFO Ordering acts as a **hard constraint**. The optimizer will only generate routes where deliveries respect the physical stack order of pickups. This may result in routes that are longer in distance or duration compared to an unconstrained plan, because geographic efficiency must sometimes be sacrificed to honour the loading sequence. If some LIFO tasks are infeasible, they might be left unassigned.

**Concurrent pickups are permitted:** Multiple LIFO shipments can be picked up consecutively before any deliveries are made, as long as their deliveries follow the reverse order of their pickups.

## Configuring the Feature: Input Parameters

Follow LIFO Order requires a single boolean field added to each task that should participate in the loading sequence constraint:

| Parameter           | Type / Location | Description                                                                                                                                                             |
| ------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `follow_lifo_order` | boolean         | When set to true, the optimizer ensures that the cargo for this task is delivered in last-in, first-out order relative to other LIFO-enabled tasks on the same vehicle. |

## Example API Request & Response

### Example API Request

The request below sets up a single truck with four LIFO-enabled shipments across Las Vegas. All four shipments have `follow_lifo_order: true`, and each has a 300-second service time at both pickup and delivery:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "LIFO Order Example",
  "locations": {
    "id": 1,
    "location": [
      "36.15944795,-115.20659211",            // index 0 - Depot 1
      "36.16568350874093,-115.23738137291211", // index 1 - Shipment 1 pickup
      "36.15918738490483,-115.24306768034586", // index 2 - Shipment 1 delivery
      "36.16653558,-115.25079129",             // index 3 - Shipment 2 pickup
      "36.15926628,-115.26173001",             // index 4 - Shipment 2 delivery
      "36.14406466,-115.23069975",             // index 5 - Shipment 3 pickup
      "36.15171485,-115.24091363",             // index 6 - Shipment 3 delivery
      "36.14445666,-115.21117027",             // index 7 - Shipment 4 pickup
      "36.12922943,-115.22146389"              // index 8 - Shipment 4 delivery
    ]
  },
  "depots": [{ "id": "Depot 1", "location_index": 0 }],
  "vehicles": [
    {
      "id": "Truck 1",
      "start_depot_ids": ["Depot 1"],
      "end_depot_ids":   ["Depot 1"],
      "capacity": [50]
    }
  ],
  "shipments": [
    {
      "follow_lifo_order": true,
      "pickup":   { "id": "Pickup 1", "service": 300, "location_index": 1 },
      "delivery": { "id": "Delivery 1", "service": 300, "location_index": 2 },
      "amount": [10]
    },
    {
      "follow_lifo_order": true,
      "pickup":   { "id": "Pickup 2", "service": 300, "location_index": 3 },
      "delivery": { "id": "Delivery 2", "service": 300, "location_index": 4 },
      "amount": [10]
    },
    {
      "follow_lifo_order": true,
      "pickup":   { "id": "Pickup 3", "service": 300, "location_index": 5 },
      "delivery": { "id": "Delivery 3", "service": 300, "location_index": 6 },
      "amount": [10]
    },
    {
      "follow_lifo_order": true,
      "pickup":   { "id": "Pickup 4", "service": 300, "location_index": 7 },
      "delivery": { "id": "Delivery 4", "service": 300, "location_index": 8 },
      "amount": [10]
    }
  ],
  "options": { "routing": { "mode": "car" } }
}'
```

### Example API Response

The condensed response shows the single route for Truck 1. All 4 shipments are assigned (`unassigned: 0`). Inline comments track the LIFO stack state at each step:

```json
{
  "description": "LIFO Order Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 2157,
      "routes": 1,
      "unassigned": 0,
      "service": 2400,
      "duration": 2157,
      "distance": 26212
    },
    "routes": [
      {
        "vehicle": "Truck 1",
        "cost": 2157,
        "steps": [
          { "type": "start", "depot": "Depot 1", "load": [0], "distance": 0 },
          {
            "type": "pickup",
            "id": "Pickup 4",
            "load": [10],
            "distance": 2553
          }, // stack: [Shipment 4]
          {
            "type": "delivery",
            "id": "Delivery 4",
            "load": [0],
            "distance": 5619
          }, // stack: []
          {
            "type": "pickup",
            "id": "Pickup 3",
            "load": [10],
            "distance": 8319
          }, // stack: [Shipment 3]
          {
            "type": "delivery",
            "id": "Delivery 3",
            "load": [0],
            "distance": 10705
          }, // stack: []
          {
            "type": "pickup",
            "id": "Pickup 2",
            "load": [10],
            "distance": 13224
          }, // stack: [Shipment 2]
          {
            "type": "pickup",
            "id": "Pickup 1",
            "load": [20],
            "distance": 14514
          }, // stack: [Shipment 2, Shipment 1]
          {
            "type": "delivery",
            "id": "Delivery 1",
            "load": [10],
            "distance": 15763
          }, // stack: [Shipment 2]  <- 1 last in, first out
          {
            "type": "delivery",
            "id": "Delivery 2",
            "load": [0],
            "distance": 17458
          }, // stack: []
          { "type": "end", "depot": "Depot 1", "load": [0], "distance": 26212 }
        ],
        "service": 2400,
        "duration": 2157,
        "distance": 26212
      }
    ]
  },
  "status": "Ok"
}
```

## Interpreting the Output

To verify LIFO compliance, trace the sequence of pickups and deliveries. A valid LIFO route will never deliver a shipment that is not currently at the top of the stack.

The table below walks through every step of Truck 1's route, showing the load at each step and the resulting LIFO stack state:

| #   | Step Type     | Load After | LIFO Stack State                                                |
| --- | ------------- | ---------- | --------------------------------------------------------------- |
| 1   | Start (Depot) | \[0\]      | \[ \] empty                                                     |
| 2   | Pickup 4      | \[10\]     | \[ Shipment 4 \]                                                |
| 3   | Delivery 4    | \[0\]      | \[ \] Shipment 4 unloaded                                       |
| 4   | Pickup 3      | \[10\]     | \[ Shipment 3 \]                                                |
| 5   | Delivery 3    | \[0\]      | \[ \] Shipment 4 unloaded                                       |
| 6   | Pickup 2      | \[10\]     | \[ Shipment 2 \]                                                |
| 7   | Pickup 1      | \[20\]     | \[ Shipment 2, Shipment 1 \] 1 loaded on top of 2               |
| 8   | Delivery 1    | \[10\]     | \[ Shipment 2 \] Shipment 1 unloaded first (last in, first out) |
| 9   | Delivery 2    | \[0\]      | \[ \] Shipment 2 now on top, unloaded                           |
| 10  | End           | \[0\]      | \[ \] empty                                                     |

The route breaks naturally into three LIFO patterns:

- **Simple pair - Shipment 4:** Picked up immediately and delivered before any other shipment is loaded.
- **Simple pair - Shipment 3:** Same pattern - picked up and delivered before the next batch begins.
- **Nested pair - Shipments 2 and 1:** Shipment 2 is picked up first, then Shipment 1 is loaded on top (stack depth 2). Because Shipment 1 was last in, it is delivered first and then shipment 2 is now on top and delivered next. This is the classic LIFO nested pattern.

## What We Learned?

This example illustrates several important takeaways about how LIFO Ordering behaves in practice:

- **LIFO converts a physical loading constraint into a routing constraint:** Without it, the optimizer produces routes that are efficient on paper but can require mid-route cargo reshuffling. With it, the route plan is directly executable.
- **Concurrent pickups are valid as long as deliveries reverse the loading order:** The optimizer is not restricted to strict alternating pickup-delivery pairs. It can group pickups together (as seen with Shipments 2 and 1) as long as the resulting delivery sequence respects the LIFO stack.
- **Non-LIFO tasks are not affected:** Tasks without `follow_lifo_order: true` are sequenced freely by the optimizer. You can mix LIFO-constrained and unconstrained tasks on the same vehicle within the same request.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)'s Route Optimization API can solve seamlessly.
