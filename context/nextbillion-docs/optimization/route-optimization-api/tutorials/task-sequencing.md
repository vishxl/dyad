# Relations & Task Sequencing

Relations are used to specify the association between different tasks that should be performed in a certain order. NextBillion.ai’s Route Optimization API offers three types of relations that the users can enforce:

- `in_same_route`: All the steps mentioned in this type of relation will be part of the same route.

- `in_sequence`: All the steps mentioned in this relation will follow the specified sequence but other steps might be inserted by the optimizer, if feasible.

- `in_direct_sequence`: All the steps mentioned in this relation will follow the specified sequence without any other steps being inserted between them by the solver.

However, a few points might be worthy to note here. Relations are a hard configuration in that the tasks belonging to a relation should all be feasible for it to work. If any of the tasks in the relation can’t be fulfilled due to any reason (skills mismatch, time-window, insufficient capacity etc) the entire relation would be deemed infeasible and all tasks would be unassigned. Hence, it is critical to ensure that all tasks can be accommodated in one of the available vehicles before adding them to a `relations`.

Relations is a helpful feature to take care of special sequencing cases of task fulfillment within overall optimization problems.

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### Jobs & Shipments

We start by defining 10 jobs and 3 shipments. Let’s define the properties of these tasks:

- A unique identifier for each task

- Location indexes for each task

- The actual time taken to complete the tasks once the driver/vehicle is at the task’s location i.e. the service time for each task.

Let’s take a look at the `jobs` JSON after the above properties are configured:

```json
  "jobs": [
         {
           "id": "Job 1",
           "location_index": 0,
           "service": 120
         },
         {
           "id": "Job 2",
           "location_index": 1,
           "service": 180
         },
         {
           "id": "Job 3",
           "location_index": 2,
           "service": 120
         },
         {
           "id": "Job 4",
           "location_index": 3,
           "service": 120
         },
         {
           "id": "Job 5",
           "location_index": 4,
           "service": 60
         },
         {
           "id": "Job 6",
           "location_index": 5,
           "service": 120
         },
         {
           "id": "Job 7",
           "location_index": 6,
           "service": 120
         },
         {
           "id": "Job 8",
           "location_index": 7,
           "service": 150
         },
         {
           "id": "Job 9",
           "location_index": 8,
           "service": 80
         },
         {
           "id": "Job 10",
           "location_index": 9,
           "service": 120
         }
       ],
       "shipments": [
         {
           "pickup": {
             "description": "Shipment Pickup 1",
             "id": "Shipment Pickup 1",
             "location_index": 10,
             "service": 120
           },
           "delivery": {
             "description": "Shipment Delivery 1",
             "id": "Shipment Delivery 1",
             "location_index": 11,
             "service": 120
           },
           "amount": [
             2
           ]
         },
         {
           "pickup": {
             "description": "Shipment Pickup 2",
             "id": "Shipment Pickup 2",
             "location_index": 12,
             "service": 120
           },
           "delivery": {
             "description": "Shipment Delivery 2",
             "id": "Shipment Delivery 2",
             "location_index": 13,
             "service": 120
           },
           "amount": [
             2
           ]
         },
         {
           "pickup": {
             "description": "Shipment Pickup 3",
             "id": "Shipment Pickup 3",
             "location_index": 14,
             "service": 120
           },
           "delivery": {
             "description": "Shipment Delivery 3",
             "id": "Shipment Delivery 3",
             "location_index": 15,
             "service": 120
           },
           "amount": [
             2
           ]
         }
       ]
```

### Vehicles

Next, we add 4 vehicles that will be responsible for fulfilling the tasks within the defined constraints. To describe the vehicles and their properties we add:

- A unique ID for each vehicle

- Capacity to denote the amount of load that the vehicle can take

- `start_index` to denote the point from where the vehicle would start.

- Costs for all vehicles. We have specified `fixed` cost for all vehicles

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
  "vehicles": [
         {
           "id": "Vehicle 1",
           "start_index": 16,
           "capacity": [
             20
           ],
           "costs": {
             "fixed": 1000
           }
         },
         {
           "id": "Vehicle 2",
           "start_index": 17,
           "capacity": [
             20
           ],
           "costs": {
             "fixed": 1000
           }
         },
         {
           "id": "Vehicle 3",
           "start_index": 18,
           "capacity": [
             20
           ],
           "costs": {
             "fixed": 1000
           }
         },
         {
           "id": "Vehicle 4",
           "capacity": [
             20
           ],
           "start_index": 19,
           "costs": {
             "fixed": 1000
           }
         }
       ]
```

### Locations

Next, we define the `locations` object and add all the locations used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
  "locations": {
    "id": 1,
    "location": [
      "34.083950,-118.318640",
      "34.054927,-118.323726",
      "34.075525,-118.361588",
      "34.076350,-118.338519",
      "34.090425,-118.338933",
      "34.037925,-118.459842",
      "34.004364,-118.421170",
      "34.000215,-118.318803",
      "33.945884,-118.325628",
      "34.000895,-118.204929",
      "34.076646,-118.376969",
      "34.094986,-118.300885",
      "34.018780,-118.317919",
      "33.996658,-118.261708",
      "33.916595,-118.240132",
      "33.946275,-118.385486",
      "34.057106,-118.361326",
      "34.016137,-118.253523",
      "33.940407,-118.265196",
      "33.974060,-118.246945"
    ]
  }
```

### Relations

And, lastly, we define the relations between the tasks of our choice. For this example, we will

- Keep shipment 3, jobs 7,8,9 in same route

- Keep shipment 2 and job 10, 5 in direct sequence

- Keep jobs 6, 4, 1 in sequence.

- Jobs 2, 3 and shipment 1 are not part of any relations

The `relations` object once configured according to the above distribution results in :

```json
  "relations": [
         {
           "type": "in_sequence",
           "steps": [
             {
               "type": "start"
             },
             {
               "type": "job",
               "id": "Job 6"
             },
             {
               "type": "job",
               "id": "Job 4"
             },
             {
               "type": "job",
               "id": "Job 1"
             },
             {
               "type": "end"
             }
           ]
         },
         {
           "type": "in_direct_sequence",
           "steps": [
             {
               "type": "start"
             },
             {
               "type": "pickup",
               "id": "Shipment Pickup 2"
             },
             {
               "type": "delivery",
               "id": "Shipment Delivery 2"
             },
             {
               "type": "job",
               "id": "Job 10"
             },
             {
               "type": "job",
               "id": "Job 5"
             },
             {
               "type": "end"
             }
           ]
         },
         {
           "type": "in_same_route",
           "steps": [
             {
               "type": "start"
             },
             {
               "type": "pickup",
               "id": "Shipment Pickup 3"
             },
             {
               "type": "delivery",
               "id": "Shipment Delivery 3"
             },
             {
               "type": "job",
               "id": "Job 7"
             },
             {
               "type": "job",
               "id": "Job 8"
             },
             {
               "type": "job",
               "id": "Job 9"
             },
             {
               "type": "end"
             }
           ]
         }
       ]
```

## Optimization POST Request

Bringing all these attributes together, let’s create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
      "description": "Relations - Task Sequencing Example",
        "jobs": [
          {
            "id": "Job 1",
            "location_index": 0,
            "service": 120
          },
          {
            "id": "Job 2",
            "location_index": 1,
            "service": 180
          },
          {
            "id": "Job 3",
            "location_index": 2,
            "service": 120
          },
          {
            "id": "Job 4",
            "location_index": 3,
            "service": 120
          },
          {
            "id": "Job 5",
            "location_index": 4,
            "service": 60
          },
          {
            "id": "Job 6",
            "location_index": 5,
            "service": 120
          },
          {
            "id": "Job 7",
            "location_index": 6,
            "service": 120
          },
          {
            "id": "Job 8",
            "location_index": 7,
            "service": 150
          },
          {
            "id": "Job 9",
            "location_index": 8,
            "service": 80
          },
          {
            "id": "Job 10",
            "location_index": 9,
            "service": 120
          }
        ],
        "shipments": [
          {
            "pickup": {
              "description": "Shipment Pickup 1",
              "id": "Shipment Pickup 1",
              "location_index": 10,
              "service": 120
            },
            "delivery": {
              "description": "Shipment Delivery 1",
              "id": "Shipment Delivery 1",
              "location_index": 11,
              "service": 120
            },
            "amount": [
              2
            ]
          },
          {
            "pickup": {
              "description": "Shipment Pickup 2",
              "id": "Shipment Pickup 2",
              "location_index": 12,
              "service": 120
            },
            "delivery": {
              "description": "Shipment Delivery 2",
              "id": "Shipment Delivery 2",
              "location_index": 13,
              "service": 120
            },
            "amount": [
              2
            ]
          },
          {
            "pickup": {
              "description": "Shipment Pickup 3",
              "id": "Shipment Pickup 3",
              "location_index": 14,
              "service": 120
            },
            "delivery": {
              "description": "Shipment Delivery 3",
              "id": "Shipment Delivery 3",
              "location_index": 15,
              "service": 120
            },
            "amount": [
              2
            ]
          }
        ],
        "vehicles": [
          {
            "id": "Vehicle 1",
            "start_index": 16,
            "capacity": [
              20
            ],
            "costs": {
              "fixed": 1000
            }
          },
          {
            "id": "Vehicle 2",
            "start_index": 17,
            "capacity": [
              20
            ],
            "costs": {
              "fixed": 1000
            }
          },
          {
            "id": "Vehicle 3",
            "start_index": 18,
            "capacity": [
              20
            ],
            "costs": {
              "fixed": 1000
            }
          },
          {
            "id": "Vehicle 4",
            "capacity": [
              20
            ],
            "start_index": 19,
            "costs": {
              "fixed": 1000
            }
          }
        ],
        "locations": {
          "id": 1,
          "location": [
            "34.083950,-118.318640",
            "34.054927,-118.323726",
            "34.075525,-118.361588",
            "34.076350,-118.338519",
            "34.090425,-118.338933",
            "34.037925,-118.459842",
            "34.004364,-118.421170",
            "34.000215,-118.318803",
            "33.945884,-118.325628",
            "34.000895,-118.204929",
            "34.076646,-118.376969",
            "34.094986,-118.300885",
            "34.018780,-118.317919",
            "33.996658,-118.261708",
            "33.916595,-118.240132",
            "33.946275,-118.385486",
            "34.057106,-118.361326",
            "34.016137,-118.253523",
            "33.940407,-118.265196",
            "33.974060,-118.246945"
          ]
        },
        "relations": [
          {
            "type": "in_sequence",
            "steps": [
              {
                "type": "start"
              },
              {
                "type": "job",
                "id": "Job 6"
              },
              {
                "type": "job",
                "id": "Job 4"
              },
              {
                "type": "job",
                "id": "Job 1"
              },
              {
                "type": "end"
              }
            ]
          },
          {
            "type": "in_direct_sequence",
            "steps": [
              {
                "type": "start"
              },
              {
                "type": "pickup",
                "id": "Shipment Pickup 2"
              },
              {
                "type": "delivery",
                "id": "Shipment Delivery 2"
              },
              {
                "type": "job",
                "id": "Job 10"
              },
              {
                "type": "job",
                "id": "Job 5"
              },
              {
                "type": "end"
              }
            ]
          },
          {
            "type": "in_same_route",
            "steps": [
              {
                "type": "start"
              },
              {
                "type": "pickup",
                "id": "Shipment Pickup 3"
              },
              {
                "type": "delivery",
                "id": "Shipment Delivery 3"
              },
              {
                "type": "job",
                "id": "Job 7"
              },
              {
                "type": "job",
                "id": "Job 8"
              },
              {
                "type": "job",
                "id": "Job 9"
              },
              {
                "type": "end"
              }
            ]
          }
        ]
      }'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "b6752a169903fd4cd6f820e4c27ff850",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=b6752a169903fd4cd6f820e4c27ff850
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Relations - Task Sequencing Example",
  "request_created_time": 1781240144,
  "solution_created_time": 1781240147,
  "result": {
    "code": 0,
    "summary": {
      "cost": 16094,
      "routes": 3,
      "unassigned": 0,
      "setup": 0,
      "service": 1910,
      "duration": 13094,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [6],
      "pickup": [6],
      "distance": 133008
    },
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 5340,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.057106, -118.361326],
            "location_index": 16,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.05709, -118.36116]
          },
          {
            "type": "job",
            "arrival": 396,
            "duration": 396,
            "service": 180,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 1,
            "id": "Job 2",
            "load": [0],
            "distance": 3533,
            "internal_id": 114870802,
            "snapped_location": [34.05478, -118.32375]
          },
          {
            "type": "job",
            "arrival": 1612,
            "duration": 1432,
            "service": 120,
            "waiting_time": 0,
            "location": [34.037925, -118.459842],
            "location_index": 5,
            "id": "Job 6",
            "load": [0],
            "distance": 18373,
            "internal_id": 47760326,
            "snapped_location": [34.03739, -118.45962]
          },
          {
            "type": "pickup",
            "arrival": 3035,
            "duration": 2735,
            "service": 120,
            "waiting_time": 0,
            "location": [34.076646, -118.376969],
            "location_index": 10,
            "id": "Shipment Pickup 1",
            "load": [2],
            "description": "Shipment Pickup 1",
            "distance": 31810,
            "internal_id": 1369847398,
            "snapped_location": [34.07642, -118.3766]
          },
          {
            "type": "job",
            "arrival": 3402,
            "duration": 2982,
            "service": 120,
            "waiting_time": 0,
            "location": [34.075525, -118.361588],
            "location_index": 2,
            "id": "Job 3",
            "load": [2],
            "distance": 33339,
            "internal_id": 131648421,
            "snapped_location": [34.07553, -118.36147]
          },
          {
            "type": "job",
            "arrival": 4004,
            "duration": 3464,
            "service": 120,
            "waiting_time": 0,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "id": "Job 4",
            "load": [2],
            "distance": 35646,
            "internal_id": 14205088,
            "snapped_location": [34.07618, -118.33864]
          },
          {
            "type": "job",
            "arrival": 4547,
            "duration": 3887,
            "service": 120,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "id": "Job 1",
            "load": [2],
            "distance": 38540,
            "internal_id": 98093183,
            "snapped_location": [34.08391, -118.31839]
          },
          {
            "type": "delivery",
            "arrival": 5120,
            "duration": 4340,
            "service": 120,
            "waiting_time": 0,
            "location": [34.094986, -118.300885],
            "location_index": 11,
            "id": "Shipment Delivery 1",
            "load": [0],
            "description": "Shipment Delivery 1",
            "distance": 41430,
            "internal_id": 916003542,
            "snapped_location": [34.09519, -118.30124]
          },
          {
            "type": "end",
            "arrival": 5240,
            "duration": 4340,
            "service": 0,
            "waiting_time": 0,
            "location": [34.094986, -118.300885],
            "location_index": 11,
            "load": [0],
            "distance": 41430,
            "snapped_location": [34.09519, -118.30124]
          }
        ],
        "service": 900,
        "duration": 4340,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 41430,
        "geometry": "<route_geometry>",
        "internal_id": 520918500,
        "profile": "default",
        "adopted_capacity": [20]
      },
      {
        "vehicle": "Vehicle 2",
        "cost": 5129,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.016137, -118.253523],
            "location_index": 17,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.01675, -118.25306]
          },
          {
            "type": "pickup",
            "arrival": 894,
            "duration": 894,
            "service": 120,
            "waiting_time": 0,
            "location": [34.01878, -118.317919],
            "location_index": 12,
            "id": "Shipment Pickup 2",
            "load": [2],
            "description": "Shipment Pickup 2",
            "distance": 10191,
            "internal_id": 1353069779,
            "snapped_location": [34.01887, -118.31774]
          },
          {
            "type": "delivery",
            "arrival": 1915,
            "duration": 1795,
            "service": 120,
            "waiting_time": 0,
            "location": [33.996658, -118.261708],
            "location_index": 13,
            "id": "Shipment Delivery 2",
            "load": [0],
            "description": "Shipment Delivery 2",
            "distance": 17897,
            "internal_id": 899225923,
            "snapped_location": [33.99659, -118.26171]
          },
          {
            "type": "job",
            "arrival": 2813,
            "duration": 2573,
            "service": 120,
            "waiting_time": 0,
            "location": [34.000895, -118.204929],
            "location_index": 9,
            "id": "Job 10",
            "load": [0],
            "distance": 24329,
            "internal_id": 2202227805,
            "snapped_location": [34.00066, -118.20478]
          },
          {
            "type": "job",
            "arrival": 4489,
            "duration": 4129,
            "service": 60,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "id": "Job 5",
            "load": [0],
            "distance": 43428,
            "internal_id": 30982707,
            "snapped_location": [34.09059, -118.33892]
          },
          {
            "type": "end",
            "arrival": 4549,
            "duration": 4129,
            "service": 0,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "load": [0],
            "distance": 43428,
            "snapped_location": [34.09059, -118.33892]
          }
        ],
        "service": 420,
        "duration": 4129,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 43428,
        "geometry": "<route_geometry>",
        "internal_id": 571251357,
        "profile": "default",
        "adopted_capacity": [20]
      },
      {
        "vehicle": "Vehicle 4",
        "cost": 5625,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.97406, -118.246945],
            "location_index": 19,
            "load": [0],
            "distance": 0,
            "snapped_location": [33.97392, -118.24694]
          },
          {
            "type": "pickup",
            "arrival": 845,
            "duration": 845,
            "service": 120,
            "waiting_time": 0,
            "location": [33.916595, -118.240132],
            "location_index": 14,
            "id": "Shipment Pickup 3",
            "load": [2],
            "description": "Shipment Pickup 3",
            "distance": 7167,
            "internal_id": 1336292160,
            "snapped_location": [33.91622, -118.24013]
          },
          {
            "type": "job",
            "arrival": 2237,
            "duration": 2117,
            "service": 150,
            "waiting_time": 0,
            "location": [34.000215, -118.318803],
            "location_index": 7,
            "id": "Job 8",
            "load": [2],
            "distance": 25594,
            "internal_id": 215536516,
            "snapped_location": [34.00005, -118.31814]
          },
          {
            "type": "job",
            "arrival": 3110,
            "duration": 2840,
            "service": 80,
            "waiting_time": 0,
            "location": [33.945884, -118.325628],
            "location_index": 8,
            "id": "Job 9",
            "load": [2],
            "distance": 32380,
            "internal_id": 232314135,
            "snapped_location": [33.94554, -118.32538]
          },
          {
            "type": "delivery",
            "arrival": 4125,
            "duration": 3775,
            "service": 120,
            "waiting_time": 0,
            "location": [33.946275, -118.385486],
            "location_index": 15,
            "id": "Shipment Delivery 3",
            "load": [0],
            "description": "Shipment Delivery 3",
            "distance": 38076,
            "internal_id": 882448304,
            "snapped_location": [33.94629, -118.38604]
          },
          {
            "type": "job",
            "arrival": 5095,
            "duration": 4625,
            "service": 120,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 6,
            "id": "Job 7",
            "load": [0],
            "distance": 48150,
            "internal_id": 64537945,
            "snapped_location": [34.00452, -118.42109]
          },
          {
            "type": "end",
            "arrival": 5215,
            "duration": 4625,
            "service": 0,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 6,
            "load": [0],
            "distance": 48150,
            "snapped_location": [34.00452, -118.42109]
          }
        ],
        "service": 590,
        "duration": 4625,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 48150,
        "geometry": "<route_geometry>",
        "internal_id": 470585643,
        "profile": "default",
        "adopted_capacity": [20]
      }
    ],
    "routing_profiles": {
      "default": {
        "mode": "4w"
      }
    }
  },
  "status": "Ok",
  "message": ""
}
```

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints.

![documentation image](/docs/route-optimization/v2/relations-2.webp)

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- From the summary, we can see that all the tasks were assigned and a total of 3 routes were created.
- The `in_sequence` relation with jobs 6, 4, 1 gets fulfilled through _Vehicle 1_.
- The `in_direct_sequence` relation with _Shipment 2_, _Job 10_ & _Job 5_ gets fulfilled through _Vehicle 2_.
- The `in_same_route` relation with _Shipment 3_, _Jobs 7_, _Jobs 8_, and _Jobs 9_ gets fulfilled through _Vehicle 4_.
- The tasks that were not part of any relations - _Job 2_, _Job 3_ and _Shipment 1_ - were also included in the _Vehicle 1_ route. It allowed the optimizer to not employ _Vehicle 3_ at all and save its `fixed` cost.

As we can see, NextBillion.ai’s Route Optimization API honors the relation constraints exactly as configured. To explore more readers can change the contents of different relations, assign different vehicles to relations. Or else they can just remove the relations object and contrast the result with the above and see how adding relations impacts the job distribution, number of routes, costs, etc.

We hope this example was helpful. Check out some more [use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization API can handle for you!
