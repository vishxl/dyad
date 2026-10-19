# Delivery Load Optimization - 3D Volume & Cargo Orientation

## Why is Cargo Orientation important?

When planning delivery routes, it’s not just about finding the shortest path or assigning the nearest driver—it’s also about making sure everything _actually fits_ in the vehicle. That’s where **volume and orientation-based capacity planning** comes into play. This feature goes beyond traditional weight or quantity-based capacity checks and looks at the actual dimensions of both the vehicle’s loading space and the cargo itself. It takes into account how items are oriented—can they be rotated, do they need to stay upright, or must they be loaded exactly as-is? This kind of 3D spatial awareness can make a big difference, especially in industries like furniture delivery, appliance logistics, moving services, retail distribution, and field service operations where the size and shape of items really matter. Whether you're delivering a couch, a set of fragile lab equipment, or oddly-shaped packages, using this feature helps optimize space, reduce failed deliveries due to misfit cargo, and cut down on the number of vehicles required.

Let’s take a look at a practical use-case below.

## Use Case: Cargo Orientation Based Optimization

In this example, we consider a furniture delivery operation involving a vehicle and three items of cargo, each with distinct dimensional and orientation constraints. Following are the **vehicle's carrying capacity** details:

- Compartment Dimensions (H x W x D) = 120 cm x 150 cm x 250 cm
- Cargo Compartment’s volume = 4.5 m³
- Maximum weight compartment can carry = 150 kg
- Maximum Item Count compartment can carry = 5

The delivery order includes the following three items

| Property                    | Item 1 (Sofa) | Item 2 (Coffee table) | Item 3 (Dinner table) |
| --------------------------- | ------------- | --------------------- | --------------------- |
| Dimensions ( Hx W x D) (cm) | 85 x 210 x 95 | 40 x 90 x 60          | 80 x 100 x 260        |
| Volume (m³)                 | 1.696         | 0.216                 | 2.16                  |
| Weight (kg)                 | 50            | 20                    | 70                    |
| Alignment                   | parallel      | strict                | parallel              |
| Count                       | 1             | 1                     | 1                     |

#### Challenges with Conventional Capacity Metrics

Note that if capacity planning were performed using traditional metrics such as **weight-based thresholds** (e.g., combined load of 140 kg) or **Volumetric capacity** (e.g., combined volume of 4.0 m³ vs. vehicle capacity of 4.5 m³), or the simpler **Item count** (e.g., 3 items), the system would likely determine that the vehicle can accommodate all the items. However, such methods ignore spatial constraints imposed by the actual dimensions and alignment requirements of the cargo.

Let’s understand how Route Optimization API overcomes conventional shortcomings using the advanced dimensions and spatial orientation feature.

### Example API Request

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>'
--header 'Content-Type: application/json'
--data '{
  "description": "Example - 3D Volume & Cargo Orientation",
  "locations": {
    "id": 1,
    "location": [
      "34.02410429,-118.25503086",
      "34.04118314,-118.24377960",
      "34.05248264,-118.25345384",
      "34.04890945,-118.25881547"
    ]
  },
  "jobs": [
    {
      "id": "Delivery 1 - Sofa",
      "location_index": 1,
      "delivery": [
        1
      ],
      "volume": {
        "height": 0.85,
        "width": 2.1,
        "depth": 0.95,
        "alignment": "parallel"
      }
    },
    {
      "id": "Delivery 2 - Coffee Table",
      "location_index": 2,
      "delivery": [
        1
      ],
      "volume": {
        "height": 0.4,
        "width": 0.9,
        "depth": 0.6,
        "alignment": "strict"
      }
    },
    {
      "id": "Delivery 3 - Dining Table",
      "location_index": 3,
      "delivery": [
        1
      ],
      "volume": {
        "height": 0.8,
        "width": 1.0,
        "depth": 2.6,
        "alignment": "parallel"
      }
    }
  ],
  "vehicles": [
    {
      "id": "Minivan - 1",
      "start_index": 0,
      "end_index": 0,
      "capacity": [
        3
      ],
      "volume": {
        "height": 1.2,
        "width": 1.5,
        "depth": 2.5
      }
    }
  ]
}'
```

### Example API Response

```json
{
  "description": "Example - 3D Volume & Cargo Orientation",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1208,
      "routes": 1,
      "unassigned": 1,
      "setup": 0,
      "service": 0,
      "duration": 1208,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [2],
      "pickup": [0],
      "distance": 10519
    },
    "unassigned": [
      {
        "id": "Delivery 3 - Dining Table",
        "type": "job",
        "location": [34.04890945, -118.25881547],
        "reason": "cannot be served due to volume requirement"
      }
    ],
    "routes": [
      {
        "vehicle": "Minivan - 1",
        "cost": 1208,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [2],
            "distance": 0,
            "snapped_location": [34.02419, -118.25498]
          },
          {
            "type": "job",
            "arrival": 436,
            "duration": 436,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05248264, -118.25345384],
            "location_index": 2,
            "id": "Delivery 2 - Coffee Table",
            "load": [1],
            "distance": 5677,
            "internal_id": 1016026240,
            "snapped_location": [34.05248, -118.25344]
          },
          {
            "type": "job",
            "arrival": 784,
            "duration": 784,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 1,
            "id": "Delivery 1 - Sofa",
            "load": [0],
            "distance": 7610,
            "internal_id": 2640094488,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "end",
            "arrival": 1208,
            "duration": 1208,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [0],
            "distance": 10519,
            "snapped_location": [34.02419, -118.25498]
          }
        ],
        "service": 0,
        "duration": 1208,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [0],
        "distance": 10519,
        "geometry": "ejtnErtwpUm@dBq@pBYv@_@hAmDzJKGkAo@GEe@Um@][S_Ai@OIGE]Qa@UYQIGQKe@WSMMIy@e@gAm@c@W]SGESMOISK]SGE]UyA~CiAnCq@xAOZi@fAqBlEt@f@TRBDGTQt@Oz@Mp@Mt@YxA]zAW~@AHIXETYxAIRMZKTGNGNy@dBYn@S`@Ud@MVYn@o@tAO^MV]v@a@|@[v@Qu@~@CFMPGPOZWb@KTIHGHWX]^_@^GHIJKNe@v@e@v@]l@CDKP]p@_@t@Wf@c@z@EJOXk@hAe@h@OVQZW^ADOTQRIHEDQJOHGB[DS?[Am@Em@GSAI?[@WBUDSFQJOJ]`@IHSPSPUPMHk@b@WRYPWNSHYDO@Q?SCWCk@OcBi@e@M_@Mg@Ie@U[Oc@Wc@WWS[UUOSS[Wc@_@][QSQQ[_@gAyAQUQYk@{@_@m@S]Wc@}@aBIs@CMKSKSEK[q@mAaCe@}@_BwCKUu@{AmAgCoAgCCGO[a@_AWg@Wi@a@{@Wk@Uc@O[OWa@{@IMg@_AKQIOGKKOWc@g@}@Q[Wg@U]IM}@{AKOKQOUOY]g@QWOQ[e@OSSYU]OUGIOQSYUYIIAAGGOQEECAAAGCc@_@]a@w@m@][WS]]SYGMCICOAI?G?E@I@EDKDKBEFEHGHEJCKPINMFEFKJOHOd@u@Zk@dAmANUhB}Bj@gAKc@MMIIQOPNHHLLJb@Rg@FMJQLWNULUBI@I@I@M@a@FODGHS`@q@Va@r@oAZi@o@NWVc@~@}A`AgBT[HOp@gAd@{@`@s@Xg@f@}@JSd@y@R]Zi@h@aAJOHKx@eAZ_@Z_@NOT[FIFKFKBGDGJWJSz@yBFMXo@JUJ[Ni@Ha@l@eCJg@Vw@ZLZJt@dAb@fAh@XNn@^NZPNJ|DbCxA`A^VXg@`@w@p@qA|AwCRPSQXg@dAsBl@iAl@iANYjAwBr@sAd@}@HO`@y@^u@pABL@zAJLBRBJDNHhAjAp@r@HHFDHFLHZRJFz@h@TN~@n@nAv@d@Zh@Z^Tn@ZPJJDXPLFRJ~@b@t@^j@Th@Xh@TTLr@b@R^Rh@Vf@Rb@P^PVLVLz@b@zBfA`@VNHTPJHXXbA|@XXXVrAnAhAbAh@h@j@h@jAhAf@b@XXHHf@d@r@p@p@j@NNd@b@JHRPBBPNZTVTHFFFl@j@VVeBdEhA~@fA~@FDi@zAEJi@xAi@zAKVO^KMZNZNRPLJFFDLFFDp@j@ZzAv@xA|@Qd@",
        "internal_id": 3628866111,
        "profile": "default",
        "adopted_capacity": [3]
      }
    ],
    "routing_profiles": {
      "default": {}
    }
  },
  "status": "Ok",
  "message": ""
}
```

## Interpreting the Output

- The **sofa**, although having a width (210 cm) greater than the internal width of the vehicle (150 cm), is marked with an alignment of **parallel**. This permits one rotation along any 1 axis. As a result, the optimization engine attempts rotating the item—the width into the depth dimension (250 cm) —allowing it to be feasibly loaded.

- The **coffee table**, by contrast, is marked as **rigid**, which disallows any rotation. This implies that each of its dimensions must fit within the corresponding dimension of the vehicle compartment exactly. Any single dimension exceeding the compartment limits will cause the item to be excluded from the vehicle plan.

- The **dinner table**, despite being assigned a parallel alignment, could not be accommodated within the vehicle’s cargo compartment. This is because even after attempting all valid axis rotations, the item's longest dimension—260 cm—exceeds the maximum dimension of the compartment. Since no orientation allows it to fit, the optimizer correctly excluded the task from assignment.

## What We Learned?

This example demonstrates that without enforcing volume- and orientation-aware constraints, the routing engine may generate infeasible plans—such as assigning large or misoriented items to vehicles incapable of carrying them. This can result in operational issues such as:

- Failed deliveries,
- Increased vehicle reassignments,
- Inefficient space utilization, or
- Additional cost due to secondary dispatch attempts.

By enabling 3D spatial validation with support for orientation configurations (strict, parallel, fixed_bottom), routing systems can more accurately simulate real-world loading constraints and produce executable route plans in space-sensitive use cases such as furniture, appliance, or equipment logistics.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
