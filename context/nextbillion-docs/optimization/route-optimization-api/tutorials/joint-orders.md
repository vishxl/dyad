# Joint Orders

## Why Are Joint Orders?

Some real-world service tasks are operationally inseparable, such as a parts delivery and equipment pickup, or a multi-technician job (e.g., installation and configuration). These dependent tasks must be scheduled together. Without a mechanism to express this dependency, a route optimizer treats each task independently, potentially scheduling only one part of a related group, leading to an invalid and uncoordinated route plan.

The Route Optimization API's **Joint Orders** feature solves this directly. By assigning a shared `joint_order` ID to a group of tasks, you instruct the optimizer to treat them as a single atomic unit: _either all tasks in the group are assigned, or none are_. Each task in the group is served by a different vehicle, allowing coordinated multi-resource dispatch, with no constraints on the sequence in which the tasks are fulfilled.

## Use Case: Multi-Technician Field Service Dispatch

Consider a field service company which operates two trucks out of a central depot in Las Vegas. Today's job list includes a mix of equipment deliveries, parts pickups, and combined service calls that require coordination between both trucks. Some of today's jobs are grouped because they form part of the same service call:

- **Group 1**: Job 1 (equipment delivery to site A) and Job 2 (parts pickup from site B). Both must happen today for the client's on-site work to proceed.
- **Group 2**: Job 3 (installation delivery to site C) and Job 6 (collection pickup from site D). The client requires both visits to be completed on the same day.
- **Group 3**: Job 7, Job 8, and Job 9. Three tasks that must be co-dispatched.
- **Standalone**: Job 4 (independent pickup) and Job 5 (independent delivery). These have no joint order constraint and are assigned freely.

With only two trucks available, the optimizer must decide which groups can be fulfilled and which must be dropped in their entirety - this is exactly where Joint Orders earns its value.

## How Joint Orders Work?

Joint Orders are defined by adding a `joint_order` field to any `job` or `shipment` object in the request. The value is a positive integer that serves as the group identifier and any tasks sharing the same `joint_order` value are part of the same group.

Three rules govern how joint order groups are planned:

- **All or nothing:** Every task in the group must be assigned for any task in the group to be assigned. If one task cannot be accommodated, the whole group is dropped.
- **One vehicle per task:** Each task in the group is served by a different vehicle. A single vehicle cannot serve two tasks from the same joint order group.
- **Any sequence:** Tasks within a group can be completed in any order and at any time during the planning horizon. There is no requirement for tasks in the same group to be served simultaneously or in a specific sequence.

**Important: Joint Orders is a hard constraint**: If a group cannot be fully assigned, all its tasks are unassigned. Plan fleet size and capacity accordingly when using large joint order groups.

## Configuring the Feature: Input Parameters

Joint Orders require only a single field, added to the task definition:

| Parameter     | Type    | Description                                                                                     |
| ------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `joint_order` | integer | A unique group ID. All tasks sharing the same `joint_order` value are treated as a single unit. |

In the field service example above, nine jobs are organised into three joint order groups and two standalone tasks as follows:

| Group ID         | Tasks               | Task Types                   | Vehicles Required      | Outcome                    |
| ---------------- | ------------------- | ---------------------------- | ---------------------- | -------------------------- |
| `joint_order: 1` | Job 1, Job 2        | Delivery + Pickup            | 2 (one per task)       | ✅ fully assigned          |
| `joint_order: 2` | Job 3, Job 6        | Delivery + Pickup            | 2 (one per task)       | ✅ fully assigned          |
| `joint_order: 3` | Job 7, Job 8, Job 9 | Delivery + Delivery + Pickup | 3 (one per task)       | ❌ entire group unassigned |
| Standalone       | Job 4, Job 5        | Pickup + Delivery            | Assigned independently | ✅ both assigned           |

## Example API Request & Response

### Example API Request

The request below sets up Depot 1, two trucks, and nine jobs across three joint order groups and two standalone tasks:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Joint Orders Example",
  "locations": {
    "id": 1,
    "location": [
      "36.15944795,-115.20659211",
      "36.16568350874093,-115.23738137291211",
      "36.15918738490483,-115.24306768034586",
      "36.16653558,-115.25079129",
      "36.15926628,-115.26173001",
      "36.14406466,-115.23069975",
      "36.15171485,-115.24091363",
      "36.14445666,-115.21117027",
      "36.12922943,-115.22146389",
      "36.12906480,-115.25601377"
    ]
  },
  "depots": [{ "id": "Depot 1", "location_index": 0 }],
  "jobs": [
    { "id": "Job 1", "location_index": 1, "joint_order": 1, "delivery": [1] },
    { "id": "Job 2", "location_index": 2, "joint_order": 1, "pickup":   [1] },
    { "id": "Job 3", "location_index": 3, "joint_order": 2, "delivery": [1] },
    { "id": "Job 4", "location_index": 4,                    "pickup":   [1] },
    { "id": "Job 5", "location_index": 5,                    "delivery": [1] },
    { "id": "Job 6", "location_index": 6, "joint_order": 2, "pickup":   [1] },
    { "id": "Job 7", "location_index": 7, "joint_order": 3, "delivery": [1] },
    { "id": "Job 8", "location_index": 8, "joint_order": 3, "delivery": [1] },
    { "id": "Job 9", "location_index": 9, "joint_order": 3, "pickup":   [1] }
  ],
  "vehicles": [
    { "id": 1, "description": "Truck 1", "start_depot_ids": ["Depot 1"], "capacity": [12] },
    { "id": 2, "description": "Truck 2", "start_depot_ids": ["Depot 1"], "capacity": [12] }
  ],
  "options": { "routing": { "mode": "truck" } }
}'
```

### Example API Response

The condensed response shows routes for both trucks. Group 3 (Jobs 7, 8, 9) is entirely unassigned because it requires 3 vehicles but only 2 are available. Groups 1 and 2 are fully assigned across both trucks. Standalone Jobs 4 and 5 are assigned independently:

```json
{
  "description": "Joint Orders Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1604,
      "routes": 2,
      "unassigned": 3,
      "duration": 1604,
      "distance": 15958
    },
    "unassigned": [
      { "id": "Job 7", "type": "job", "reason": "unknown" }, // group 3
      { "id": "Job 8", "type": "job", "reason": "unknown" }, // group 3
      { "id": "Job 9", "type": "job", "reason": "unknown" } // group 3 -> entire group dropped
    ],
    "routes": [
      {
        "vehicle": 1,
        "description": "Truck 1",
        "cost": 847,
        "steps": [
          { "type": "start", "depot": "Depot 1", "load": [2], "distance": 0 },
          { "type": "job", "id": "Job 5", "load": [1], "distance": 4002 }, // standalone delivery
          { "type": "job", "id": "Job 6", "load": [2], "distance": 6388 }, // group 2 pickup
          { "type": "job", "id": "Job 1", "load": [1], "distance": 8927 }, // group 1 delivery
          { "type": "end", "load": [1], "distance": 8927 }
        ],
        "delivery": [2],
        "pickup": [1],
        "distance": 8927
      },
      {
        "vehicle": 2,
        "description": "Truck 2",
        "cost": 757,
        "steps": [
          { "type": "start", "depot": "Depot 1", "load": [1], "distance": 0 },
          { "type": "job", "id": "Job 2", "load": [2], "distance": 3313 }, // group 1 pickup
          { "type": "job", "id": "Job 4", "load": [3], "distance": 5008 }, // standalone pickup
          { "type": "job", "id": "Job 3", "load": [2], "distance": 7031 }, // group 2 delivery
          { "type": "end", "load": [2], "distance": 7031 }
        ],
        "delivery": [1],
        "pickup": [2],
        "distance": 7031
      }
    ]
  },
  "status": "Ok"
}
```

## Interpreting the Output

To verify joint order behaviour in the response, check the `unassigned` array for any dropped tasks, and the step sequences in each route to confirm that tasks from the same group appear on **different vehicles**. Note that Group 3 (Jobs 7, 8, and 9) is fully unassigned. This is because the group requires 3 unique vehicles - one per task - but only 2 trucks are available. Since the all-or-nothing rule applies, none of the three tasks can be partially assigned. Adding a third vehicle to the fleet would allow this group to be fulfilled.

### Truck 1 (Vehicle 1) Analysis

**Route:** Depot -> Job 5 -> Job 6 -> Job 1 -> End

- Job 5 is a standalone delivery. No group constraint; assigned freely based on routing efficiency.
- Job 6 is a pickup belonging to Group 2. The other task from Group 2, Job 3 is not done by Truck 2.
- Job 1 is a delivery (1 unit) belonging to Group 1. The other task from Group 2, Job 2 is done by Truck 2.

### Truck 2 (Vehicle 2) Analysis

**Route:** Depot -> Job 2 -> Job 4 -> Job 3 -> End

- Job 2 is a pickup belonging to Group 1. Paired with Job 1 on Truck 1 to complete the group.
- Job 4 is a standalone pickup. No group constraint; assigned independently.
- Job 3 is a delivery belonging to Group 2. Paired with Job 6 on Truck 1 to complete the group.

## What We Learned?

This example illustrates several important takeaways about how Joint Orders behaves in practice:

- **Joint Orders is a hard constraint:** If a group cannot be fully assigned, every task in the group is dropped. This makes fleet sizing relative to group size a critical planning input.
- **Each task in a group occupies a unique vehicle:** A group of N tasks always requires N available vehicles. This behavior is what helps plan a coordinated multi-vehicle dispatch when all tasks in a group are guaranteed to be served. However, groups larger than the available fleet are always dropped entirely, as seen with Group 3 in this example.
- **Standalone tasks are planned alongside:** Tasks without a `joint_order` field (Jobs 4 and 5 in this example) are assigned freely alongside grouped tasks, filling route capacity efficiently without interfering with group constraints.

Explore other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that the [NextBillion.ai](http://NextBillion.ai)'s Route Optimization API can solve seamlessly.
