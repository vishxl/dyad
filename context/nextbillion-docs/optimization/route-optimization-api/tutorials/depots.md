# Depots

Depots are an important piece of any logistic operations and serve as a center for fulfilling customer orders. In the last mile or on-demand delivery line of businesses, depots are used to fulfill orders of multiple or single inventory types, or they can be used to serve orders within a specific area of a large city, or facilitating reverse logistics scenarios among many other functions.

NextBillion.ai’s Route Optimization API is capable of emulating real-world parameters of depot operations to solve route planning problems involving depots, efficiently. In this example we are going to solve scenarios of managing deliveries and reverse logistics using depots.

## Setup

We have 4 depots which can serve orders for multiple regions and inventory types. Using these depots we want to fulfill a total of 8 orders 6 deliveries and 2 pick-ups. We use 4 delivery vans to fulfill these orders. Let’s configure each of these entities one by one below. Locations First, we define the `locations` object and add all the location coordinates used in the problem along with a valid `id`. The `locations` object used in this example:

```json
    "locations": {
        "id": 1,
        "location": [
            "34.06173622,-118.32402555",
            "34.06266790,-118.33873187",
            "34.06871599,-118.33873626",
            "34.06186820,-118.31180940",
            "34.06925486,-118.32394628",
            "34.07119806,-118.32022049",
            "34.07119806,-118.31263094",
            "34.05908092,-118.33498563",
            "34.05725176,-118.33967735",
            "34.05296453,-118.33677952",
            "34.05833783,-118.31442483",
            "34.05445079,-118.30952612"
        ]
    }
```

### Jobs

Next, we define the 6 delivery and 2 pickup jobs in our problem statement. For these tasks we add:

- A unique identifier for each task
- Location indexes for each task
- Specify depots which can fulfill each task
- Delivery quantities for each of 6 delivery tasks and pickup quantities for each of the 2 pickup tasks

Following is the JSON we use in this example:

```json
"jobs": [
      {
          "id": "Delivery 1",
          "location_index": 4,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 1"
     ]
      },
      {
          "id": "Delivery 2",
          "location_index": 5,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 2"
     ]
      },
      {
          "id": "Delivery 3",
          "location_index": 6,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 3"
     ]
      },
      {
          "id": "Delivery 4",
          "location_index": 7,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 4"
     ]
      },
      {
          "id": "Delivery 5",
          "location_index": 8,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 1"
     ]
      },
      {
          "id": "Delivery 6",
          "location_index": 9,
          "service": 300,
          "delivery": [
              1
          ],
           "depot_ids": [
       "depot 2"
     ]
      },
      {
          "id": "Pickup 1",
          "location_index": 10,
          "service": 300,
          "pickup": [
              1
          ],
           "depot_ids": [
       "depot 3"
     ]
      },
      {
          "id": "Pickup 2",
          "location_index": 11,
          "service": 300,
          "pickup": [
              1
          ],
           "depot_ids": [
       "depot 4"
     ]
      }
  ]
```

### Depots

Next we specify the depots and their locations. These depots will be used to fulfill the tasks as per their configuration. The depot attribute used in the problem is:

```json
{
  "depots": [
    {
      "id": "depot 1",
      "location_index": 0
    },
    {
      "id": "depot 2",
      "location_index": 1
    },
    {
      "id": "depot 3",
      "location_index": 2
    },
    {
      "id": "depot 4",
      "location_index": 3
    }
  ]
}
```

### Vehicles

Now we configure 4 delivery vans that will be responsible for fulfilling the tasks. We specify:

- A unique ID for each vehicle
- `start_depot_ids` to denote the vehicles which can fulfill the delivery tasks.
- `end_depot_ids` to denote the vehicles which can fulfill the pickup tasks
- If a vehicle can fulfill both delivery and pickup type of tasks then, we need to configure both `start_depot_ids` and `end_depot_ids`.

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
{
  "vehicles": [
    {
      "id": 1,
      "start_depot_ids": ["depot 1"],
      "capacity": [5]
    },
    {
      "id": 2,
      "start_depot_ids": ["depot 2"],
      "capacity": [5]
    },
    {
      "id": 3,
      "start_depot_ids": ["depot 3"],
      "end_depot_ids": ["depot 3"],
      "capacity": [5]
    },
    {
      "id": 4,
      "start_depot_ids": ["depot 4"],
      "end_depot_ids": ["depot 4"],
      "capacity": [5]
    }
  ]
}
```

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash

curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Depots Example",
   "locations": {
       "id": 1,
       "location": ["34.06173622,-118.32402555","34.06266790,-118.33873187","34.06871599,-118.33873626","34.06186820,-118.31180940","34.06925486,-118.32394628","34.07119806,-118.32022049","34.07119806,-118.31263094","34.05908092,-118.33498563","34.05725176,-118.33967735","34.05296453,-118.33677952","34.05833783,-118.31442483","34.05445079,-118.30952612"]
   },
    "depots":[
      {
         "id":"depot 1",
         "location_index":0
      },
      {
         "id":"depot 2",
         "location_index":1
      },
       {
         "id":"depot 3",
         "location_index":2
      },
      {
         "id":"depot 4",
         "location_index":3
      }
    ],

   "jobs": [
       {
           "id": "Delivery 1",
           "location_index": 4,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 1"
      ]
       },
       {
           "id": "Delivery 2",
           "location_index": 5,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 2"
      ]
       },
       {
           "id": "Delivery 3",
           "location_index": 6,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 3"
      ]
       },
       {
           "id": "Delivery 4",
           "location_index": 7,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 4"
      ]
       },
       {
           "id": "Delivery 5",
           "location_index": 8,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 1"
      ]
       },
       {
           "id": "Delivery 6",
           "location_index": 9,
           "service": 300,
           "delivery": [
               1
           ],
            "depot_ids": [
        "depot 2"
      ]
       },
       {
           "id": "Pickup 1",
           "location_index": 10,
           "service": 300,
           "pickup": [
               1
           ],
            "depot_ids": [
        "depot 3"
      ]
       },
       {
           "id": "Pickup 2",
           "location_index": 11,
           "service": 300,
           "pickup": [
               1
           ],
            "depot_ids": [
        "depot 4"
      ]
       }
   ],
   "vehicles": [
       {
           "id": 1,
            "start_depot_ids": [
        "depot 1"
      ],
           "capacity": [
               5
           ]
       },
       {
           "id": 2,
           "start_depot_ids": [
        "depot 2"
      ],
           "capacity": [
               5
           ]
    },
    {
           "id": 3,

           "start_depot_ids": [
            "depot 3"
          ],
           "end_depot_ids": [
            "depot 3"
          ],
           "capacity": [
               5
           ]
    },
    {
           "id": 4,
           "start_depot_ids": [
            "depot 4"
          ],
           "end_depot_ids": [
            "depot 4"
          ],
           "capacity": [
               5
           ]
    }
  ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "4ce63ea6eceee3eb70eb4d21437ddf94",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=4ce63ea6eceee3eb70eb4d21437ddf94
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```bash
{
    "description": "Depots Example",
    "result": {
        "code": 0,
        "summary": {
            "cost": 2949,
            "routes": 4,
            "unassigned": 0,
            "setup": 0,
            "service": 2400,
            "duration": 2949,
            "waiting_time": 0,
            "priority": 0,
            "delivery": [
                6
            ],
            "pickup": [
                2
            ],
            "distance": 22754
        },
        "routes": [
            {
                "vehicle": 2,
                "cost": 625,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.0626679,
                            -118.33873187
                        ],
                        "location_index": 1,
                        "load": [
                            2
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.06267,
                            -118.33861
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 213,
                        "duration": 213,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.05296453,
                            -118.33677952
                        ],
                        "location_index": 9,
                        "id": "Delivery 6",
                        "load": [
                            1
                        ],
                        "distance": 1609,
                        "long_id": "3756637179",
                        "internal_id": 3756637179,
                        "snapped_location": [
                            34.05289,
                            -118.33679
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 925,
                        "duration": 625,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.07119806,
                            -118.32022049
                        ],
                        "location_index": 5,
                        "id": "Delivery 2",
                        "load": [
                            0
                        ],
                        "distance": 4735,
                        "long_id": "3823747655",
                        "internal_id": 3823747655,
                        "snapped_location": [
                            34.07128,
                            -118.32021
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1225,
                        "duration": 625,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.07119806,
                            -118.32022049
                        ],
                        "location_index": 5,
                        "load": [
                            0
                        ],
                        "distance": 4735,
                        "snapped_location": [
                            34.07128,
                            -118.32021
                        ]
                    }
                ],
                "service": 600,
                "duration": 625,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    0
                ],
                "distance": 4735,
                "geometry": "uz{nEh_hqUJ?N?LAPALANKLAD?VILEB?FCJELAJAHAJ@V?\\JlCt@b@Ld@LjBf@tCx@`@L`@L\\HbAZjAZZHVFh@L`@H@c@@aA?S?U@aB@g@?e@@s@?c@@uA?m@@o@?cC@u@@{@@o@?sA?Y?QFBHB|JbDbLbDA^@_@HwAL_CBa@k@QWGeDaA[IKEe@M_@KyDiAmEqAWIkA][K]Ia@Mo@SyEuAm@S_@KICgFyA{Ae@g@Oc@KYI[KWKSEQG_@QQKGCGAi@CQ?}A@o@?[@g@?UAS?QAQCOCUCSEe@Oc@Su@a@{CaBa@S[OIC]G]G]Ee@EU?SA[?W?eK@A{A?g@?mA?a@?[?g@?e@?_@?E?]?}@?_@?k@?q@?k@?e@?a@Ac@?_A?aA?{@?g@?S?q@?M?c@?qA?[?Q?U?S?aA?i@?a@?Y?k@OAYEa@Ig@OcDiAk@Uk@UmAk@OWMYCKEWAi@@kABa@D[Dk@B_@??",
                "internal_id": 2
            },
            {
                "vehicle": 1,
                "cost": 600,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06173622,
                            -118.32402555
                        ],
                        "location_index": 0,
                        "load": [
                            2
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.06176,
                            -118.32412
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 260,
                        "duration": 260,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.06925486,
                            -118.32394628
                        ],
                        "location_index": 4,
                        "id": "Delivery 1",
                        "load": [
                            1
                        ],
                        "distance": 1429,
                        "long_id": "3840525274",
                        "internal_id": 3840525274,
                        "snapped_location": [
                            34.06937,
                            -118.32367
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 900,
                        "duration": 600,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.05725176,
                            -118.33967735
                        ],
                        "location_index": 8,
                        "id": "Delivery 5",
                        "load": [
                            0
                        ],
                        "distance": 4116,
                        "long_id": "3773414798",
                        "internal_id": 3773414798,
                        "snapped_location": [
                            34.05707,
                            -118.33968
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1200,
                        "duration": 600,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.05725176,
                            -118.33967735
                        ],
                        "location_index": 8,
                        "load": [
                            0
                        ],
                        "distance": 4116,
                        "snapped_location": [
                            34.05707,
                            -118.33968
                        ]
                    }
                ],
                "service": 600,
                "duration": 600,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    2
                ],
                "pickup": [
                    0
                ],
                "distance": 4116,
                "geometry": "_u{nEvdeqUGCC?C?@yB?M?c@@mAU@cA@U?uF?uI@kJ@iG@iA?U??j@?X?`@?h@eA?UIyF@s@?i@@?P`E?tC@FELGdA??`A?R?T?P?Z?pA?b@?L?p@?R?f@?z@?`A?~@@b@?`@?d@?j@\\Ap@AN?X?nB?`C?xHAV?T?ZBVBxBXh@FJB`@DVDR@RBV@X@B?b@@|@AfA?b@?jAAP@?j@?T?d@AnA?T?PAjAAhA?rAA`@?bA?\\Af@?^?l@AbBPJ^PPFRDVJZJXHb@Jf@NzAd@fFxAHB^Jl@RxEtAn@R`@L\\HZJCTCTAZ?f@?@@FAf@Al@?X?H?P?X?rAAn@Az@At@?bCAn@?l@AtA?b@Ar@?d@Af@A`B?T?RAd@??",
                "internal_id": 1
            },
            {
                "vehicle": 3,
                "cost": 899,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06871599,
                            -118.33873626
                        ],
                        "location_index": 2,
                        "load": [
                            1
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.06872,
                            -118.33862
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 371,
                        "duration": 371,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.05833783,
                            -118.31442483
                        ],
                        "location_index": 10,
                        "id": "Pickup 1",
                        "load": [
                            2
                        ],
                        "distance": 3326,
                        "long_id": "4270619178",
                        "internal_id": 4270619178,
                        "snapped_location": [
                            34.05834,
                            -118.31426
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 895,
                        "duration": 595,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.07119806,
                            -118.31263094
                        ],
                        "location_index": 6,
                        "id": "Delivery 3",
                        "load": [
                            1
                        ],
                        "distance": 4874,
                        "long_id": "3806970036",
                        "internal_id": 3806970036,
                        "snapped_location": [
                            34.07113,
                            -118.31263
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1499,
                        "duration": 899,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.06871599,
                            -118.33873626
                        ],
                        "location_index": 2,
                        "load": [
                            1
                        ],
                        "distance": 7522,
                        "snapped_location": [
                            34.06872,
                            -118.33862
                        ]
                    }
                ],
                "service": 600,
                "duration": 899,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    1
                ],
                "pickup": [
                    1
                ],
                "distance": 7522,
                "geometry": "o`}nEj_hqUB?b@?v@?hF@b@?X?xE?pBAb@?^AnA?bC?hD?^?N?N?LAPALANKLAD?@}A@e@?_@?g@@aA@qB@yB@cB@s@?[?M?c@@o@@wA?w@@}@@cA@_B?U?Q?w@BuB@cB?m@?_@@g@?]?cA@a@?sA@iA@kA?Q?U@oA?e@?U?k@@W?O?q@?e@@S@aC@qA?M?M@_A@o@?c@?m@@iA@q@@yB?M?c@@mABoB@_A@mBByC@kA?}@@{@?Y@iA@gA?I?q@?c@@c@?g@?K?I?M?i@@e@?_C?eC?c@@uBA_@?i@?g@?]JMBEFEFGVSf@FN?J@H@J?h@?P?xA@\\AF?J?NALA`@EPAXCNAP?x@?xA?b@?c@?yA?y@?Q?O@YBQ@a@DM@O@K?G?]@yAAQ?i@?K?IAKAO?g@GYEKEQEKEMEYEOCUAGGMAY?Q?cA?S?MDi@AWA[?W?U?wE?oBBU@gB?kF@c@?kE?[?U?W?E?CAGAIAEAEGEIEI?e@?[?O?I?eA?o@iI?w@?m@@?m@?l@?~AAnA?z@@R?LF?r@?P?h@?H?bDAR?l@?F?JAHBLFLJDFFR?N?Z?Z?V?@?j@BbB?l@Ab@?^?fB?fA?f@?t@?|B@~@?|@?`C?d@?z@?~@?xB?h@?~@?z@?dC?f@?x@?j@?X?`@?h@?`A?R?T?P?Z?pA?b@?L?p@?R?f@?z@?`A?~@@b@?`@?d@?j@?p@?j@?^?|@?\\?D?^?d@?f@?Z?`@?lA?f@@zA?|B?fB?x@?fA?lA?xA?R@bB?j@?b@?j@?^?nA?lA?h@?dA?d@?b@?bC?b@@l@?n@?V?R?L?j@?P?V?b@?h@?V`@AB?",
                "internal_id": 3
            },
            {
                "vehicle": 4,
                "cost": 825,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.0618682,
                            -118.3118094
                        ],
                        "location_index": 3,
                        "load": [
                            1
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.0617,
                            -118.31181
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 185,
                        "duration": 185,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.05445079,
                            -118.30952612
                        ],
                        "location_index": 11,
                        "id": "Pickup 2",
                        "load": [
                            2
                        ],
                        "distance": 1019,
                        "long_id": "4253841559",
                        "internal_id": 4253841559,
                        "snapped_location": [
                            34.05444,
                            -118.30953
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 824,
                        "duration": 524,
                        "service": 300,
                        "waiting_time": 0,
                        "location": [
                            34.05908092,
                            -118.33498563
                        ],
                        "location_index": 7,
                        "id": "Delivery 4",
                        "load": [
                            1
                        ],
                        "distance": 3994,
                        "long_id": "3790192417",
                        "internal_id": 3790192417,
                        "snapped_location": [
                            34.05918,
                            -118.33499
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 1425,
                        "duration": 825,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.0618682,
                            -118.3118094
                        ],
                        "location_index": 3,
                        "load": [
                            1
                        ],
                        "distance": 6381,
                        "snapped_location": [
                            34.0617,
                            -118.31181
                        ]
                    }
                ],
                "service": 600,
                "duration": 825,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    1
                ],
                "pickup": [
                    1
                ],
                "distance": 6381,
                "geometry": "st{nExwbqU?m@?oAj@?d@?zB?dE?|B?hEAvE?dD?v@?xBB~CF?{E?mB?I?H?lB?zE?zD?nE@nEj@?X?r@BZBF@VDHBNDPHNFJF@@NJNLRNbAz@?N?PBpB@n@@T?F?R@r@Cx@AN?HCTABEREVSv@WhAI^a@fB_@vAW`AOh@]nAK^i@lBa@|AGRQr@GRMj@St@EPER_@tACLI^I`@CPAHC\\ARATCRE|@En@QtCM`C[pFI`BAHG|@EZCVGb@CJGXERUfACPSdA[fBOx@GTETYzAa@rB]lBc@|BSfAI^AFWlAGXETCTCTAZ?f@?@@FAf@Al@?X?H?P?X?rAAn@Az@GAGC}K}CC]Aa@?_@De@TaBBOBU@Y@S@S?[@a@@i@@e@_@KICgFyA{Ae@g@Oc@KYI[KWKSEQG_@QQK@cB?m@?_@@g@?]?cA@a@?sA@iA@kA?Q?U@oA?e@?U?k@@W?O?q@?e@@S@aC@qA?M?M@_A@o@?c@?m@@iA@q@@yB?M?c@@mABoB@_A@mBByC@kA?}@@{@?Y@iA@gA?I?q@?c@@c@?g@?K?I?M?i@@e@?_C?eC?c@@uBA_@?i@?g@?]?gA?a@?g@@O?K?SHS?M?a@?eA?QAiC?G?KIQ?W",
                "internal_id": 4
            }
        ]
    },
    "status": "Ok",
    "message": ""
}
```

Following image shows a visual representation of the above route plan.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/depot.webp)

## Analyzing the Solution

Looking at the result we can observe that:

- All task were fulfilled and the total cost of the solution is 2949
- Vehicles starting from depot 1 and depot 2 fulfilled 2 delivery tasks each
- Vehicles starting from depot 3 & 4 completed 1 delivery and 1 pickup each and returned to the specified depot with the picked-up goods.

The above example exhibits how NextBillion.ai’s Route Optimization API uses the depots to serve the tasks provided and suggests the best solution. We encourage you to go ahead and try out different configurations of depots, delivery and pickup tasks and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
