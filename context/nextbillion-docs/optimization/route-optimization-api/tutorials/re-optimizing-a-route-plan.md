# Re-Optimizing A Route Plan

In dynamic logistics environments, routing plans must often adapt to real-time changes—whether due to last-minute task cancellations, new incoming orders, or vehicle availability changes. The re-optimization feature enables users to efficiently update an existing route plan by referencing its original request ID and applying incremental changes to vehicles or tasks. This avoids the need to re-run the entire optimization process from scratch, significantly reducing response times and improving operational agility. Re-optimization is particularly valuable in use cases such as field service operations, on-demand delivery, NEMT scheduling, grocery distribution, and other industries where routing decisions evolve continuously due to dynamic real-world constraints.

Here's a practical example to illustrate the utility of the re-optimization feature.

## Sample Use Case: NEMT Scheduling

Consider a Non-Emergency Medical Transportation (NEMT) provider managing daily appointments for 3 vehicles servicing a mix of dialysis, physical therapy, and outpatient visits. Early in the day, an optimized route plan for 6 patients’ pickup and dropoff is generated and dispatched to drivers.

Here is the original route optimization problem and the associated optimized route plan:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "description":"Re_Optimization Example",
    "shipments": [
        {
            "pickup": {
                "id": "Patient Pickup 1",
                "location_index": 1,
                "time_windows": [[1750406400,1750408200]]
            },
            "delivery": {
                "id": "Patient Dropoff 1",
                "location_index": 7,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        },
        {
            "pickup": {
                "id": "Patient Pickup 2",
                "location_index": 2,
                "time_windows": [[1750406400,1750408200]]
            },
            "delivery": {
                "id": "Patient Dropoff 2",
                "location_index": 8,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        },
        {
            "pickup": {
                "id": "Patient Pickup 3",
                "location_index": 3,
                "time_windows": [[1750406400,1750408200]]
            },
            "delivery": {
                "id": "Patient Dropoff 3",
                "location_index": 9,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        },
        {
            "pickup": {
                "id": "Patient Pickup 4",
                "location_index": 4,
                "time_windows": [[1750407300,1750409100]]
            },
            "delivery": {
                "id": "Patient Dropoff 4",
                "location_index": 7,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        },
        {
            "pickup": {
                "id": "Patient Pickup 5",
                "location_index": 5,
                "time_windows": [[1750407300,1750409100]]
            },
            "delivery": {
                "id": "Patient Dropoff 5",
                "location_index": 8,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        },
        {
            "pickup": {
                "id": "Patient Pickup 6",
                "location_index": 6,
                "time_windows": [[1750407300,1750409100]]
            },
            "delivery": {
                "id": "Patient Dropoff 6",
                "location_index": 9,
                "time_windows": [[1750409400,1750411800]]
            },
            "amount": [1]
        }
    ],
    "vehicles": [
        {
            "id": "NEMT Van 1",
            "start_index": 0,
            "capacity": [
                4
            ]
        },
        {
            "id": "NEMT Van 2",
            "start_index": 0,
            "capacity": [
                4
            ]
        },
        {
            "id": "NEMT Van 3",
            "start_index": 0,
            "capacity": [
                4
            ]
        }
    ],
    "locations": {
        "id": 1,
        "location": [
            "34.09407417,-118.34376586",
            "34.06881202,-118.30875422",
            "34.06845616,-118.29114101",
            "34.05991510,-118.29157060",
            "34.05261893,-118.29157060",
            "34.05244097,-118.30832463",
            "34.04354234,-118.29157060",
            "34.00402112,-118.30123639",
            "33.99351464,-118.31799042",
            "34.01043122,-118.31799042"
        ]
    }
}'
```

Once the request is successfully submitted, we get a unique ID in the response:

```json
{
  "id": "21ad9df701583891ac1aadd754258748",
  "message": "Optimization job created",
  "status": "Ok"
}
```

We use the unique ID above to retrieve the optimized route plan:

```json
{
    "description": "Re_Optimization Example",
    "result": {
        "code": 0,
        "summary": {
            "cost": 4407,
            "routes": 2,
            "unassigned": 0,
            "setup": 0,
            "service": 0,
            "duration": 4407,
            "waiting_time": 334,
            "priority": 0,
            "delivery": [
                6
            ],
            "pickup": [
                6
            ],
            "distance": 38357
        },
        "routes": [
            {
                "vehicle": "NEMT Van 2",
                "cost": 2462,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 1750407056,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.09407417,
                            -118.34376586
                        ],
                        "location_index": 0,
                        "load": [
                            0
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.09433,
                            -118.34376
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750407713,
                        "duration": 657,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06881202,
                            -118.30875422
                        ],
                        "location_index": 1,
                        "id": "Patient Pickup 1",
                        "load": [
                            1
                        ],
                        "distance": 6054,
                        "internal_id": 1561048689,
                        "snapped_location": [
                            34.06897,
                            -118.30875
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408014,
                        "duration": 958,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06845616,
                            -118.29114101
                        ],
                        "location_index": 2,
                        "id": "Patient Pickup 2",
                        "load": [
                            2
                        ],
                        "distance": 7752,
                        "internal_id": 1510715832,
                        "snapped_location": [
                            34.06845,
                            -118.29108
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408200,
                        "duration": 1144,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.0599151,
                            -118.2915706
                        ],
                        "location_index": 3,
                        "id": "Patient Pickup 3",
                        "load": [
                            3
                        ],
                        "distance": 8749,
                        "internal_id": 1527493451,
                        "snapped_location": [
                            34.05992,
                            -118.29165
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408303,
                        "duration": 1247,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.05261893,
                            -118.2915706
                        ],
                        "location_index": 4,
                        "id": "Patient Pickup 4",
                        "load": [
                            4
                        ],
                        "distance": 9561,
                        "internal_id": 1611381546,
                        "snapped_location": [
                            34.05262,
                            -118.29161
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409066,
                        "duration": 2010,
                        "service": 0,
                        "waiting_time": 334,
                        "location": [
                            34.00402112,
                            -118.30123639
                        ],
                        "location_index": 7,
                        "id": "Patient Dropoff 4",
                        "load": [
                            3
                        ],
                        "distance": 15945,
                        "internal_id": 749100272,
                        "snapped_location": [
                            34.00402,
                            -118.30127
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409400,
                        "duration": 2010,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.00402112,
                            -118.30123639
                        ],
                        "location_index": 7,
                        "id": "Patient Dropoff 1",
                        "load": [
                            2
                        ],
                        "distance": 15945,
                        "internal_id": 832988367,
                        "snapped_location": [
                            34.00402,
                            -118.30127
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409659,
                        "duration": 2269,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.01043122,
                            -118.31799042
                        ],
                        "location_index": 9,
                        "id": "Patient Dropoff 3",
                        "load": [
                            1
                        ],
                        "distance": 18300,
                        "internal_id": 866543605,
                        "snapped_location": [
                            34.01031,
                            -118.31799
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409852,
                        "duration": 2462,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "id": "Patient Dropoff 2",
                        "load": [
                            0
                        ],
                        "distance": 20185,
                        "internal_id": 849765986,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1750409852,
                        "duration": 2462,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "load": [
                            0
                        ],
                        "distance": 20185,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    }
                ],
                "service": 0,
                "duration": 2462,
                "waiting_time": 334,
                "priority": 0,
                "delivery": [
                    4
                ],
                "pickup": [
                    4
                ],
                "distance": 20185,
                "geometry": <route_geometry_skipped_for_this_example>,
                "internal_id": 1429481494,
                "profile": "default",
                "adopted_capacity": [
                    4
                ]
            },
            {
                "vehicle": "NEMT Van 3",
                "cost": 1945,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 1750407648,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.09407417,
                            -118.34376586
                        ],
                        "location_index": 0,
                        "load": [
                            0
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.09433,
                            -118.34376
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408471,
                        "duration": 823,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.05244097,
                            -118.30832463
                        ],
                        "location_index": 5,
                        "id": "Patient Pickup 5",
                        "load": [
                            1
                        ],
                        "distance": 7644,
                        "internal_id": 1628159165,
                        "snapped_location": [
                            34.05264,
                            -118.30833
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408753,
                        "duration": 1105,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.04354234,
                            -118.2915706
                        ],
                        "location_index": 6,
                        "id": "Patient Pickup 6",
                        "load": [
                            2
                        ],
                        "distance": 10187,
                        "internal_id": 1577826308,
                        "snapped_location": [
                            34.04354,
                            -118.29159
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409400,
                        "duration": 1752,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.01043122,
                            -118.31799042
                        ],
                        "location_index": 9,
                        "id": "Patient Dropoff 6",
                        "load": [
                            1
                        ],
                        "distance": 16287,
                        "internal_id": 782655510,
                        "snapped_location": [
                            34.01031,
                            -118.31799
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409593,
                        "duration": 1945,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "id": "Patient Dropoff 5",
                        "load": [
                            0
                        ],
                        "distance": 18172,
                        "internal_id": 765877891,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1750409593,
                        "duration": 1945,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "load": [
                            0
                        ],
                        "distance": 18172,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    }
                ],
                "service": 0,
                "duration": 1945,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    2
                ],
                "distance": 18172,
                "geometry": <route_geometry_skipped_for_this_example>,
                "internal_id": 1446259113,
                "profile": "default",
                "adopted_capacity": [
                    4
                ]
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

We can see from the suggested route plan that only 2 vans were used out of the 3 available to complete all the patient drop-offs. However, shortly after dispatching this route, a few changes occur:

- **Two patients cancel** their trips after postponing appointments to different dates.
- A nearby clinic calls in with **two new urgent pickups** for same-day appointments.

Without **re-optimization capabilities**, adapting to these changes would require removing canceled tasks from the dispatched routes and re-running the entire route optimization from scratch. Consequently, apart from losing time in planning the routes again, the dispatcher also risks unnecessary disruption resulting from completely new routes, even if a driver’s individual assignments hadn’t been directly affected.

With **re-optimization**, however, the system retains the structure of the existing plan with minimal changes to accommodate targeted updates - remove the canceled tasks and add the urgent pickups. This approach ensures continuity, reduces dispatcher workload, and enables real-time responsiveness—all crucial in a service environment where punctuality and passenger experience are non-negotiable.

Let’s understand how the Re-Optimization feature of Route Optimization API overcomes dynamic changes to the routing constraints.

## Example API Request

We use the re-optimization method along with the unique ID of the original request to accommodate the new changes - adding 2 urgent patient pickups & dropoff details and removing two shipments which were cancelled - into the existing route plan.

```bash
curl --location 'https://api.nextbillion.io/optimization/re_optimization?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "existing_request_id": "21ad9df701583891ac1aadd754258748",
    "shipment_changes": {
        "add": [
            {
                "pickup": {
                    "id": "Patient Pickup 7",
                    "location_index": 10,
                    "time_windows": [[1750406400,1750408200]]
                },
                "delivery": {
                    "id": "Patient Dropoff 7",
                    "location_index": 7,
                    "time_windows": [[1750409400,1750411800]]
                },
                "amount": [1]
            },
            {
                "pickup": {
                    "id": "Patient Pickup 8",
                    "location_index": 11,
                    "time_windows": [[1750406400,1750408200]]
                },
                "delivery": {
                    "id": "Patient Dropoff 8",
                    "location_index": 8,
                    "time_windows": [[1750409400,1750411800]]
                },
                "amount": [1]
            }
        ],
        "remove": [
            [
                "Patient Pickup 1",
                "Patient Dropoff 1"
            ],
            [
                "Patient Pickup 2",
                "Patient Dropoff 2"
            ]
        ]
    },
    "locations": [
        "34.09407417,-118.34376586",
        "34.06881202,-118.30875422",
        "34.06845616,-118.29114101",
        "34.05991510,-118.29157060",
        "34.05261893,-118.29157060",
        "34.05244097,-118.30832463",
        "34.04354234,-118.29157060",
        "34.00402112,-118.30123639",
        "33.99351464,-118.31799042",
        "34.01043122,-118.31799042",
        "34.06365192,-118.30402873",
        "34.06116073,-118.28426756"
    ]
}'
```

## Example API Response

```json
{
    "description": "Re_Optimization Example",
    "result": {
        "code": 0,
        "summary": {
            "cost": 6304,
            "routes": 3,
            "unassigned": 0,
            "setup": 0,
            "service": 0,
            "duration": 6304,
            "waiting_time": 738,
            "priority": 0,
            "delivery": [
                6
            ],
            "pickup": [
                6
            ],
            "distance": 57655
        },
        "routes": [
            {
                "vehicle": "NEMT Van 2",
                "cost": 2089,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 1750407169,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.09407417,
                            -118.34376586
                        ],
                        "location_index": 0,
                        "load": [
                            0
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.09433,
                            -118.34376
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408200,
                        "duration": 1031,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.0599151,
                            -118.2915706
                        ],
                        "location_index": 3,
                        "id": "Patient Pickup 3",
                        "load": [
                            1
                        ],
                        "distance": 8454,
                        "internal_id": 1527493451,
                        "snapped_location": [
                            34.05992,
                            -118.29165
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408307,
                        "duration": 1138,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.05261893,
                            -118.2915706
                        ],
                        "location_index": 4,
                        "id": "Patient Pickup 4",
                        "load": [
                            2
                        ],
                        "distance": 9266,
                        "internal_id": 1611381546,
                        "snapped_location": [
                            34.05262,
                            -118.29161
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409017,
                        "duration": 1848,
                        "service": 0,
                        "waiting_time": 383,
                        "location": [
                            34.00402112,
                            -118.30123639
                        ],
                        "location_index": 7,
                        "id": "Patient Dropoff 4",
                        "load": [
                            1
                        ],
                        "distance": 15650,
                        "internal_id": 749100272,
                        "snapped_location": [
                            34.00402,
                            -118.30127
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409641,
                        "duration": 2089,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.01043122,
                            -118.31799042
                        ],
                        "location_index": 9,
                        "id": "Patient Dropoff 3",
                        "load": [
                            0
                        ],
                        "distance": 18005,
                        "internal_id": 866543605,
                        "snapped_location": [
                            34.01031,
                            -118.31799
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1750409641,
                        "duration": 2089,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.01043122,
                            -118.31799042
                        ],
                        "location_index": 9,
                        "load": [
                            0
                        ],
                        "distance": 18005,
                        "snapped_location": [
                            34.01031,
                            -118.31799
                        ]
                    }
                ],
                "service": 0,
                "duration": 2089,
                "waiting_time": 383,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    2
                ],
                "distance": 18005,
                "geometry": <route_geometry_skipped_for_this_example>,
                "internal_id": 1429481494,
                "profile": "default",
                "adopted_capacity": [
                    4
                ]
            },
            {
                "vehicle": "NEMT Van 3",
                "cost": 1970,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 1750407647,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.09407417,
                            -118.34376586
                        ],
                        "location_index": 0,
                        "load": [
                            0
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.09433,
                            -118.34376
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408467,
                        "duration": 820,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.05244097,
                            -118.30832463
                        ],
                        "location_index": 5,
                        "id": "Patient Pickup 5",
                        "load": [
                            1
                        ],
                        "distance": 7644,
                        "internal_id": 1628159165,
                        "snapped_location": [
                            34.05264,
                            -118.30833
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408780,
                        "duration": 1133,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.04354234,
                            -118.2915706
                        ],
                        "location_index": 6,
                        "id": "Patient Pickup 6",
                        "load": [
                            2
                        ],
                        "distance": 10408,
                        "internal_id": 1577826308,
                        "snapped_location": [
                            34.04354,
                            -118.29159
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409400,
                        "duration": 1753,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.01043122,
                            -118.31799042
                        ],
                        "location_index": 9,
                        "id": "Patient Dropoff 6",
                        "load": [
                            1
                        ],
                        "distance": 16508,
                        "internal_id": 782655510,
                        "snapped_location": [
                            34.01031,
                            -118.31799
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409617,
                        "duration": 1970,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "id": "Patient Dropoff 5",
                        "load": [
                            0
                        ],
                        "distance": 18393,
                        "internal_id": 765877891,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1750409617,
                        "duration": 1970,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "load": [
                            0
                        ],
                        "distance": 18393,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    }
                ],
                "service": 0,
                "duration": 1970,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    2
                ],
                "distance": 18393,
                "geometry": <route_geometry_skipped_for_this_example>,
                "internal_id": 1446259113,
                "profile": "default",
                "adopted_capacity": [
                    4
                ]
            },
            {
                "vehicle": "NEMT Van 1",
                "cost": 2245,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 1750407069,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.09407417,
                            -118.34376586
                        ],
                        "location_index": 0,
                        "load": [
                            0
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.09433,
                            -118.34376
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750407860,
                        "duration": 791,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06365192,
                            -118.30402873
                        ],
                        "location_index": 10,
                        "id": "Patient Pickup 7",
                        "load": [
                            1
                        ],
                        "distance": 7075,
                        "internal_id": 1594603927,
                        "snapped_location": [
                            34.06365,
                            -118.30411
                        ]
                    },
                    {
                        "type": "pickup",
                        "arrival": 1750408200,
                        "duration": 1131,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06116073,
                            -118.28426756
                        ],
                        "location_index": 11,
                        "id": "Patient Pickup 8",
                        "load": [
                            2
                        ],
                        "distance": 9198,
                        "internal_id": 1410050118,
                        "snapped_location": [
                            34.06116,
                            -118.28421
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409045,
                        "duration": 1976,
                        "service": 0,
                        "waiting_time": 355,
                        "location": [
                            34.00402112,
                            -118.30123639
                        ],
                        "location_index": 7,
                        "id": "Patient Dropoff 7",
                        "load": [
                            1
                        ],
                        "distance": 18527,
                        "internal_id": 799433129,
                        "snapped_location": [
                            34.00402,
                            -118.30127
                        ]
                    },
                    {
                        "type": "delivery",
                        "arrival": 1750409669,
                        "duration": 2245,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "id": "Patient Dropoff 8",
                        "load": [
                            0
                        ],
                        "distance": 21257,
                        "internal_id": 950431700,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1750409669,
                        "duration": 2245,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.99351464,
                            -118.31799042
                        ],
                        "location_index": 8,
                        "load": [
                            0
                        ],
                        "distance": 21257,
                        "snapped_location": [
                            33.99355,
                            -118.31792
                        ]
                    }
                ],
                "service": 0,
                "duration": 2245,
                "waiting_time": 355,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    2
                ],
                "distance": 21257,
                "geometry": <route_geometry_skipped_for_this_example>,
                "internal_id": 1412703875,
                "profile": "default",
                "adopted_capacity": [
                    4
                ]
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

## Interpreting the Re-Optimized Route Plan

- In the re-optimized route plan all 3 vehicles were used to accommodate the new urgent appointments.

- Upon taking a closer look we observe the changes to the original route plan were intelligently accommodated in the new route plan.
  - Originally, **NEMT Van 2** was responsible for Patient Pickups 1, 2, 3, 4. In the new plan the vehicle retained the pickups 3, 4 which were not affected directly. Since the Patients 1 & 2 cancelled their trips, those stops were simply removed from the vehicle’s route plan without any other changes to its trip.

  - **NEMT Van 1** was not assigned any pickups initially as there was no need. However, the new plan utilized this previously idle vehicle to handle urgent pickups while ensuring no other stops are added to its route.

  - Since the original pickups for **NEMT Van 3** were not directly affected by the changing constraints, its original route plan was retained as-is in the re-optimized solution as well.

## What We Learned?

This example illustrates how re-optimization enables routing systems to adapt to real-world changes in a controlled, efficient manner. Rather than recalculating the entire solution from scratch, the optimizer applies _targeted updates_—removing only the affected appointments and intelligently utilizing available resources to accommodate new ones. Unaffected vehicle assignments remain stable, minimizing operational disruption and communication overhead. For highly dynamic logistics operations where constraints change constantly, _incremental route corrections_ via re-optimization ensure service standards are honoured in the face of volatility, providing business owners a powerful lever for scalability and resilience.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
