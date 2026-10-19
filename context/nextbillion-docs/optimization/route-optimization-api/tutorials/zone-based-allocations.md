# Zone Based Allocations

Zone based allocations refers to the ability of NextBillion.ai’s Route Optimization service to allow or prohibit certain vehicles from operating in a certain zone. The zones can be configured on the fly while building the input optimization request or can refer to geofence IDs created using Geofence API. Zone based allocations are a practical way to avoid overlapping coverage, longer traveling distance and other inefficiencies during route planning. On top of these benefits, it also helps in leveraging the knowledge and experience of drivers by making them operate in a familiar neighborhood, thereby improving the service delivery.

## Setup

In this example we define 4 custom zones and 23 delivery tasks spread across these zones. We will use 4 vehicles to complete these tasks with each vehicle allowed to fulfill tasks in one zone only. We will start by configuring the locations and other entities one by one.

### Locations

We start by adding all the `locations` used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
"locations": {
        "id": 1,
        "location": [
            "34.07573047,-118.32586957",
            "34.06807671,-118.32568100",
            "34.05479813,-118.32341816",
            "34.01030758,-118.29222953",
            "34.01838855,-118.27476708",
            "34.003760936904854,-118.2784800143138",
            "34.07683722528893,-118.25476602069384",
            "34.05198593,-118.24931012",
            "34.04026743,-118.26024718",
            "34.08478964922578,-118.2643530343899",
            "34.08428926,-118.28448899",
            "34.07257755058855,-118.28289531144327",
            "34.06838912,-118.30870969",
            "34.06745188,-118.26986426",
            "34.04714248,-118.31719535",
            "34.02464024,-118.29079554",
            "34.01791966,-118.30870969",
            "34.03214165,-118.30022404",
            "34.08010374,-118.27024140",
            "34.06448389,-118.25987004",
            "34.04370503,-118.24346445",
            "34.03636090,-118.23856163",
            "34.03495451,-118.24761299",
            "34.04765255356763,-118.28497498113943"
        ]
    }
```

### Jobs

Next we define the 12 delivery tasks. For each task we:

- add an unique identifier
- add a location index
- add a delivery quantity

Following is the “jobs” JSON that we use

```json
"jobs": [
       {
           "id": "Delivery 1",
           "location_index": 0,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 2",
           "location_index": 1,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 3",
           "location_index": 2,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 4",
           "location_index": 3,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 5",
           "location_index": 4,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 6",
           "location_index": 5,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 7",
           "location_index": 6,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 8",
           "location_index": 7,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 9",
           "location_index": 8,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 10",
           "location_index": 9,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 11",
           "location_index": 10,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 12",
           "location_index": 11,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 13",
           "location_index": 12,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 14",
           "location_index": 13,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 15",
           "location_index": 14,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 16",
           "location_index": 15,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 17",
           "location_index": 16,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 18",
           "location_index": 17,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 19",
           "location_index": 18,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 20",
           "location_index": 19,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 21",
           "location_index": 20,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 22",
           "location_index": 21,
           "delivery": [
               1
           ]
       },
       {
           "id": "Delivery 23",
           "location_index": 22,
           "delivery": [
               1
           ]
       }
   ]
```

### Zones

Next we would create custom boundaries to divide the serviceable area into 4 zones. Zones can be created on the fly by providing geoJSON attributes for each of the polygons or by using NextBillion.ai’s Geofence API and then using those geofence IDs as an input to `zones.geofence_id`. Once the zones are created, the optimizer assigns tasks to defined zones automatically according to their geographic coordinates. Users can manually set `jobs.zones` for specific tasks if they wish to override these automated allocations.

For our example, we use the geoJSON details of each of the zones and provide them as input in the `zones` attribute. The tasks are auto-assigned to the zone in which they fall.

```json
    "zones": [
        {
            "id": 1,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.30092128201433,
                            34.06989391035307
                        ],
                        [
                            -118.31019915834466,
                            34.08493124579347
                        ],
                        [
                            -118.33704570103808,
                            34.07781254109547
                        ],
                        [
                            -118.33596820617596,
                            34.053783138370804
                        ],
                        [
                            -118.32546858200033,
                            34.04357277636396
                        ],
                        [
                            -118.28827674442269,
                            34.04553263572467
                        ],
                        [
                            -118.30092128201433,
                            34.06989391035307
                        ]
                    ]
                ]
            }
        },
        {
            "id": 2,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [

                            -118.29182929234022,
                            34.044587070695044
                        ],
                        [

                            -118.31460902205701,
                            34.02512452844134
                        ],
                        [
                            -118.31488472840473,
                            34.00003093421243
                        ],
                        [
                            -118.26948675260535,
                            33.99537897197098
                        ],
                        [
                            -118.26860371781083,
                            34.02328550811359
                        ],
                        [
                            -118.29182929234022,
                            34.044587070695044
                        ]
                    ]
                ]
            }
        },
        {
            "id": 3,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.27334042060798,
                            34.039342619126785
                        ],
                        [
                            -118.24213431414628,
                            34.02507401058014
                        ],
                        [
                            -118.22393913483447,
                            34.04669248458157
                        ],
                        [
                            -118.23436637488714,
                            34.053290135178706
                        ],
                        [
                            -118.24904361777618,
                            34.05970175578011
                        ],
                        [
                            -118.26552736256674,
                            34.05222947920761
                        ],
                        [
                            -118.27334042060798,
                            34.039342619126785
                        ]
                    ]
                ]
            }
        },
        {
            "id": 4,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.2935793205743,
                            34.082720792084714
                        ],
                        [
                            -118.29085916561404,
                            34.07218744620278
                        ],
                        [
                            -118.28008372958136,
                            34.064988633328
                        ],
                        [
                            -118.25553861793485,
                            34.05641939466491
                        ],
                        [
                            -118.22996983882342,
                            34.075253356769394
                        ],
                        [
                            -118.2511532426955,
                            34.08592654394608
                        ],
                        [
                            -118.27202489511956,
                            34.093871339831054
                        ],
                        [
                            -118.2935793205743,
                            34.082720792084714
                        ]
                    ]
                ]
            }
        }
    ]
```

### Vehicles

Next, we add 4 vehicles that will be responsible for fulfilling the deliveries within the defined zones. To describe the vehicles and their properties we add:

- A unique ID for each vehicle
- `start_index` to denote the point from where the vehicle would start
- `allowed_zones` to specify the zone where each of the vehicles is allowed to fulfill the deliveries
- `capacity` for each vehicle

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
        {
            "id": "Vehicle 1",
            "start_index": 23,
            "allowed_zones": [
                1
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 2",
            "start_index": 23,
            "allowed_zones": [
                3
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 3",
            "start_index": 23,
            "allowed_zones": [
                4
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 4",
            "start_index": 23,
            "allowed_zones": [
                2
            ],
            "capacity": [
                15
            ]
        }
    ]
```

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "description": "Zone Allocation Example",
    "locations": {
        "id": 1,
        "location": [
            "34.07573047,-118.32586957",
            "34.06807671,-118.32568100",
            "34.05479813,-118.32341816",
            "34.01030758,-118.29222953",
            "34.01838855,-118.27476708",
            "34.003760936904854,-118.2784800143138",
            "34.07683722528893,-118.25476602069384",
            "34.05198593,-118.24931012",
            "34.04026743,-118.26024718",
            "34.08478964922578,-118.2643530343899",
            "34.08428926,-118.28448899",
            "34.07257755058855,-118.28289531144327",
            "34.06838912,-118.30870969",
            "34.06745188,-118.26986426",
            "34.04714248,-118.31719535",
            "34.02464024,-118.29079554",
            "34.01791966,-118.30870969",
            "34.03214165,-118.30022404",
            "34.08010374,-118.27024140",
            "34.06448389,-118.25987004",
            "34.04370503,-118.24346445",
            "34.03636090,-118.23856163",
            "34.03495451,-118.24761299",
            "34.04765255356763,-118.28497498113943"
        ]
    },
    "jobs": [
        {
            "id": "Delivery 1",
            "location_index": 0,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 2",
            "location_index": 1,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 3",
            "location_index": 2,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 4",
            "location_index": 3,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 5",
            "location_index": 4,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 6",
            "location_index": 5,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 7",
            "location_index": 6,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 8",
            "location_index": 7,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 9",
            "location_index": 8,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 10",
            "location_index": 9,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 11",
            "location_index": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 12",
            "location_index": 11,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 13",
            "location_index": 12,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 14",
            "location_index": 13,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 15",
            "location_index": 14,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 16",
            "location_index": 15,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 17",
            "location_index": 16,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 18",
            "location_index": 17,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 19",
            "location_index": 18,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 20",
            "location_index": 19,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 21",
            "location_index": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 22",
            "location_index": 21,
            "delivery": [
                1
            ]
        },
        {
            "id": "Delivery 23",
            "location_index": 22,
            "delivery": [
                1
            ]
        }
    ],
    "zones": [
        {
            "id": 1,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.30092128201433,
                            34.06989391035307
                        ],
                        [
                            -118.31019915834466,
                            34.08493124579347
                        ],
                        [
                            -118.33704570103808,
                            34.07781254109547
                        ],
                        [
                            -118.33596820617596,
                            34.053783138370804
                        ],
                        [
                            -118.32546858200033,
                            34.04357277636396
                        ],
                        [
                            -118.28827674442269,
                            34.04553263572467
                        ],
                        [
                            -118.30092128201433,
                            34.06989391035307
                        ]
                    ]
                ]
            }
        },
        {
            "id": 2,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [

                            -118.29182929234022,
                            34.044587070695044
                        ],
                        [

                            -118.31460902205701,
                            34.02512452844134
                        ],
                        [
                            -118.31488472840473,
                            34.00003093421243
                        ],
                        [
                            -118.26948675260535,
                            33.99537897197098
                        ],
                        [
                            -118.26860371781083,
                            34.02328550811359
                        ],
                        [
                            -118.29182929234022,
                            34.044587070695044
                        ]
                    ]
                ]
            }
        },
        {
            "id": 3,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.27334042060798,
                            34.039342619126785
                        ],
                        [
                            -118.24213431414628,
                            34.02507401058014
                        ],
                        [
                            -118.22393913483447,
                            34.04669248458157
                        ],
                        [
                            -118.23436637488714,
                            34.053290135178706
                        ],
                        [
                            -118.24904361777618,
                            34.05970175578011
                        ],
                        [
                            -118.26552736256674,
                            34.05222947920761
                        ],
                        [
                            -118.27334042060798,
                            34.039342619126785
                        ]
                    ]
                ]
            }
        },
        {
            "id": 4,
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -118.2935793205743,
                            34.082720792084714
                        ],
                        [
                            -118.29085916561404,
                            34.07218744620278
                        ],
                        [
                            -118.28008372958136,
                            34.064988633328
                        ],
                        [
                            -118.25553861793485,
                            34.05641939466491
                        ],
                        [
                            -118.22996983882342,
                            34.075253356769394
                        ],
                        [
                            -118.2511532426955,
                            34.08592654394608
                        ],
                        [
                            -118.27202489511956,
                            34.093871339831054
                        ],
                        [
                            -118.2935793205743,
                            34.082720792084714
                        ]
                    ]
                ]
            }
        }
    ],
    "vehicles": [
        {
            "id": "Vehicle 1",
            "start_index": 23,
            "allowed_zones": [
                1
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 2",
            "start_index": 23,
            "allowed_zones": [
                3
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 3",
            "start_index": 23,
            "allowed_zones": [
                4
            ],
            "capacity": [
                15
            ]
        },
        {
            "id": "Vehicle 4",
            "start_index": 23,
            "allowed_zones": [
                2
            ],
            "capacity": [
                15
            ]
        }
    ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "a08a7edec4583ad094de1ad077c8c48e",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=a08a7edec4583ad094de1ad077c8c48e&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Zone Allocation Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 5956,
      "routes": 4,
      "unassigned": 0,
      "setup": 0,
      "service": 0,
      "duration": 5956,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [23],
      "pickup": [0],
      "distance": 48754
    },
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 1142,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04765255356763, -118.28497498113943],
            "location_index": 23,
            "load": [5],
            "distance": 0,
            "snapped_location": [34.04765, -118.28473]
          },
          {
            "type": "job",
            "arrival": 360,
            "duration": 360,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04714248, -118.31719535],
            "location_index": 14,
            "id": "Delivery 15",
            "load": [4],
            "distance": 3039,
            "internal_id": 1258254653,
            "snapped_location": [34.04717, -118.3172]
          },
          {
            "type": "job",
            "arrival": 523,
            "duration": 523,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05479813, -118.32341816],
            "location_index": 2,
            "id": "Delivery 3",
            "load": [3],
            "distance": 4547,
            "internal_id": 3806970036,
            "snapped_location": [34.05474, -118.32343]
          },
          {
            "type": "job",
            "arrival": 822,
            "duration": 822,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06838912, -118.30870969],
            "location_index": 12,
            "id": "Delivery 13",
            "load": [2],
            "distance": 7131,
            "internal_id": 1157588939,
            "snapped_location": [34.06839, -118.30911]
          },
          {
            "type": "job",
            "arrival": 1003,
            "duration": 1003,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06807671, -118.325681],
            "location_index": 1,
            "id": "Delivery 2",
            "load": [1],
            "distance": 8843,
            "internal_id": 3823747655,
            "snapped_location": [34.06808, -118.32584]
          },
          {
            "type": "job",
            "arrival": 1142,
            "duration": 1142,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07573047, -118.32586957],
            "location_index": 0,
            "id": "Delivery 1",
            "load": [0],
            "distance": 9693,
            "internal_id": 3840525274,
            "snapped_location": [34.07573, -118.32599]
          },
          {
            "type": "end",
            "arrival": 1142,
            "duration": 1142,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07573047, -118.32586957],
            "location_index": 0,
            "load": [0],
            "distance": 9693,
            "snapped_location": [34.07573, -118.32599]
          }
        ],
        "service": 0,
        "duration": 1142,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [5],
        "pickup": [0],
        "distance": 9693,
        "geometry": "<route_geometry>",
        "internal_id": 520918500,
        "profile": "default",
        "adopted_capacity": [15]
      },
      {
        "vehicle": "Vehicle 2",
        "cost": 1376,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04765255356763, -118.28497498113943],
            "location_index": 23,
            "load": [5],
            "distance": 0,
            "snapped_location": [34.04765, -118.28473]
          },
          {
            "type": "job",
            "arrival": 428,
            "duration": 428,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04026743, -118.26024718],
            "location_index": 8,
            "id": "Delivery 9",
            "load": [4],
            "distance": 3318,
            "internal_id": 3706304322,
            "snapped_location": [34.04038, -118.26014]
          },
          {
            "type": "job",
            "arrival": 686,
            "duration": 686,
            "service": 0,
            "waiting_time": 0,
            "location": [34.03495451, -118.24761299],
            "location_index": 22,
            "id": "Delivery 23",
            "load": [3],
            "distance": 5191,
            "internal_id": 1023220892,
            "snapped_location": [34.03489, -118.2477]
          },
          {
            "type": "job",
            "arrival": 925,
            "duration": 925,
            "service": 0,
            "waiting_time": 0,
            "location": [34.0363609, -118.23856163],
            "location_index": 21,
            "id": "Delivery 22",
            "load": [2],
            "distance": 6693,
            "internal_id": 1039998511,
            "snapped_location": [34.03636, -118.23853]
          },
          {
            "type": "job",
            "arrival": 1129,
            "duration": 1129,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04370503, -118.24346445],
            "location_index": 20,
            "id": "Delivery 21",
            "load": [1],
            "distance": 7822,
            "internal_id": 1056776130,
            "snapped_location": [34.04379, -118.24364]
          },
          {
            "type": "job",
            "arrival": 1376,
            "duration": 1376,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05198593, -118.24931012],
            "location_index": 7,
            "id": "Delivery 8",
            "load": [0],
            "distance": 9084,
            "internal_id": 3723081941,
            "snapped_location": [34.05187, -118.24942]
          },
          {
            "type": "end",
            "arrival": 1376,
            "duration": 1376,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05198593, -118.24931012],
            "location_index": 7,
            "load": [0],
            "distance": 9084,
            "snapped_location": [34.05187, -118.24942]
          }
        ],
        "service": 0,
        "duration": 1376,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [5],
        "pickup": [0],
        "distance": 9084,
        "geometry": "<route_geometry>",
        "internal_id": 571251357,
        "profile": "default",
        "adopted_capacity": [15]
      },
      {
        "vehicle": "Vehicle 3",
        "cost": 1697,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04765255356763, -118.28497498113943],
            "location_index": 23,
            "load": [7],
            "distance": 0,
            "snapped_location": [34.04765, -118.28473]
          },
          {
            "type": "job",
            "arrival": 503,
            "duration": 503,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06448389, -118.25987004],
            "location_index": 19,
            "id": "Delivery 20",
            "load": [6],
            "distance": 4708,
            "internal_id": 1073553749,
            "snapped_location": [34.06447, -118.25998]
          },
          {
            "type": "job",
            "arrival": 658,
            "duration": 658,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06745188, -118.26986426],
            "location_index": 13,
            "id": "Delivery 14",
            "load": [5],
            "distance": 6150,
            "internal_id": 1241477034,
            "snapped_location": [34.06743, -118.26982]
          },
          {
            "type": "job",
            "arrival": 818,
            "duration": 818,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07257755058855, -118.28289531144327],
            "location_index": 11,
            "id": "Delivery 12",
            "load": [4],
            "distance": 7622,
            "internal_id": 1140811320,
            "snapped_location": [34.07257, -118.28288]
          },
          {
            "type": "job",
            "arrival": 1003,
            "duration": 1003,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08428926, -118.28448899],
            "location_index": 10,
            "id": "Delivery 11",
            "load": [3],
            "distance": 9142,
            "internal_id": 1191144177,
            "snapped_location": [34.08429, -118.28448]
          },
          {
            "type": "job",
            "arrival": 1226,
            "duration": 1226,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08010374, -118.2702414],
            "location_index": 18,
            "id": "Delivery 19",
            "load": [2],
            "distance": 11155,
            "internal_id": 1056923225,
            "snapped_location": [34.08022, -118.27008]
          },
          {
            "type": "job",
            "arrival": 1396,
            "duration": 1396,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08478964922578, -118.2643530343899],
            "location_index": 9,
            "id": "Delivery 10",
            "load": [1],
            "distance": 12106,
            "internal_id": 1174366558,
            "snapped_location": [34.08497, -118.26475]
          },
          {
            "type": "job",
            "arrival": 1697,
            "duration": 1697,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07683722528893, -118.25476602069384],
            "location_index": 6,
            "id": "Delivery 7",
            "load": [0],
            "distance": 13985,
            "internal_id": 3739859560,
            "snapped_location": [34.07681, -118.25478]
          },
          {
            "type": "end",
            "arrival": 1697,
            "duration": 1697,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07683722528893, -118.25476602069384],
            "location_index": 6,
            "load": [0],
            "distance": 13985,
            "snapped_location": [34.07681, -118.25478]
          }
        ],
        "service": 0,
        "duration": 1697,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [7],
        "pickup": [0],
        "distance": 13985,
        "geometry": "<route_geometry>",
        "internal_id": 554473738,
        "profile": "default",
        "adopted_capacity": [15]
      },
      {
        "vehicle": "Vehicle 4",
        "cost": 1741,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04765255356763, -118.28497498113943],
            "location_index": 23,
            "load": [6],
            "distance": 0,
            "snapped_location": [34.04765, -118.28473]
          },
          {
            "type": "job",
            "arrival": 491,
            "duration": 491,
            "service": 0,
            "waiting_time": 0,
            "location": [34.003760936904854, -118.2784800143138],
            "location_index": 5,
            "id": "Delivery 6",
            "load": [5],
            "distance": 6020,
            "internal_id": 3756637179,
            "snapped_location": [34.00379, -118.27848]
          },
          {
            "type": "job",
            "arrival": 720,
            "duration": 720,
            "service": 0,
            "waiting_time": 0,
            "location": [34.01838855, -118.27476708],
            "location_index": 4,
            "id": "Delivery 5",
            "load": [4],
            "distance": 7805,
            "internal_id": 3773414798,
            "snapped_location": [34.01854, -118.27474]
          },
          {
            "type": "job",
            "arrival": 1033,
            "duration": 1033,
            "service": 0,
            "waiting_time": 0,
            "location": [34.01030758, -118.29222953],
            "location_index": 3,
            "id": "Delivery 4",
            "load": [3],
            "distance": 10137,
            "internal_id": 3790192417,
            "snapped_location": [34.01034, -118.29223]
          },
          {
            "type": "job",
            "arrival": 1275,
            "duration": 1275,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02464024, -118.29079554],
            "location_index": 15,
            "id": "Delivery 16",
            "load": [2],
            "distance": 11877,
            "internal_id": 1207921796,
            "snapped_location": [34.0247, -118.2908]
          },
          {
            "type": "job",
            "arrival": 1463,
            "duration": 1463,
            "service": 0,
            "waiting_time": 0,
            "location": [34.03214165, -118.30022404],
            "location_index": 17,
            "id": "Delivery 18",
            "load": [1],
            "distance": 13569,
            "internal_id": 1040145606,
            "snapped_location": [34.03214, -118.30026]
          },
          {
            "type": "job",
            "arrival": 1741,
            "duration": 1741,
            "service": 0,
            "waiting_time": 0,
            "location": [34.01791966, -118.30870969],
            "location_index": 16,
            "id": "Delivery 17",
            "load": [0],
            "distance": 15992,
            "internal_id": 1224699415,
            "snapped_location": [34.01779, -118.30873]
          },
          {
            "type": "end",
            "arrival": 1741,
            "duration": 1741,
            "service": 0,
            "waiting_time": 0,
            "location": [34.01791966, -118.30870969],
            "location_index": 16,
            "load": [0],
            "distance": 15992,
            "snapped_location": [34.01779, -118.30873]
          }
        ],
        "service": 0,
        "duration": 1741,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [6],
        "pickup": [0],
        "distance": 15992,
        "geometry": "<route_geometry>",
        "internal_id": 470585643,
        "profile": "default",
        "adopted_capacity": [15]
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

Following image shows a visual representation of the above route plan

![Sample route plan when vehicles are allowed to fulfill tasks in given zones](https://static.nextbillion.io/docs-next/docs/route-optimization/zone-allocation-new.webp)

_Route Plan for zone based allocation_

## Analyzing the Solution

From the result we observe that:

- All the tasks were assigned and the total cost of the route plan is 4247
- Each of the vehicles fulfill tasks from its assigned zones only, without any overlapping regions.

The above example exhibits how NextBillion.ai’s Route Optimization API allows users to create custom zones and then choose which vehicles can fulfill tasks in what zones, ensuring streamlined operations and better service delivery. We encourage you to go ahead and try out different ways of configuring zones, using [Geofence API](https://docs.nextbillion.ai/tracking/geofence-api), and letting the service auto-allocate tasks to the zone as per their geolocation and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
