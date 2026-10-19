# Vehicle: Max Travel Cost and Max Tasks

In this example we will learn about some useful vehicle constraints. NextBillion.ai’s Route Optimization API provides options to control the maximum number of tasks that a vehicle can serve and also the maximum travel cost that it can incur. These parameters can be used to limit the usage of vehicles and prevent them against unexpected high costs, potential breakdowns or just control the fuel consumptions.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please [contact us](mailto:support@nextbillion.ai) to get your API key now!

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### Jobs & Shipments

We start by defining 10 jobs and 3 shipments. For these tasks we add:

- A unique identifier for each task

- Location indexes for each task

- The schedule of tasks. This is done by adding time windows within which a task must be completed. We have added a 15 min time window for all tasks for the sake of simplicity, but Route Optimization API can handle complex task schedules as well.

- The actual time taken to complete the tasks once the driver/vehicle is at the task’s location i.e. the service time for each task.

- Pick-up and delivery quantities for `shipments` and `jobs`. Since we are adding capacities for the `vehicles`, we are adding quantities for jobs as `pickup=[0]`. Please refer to the Basic Route Optimization example to know more.

Let’s take a look at the `jobs` JSON after the above properties are configured:

```json
  "jobs": [
    {
      "id": 1,
      "location_index": 0,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693386000,
          1693386900
        ]
      ]
    },
    {
      "id": 2,
      "location_index": 1,
      "service": 180,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693387800,
          1693388700
        ]
      ]
    },
    {
      "id": 3,
      "location_index": 2,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693389600,
          1693390500
        ]
      ]
    },
    {
      "id": 4,
      "location_index": 3,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693391400,
          1693392300
        ]
      ]
    },
    {
      "id": 5,
      "location_index": 4,
      "service": 60,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693393200,
          1693394100
        ]
      ]
    },
    {
      "id": 6,
      "location_index": 5,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693396800,
          1693397700
        ]
      ]
    },
    {
      "id": 7,
      "location_index": 6,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693398600,
          1693399500
        ]
      ]
    },
    {
      "id": 8,
      "location_index": 7,
      "service": 150,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693401300,
          1693402200
        ]
      ]
    },
    {
      "id": 9,
      "location_index": 8,
      "service": 80,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693404000,
          1693404900
        ]
      ]
    },
    {
      "id": 10,
      "location_index": 9,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693405800,
          1693406700
        ]
      ]
    }
  ],
  "shipments": [
    {
      "pickup": {
        "description": "Shipment Pickup 1",
        "id": 1,
        "location_index": 10,
        "service": 120,
        "time_windows": [
          [
            1693395000,
            1693395900
          ]
        ]
      },
      "delivery": {
        "description": "Shipment Delivery 1",
        "id": 1,
        "location_index": 11,
        "service": 120,
        "time_windows": [
          [
            1693397700,
            1693398600
          ]
        ]
      },
      "amount": [
        2
      ]
    },
    {
      "pickup": {
        "description": "Shipment Pickup 2",
        "id": 2,
        "location_index": 12,
        "service": 120,
        "time_windows": [
          [
            1693399500,
            1693400400
          ]
        ]
      },
      "delivery": {
        "description": "Shipment Delivery 2",
        "id": 2,
        "location_index": 13,
        "service": 120,
        "time_windows": [
          [
            1693402200,
            1693403100
          ]
        ]
      },
      "amount": [
        2
      ]
    },
    {
      "pickup": {
        "description": "Shipment Pickup 3",
        "id": 3,
        "location_index": 14,
        "service": 120,
        "time_windows": [
          [
            1693400400,
            1693401300
          ]
        ]
      },
      "delivery": {
        "description": "Shipment Delivery 3",
        "id": 3,
        "location_index": 15,
        "service": 120,
        "time_windows": [
          [
            1693407600,
            1693408500
          ]
        ]
      },
      "amount": [
        2
      ]
    }
  ]
```

### Vehicles

Next, we add 4 vehicles that are going to fulfill the tasks within the defined constraints. To describe the vehicles and their properties we add:

- A unique ID for each vehicle

- Vehicle shift time or the time window

- Capacity to denote the amount of load that the vehicle can take

- Start_index to denote the point from where the vehicle would start.

- Costs for all vehicles. We have specified `fixed` cost for all vehicles and `per_hour`cost for two of the vehicles.
  - `max_travel_cost` to put a cap on the traveling cost that a vehicle can incur. We are going with 5000 seconds as the maximum cost per vehicle. Please observe that

  - cost here is in seconds, as we are not explicitly mentioning any `travel_cost` settings. Therefore, the solver goes with the default setting of `duration` for cost.

  - the max_travel_cost applies only to the “traveling” cost of the vehicle. Individual vehicle’s costs - `per_hour` or `fixed` - are outside the scope of this constraint. Therefore, the final cost may turn out to be more than that specified for `max_travel_cost`. We are covering such a case in this example. Please refer to [Analyzing the Solution](#analyzing-the-solution) section.

- `max_tasks` to limit the number of tasks that each vehicle can take. We set this constraint to 5 tasks for each vehicle. It needs to be highlighted here that a job represents 1 task whereas a shipment represents 2 tasks (1 each for the pickup and the delivery step).

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
  "vehicles": [
    {
      "id": 1,
      "start_index": 16,
      "capacity": [
        20
      ],
      "costs": {
        "fixed": 1000,
        "per_hour": 5400
      },
      "time_window": [
        1693382400,
        1693418400
      ],
      "max_tasks": 5,
      "max_travel_cost": 5000
    },
    {
      "id": 2,
      "start_index": 17,
      "capacity": [
        20
      ],
      "costs": {
        "fixed": 3000,
        "per_hour": 3600
      },
      "time_window": [
        1693382400,
        1693418400
      ],
      "max_tasks": 5,
      "max_travel_cost": 5000
    },
    {
      "id": 3,
      "start_index": 18,
      "capacity": [
        20
      ],
      "costs": {
        "fixed": 4000
      },
      "time_window": [
        1693382400,
        1693418400
      ],
      "max_tasks": 5,
      "max_travel_cost": 5000
    },
    {
      "id": 4,
      "capacity": [
        20
      ],
      "start_index": 19,
      "costs": {
        "fixed": 3000
      },
      "time_window": [
        1693382400,
        1693418400
      ],
      "max_tasks": 5,
      "max_travel_cost": 5000
    }
  ]
```

### Locations

And lastly, we would define the `locations` object by adding all the locations used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

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

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Vehicle MaxTravelCost & MaxTask Example",
   "jobs": [
       {
           "id": 1,
           "location_index":0,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693386000,
                   1693386900
               ]
           ]
       },
       {
           "id": 2,
           "location_index": 1,
           "service": 180,
           "pickup":[0],
           "time_windows": [
               [
                   1693387800,
                   1693388700
               ]
           ]
       },
       {
           "id": 3,
           "location_index": 2,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693389600,
                   1693390500
               ]
           ]
       },
       {
           "id": 4,
           "location_index": 3,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693391400,
                   1693392300
               ]
           ]
       },
       {
           "id": 5,
           "location_index": 4,
           "service": 60,
           "pickup":[0],
           "time_windows": [
               [
                   1693393200,
                   1693394100
               ]
           ]
       },
       {
           "id": 6,
           "location_index": 5,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693396800,
                   1693397700
               ]
           ]
       },
       {
           "id": 7,
           "location_index": 6,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693398600,
                   1693399500
               ]
           ]
       },
       {
           "id": 8,
           "location_index": 7,
           "service": 150,
           "pickup":[0],
           "time_windows": [
               [
                   1693401300,
                   1693402200
               ]
           ]
       },
       {
           "id": 9,
           "location_index": 8,
           "service": 80,
           "pickup":[0],
           "time_windows": [
               [
                   1693404000,
                   1693404900
               ]
           ]
       },
       {
           "id": 10,
           "location_index": 9,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693405800,
                   1693406700
               ]
           ]
       }
   ],
   "shipments": [
       {
        "pickup":{
           "description": "Shipment Pickup 1",
           "id":1,
           "location_index":10,
           "service":120,
           "time_windows":[[1693395000,1693395900]]
        },
        "delivery":{
           "description": "Shipment Delivery 1",
           "id":1,
           "location_index":11,
           "service":120,
           "time_windows":[[1693397700,1693398600]]
        },
        "amount":[2]
        },
        {
         "pickup":{
           "description": "Shipment Pickup 2",
           "id":2,
           "location_index":12,
           "service":120,
           "time_windows":[[1693399500,1693400400]]
        },
        "delivery":{
           "description": "Shipment Delivery 2",
           "id":2,
           "location_index":13,
           "service":120,
           "time_windows":[[1693402200,1693403100]]
        },
        "amount":[2]
       },
       {
         "pickup":{
           "description": "Shipment Pickup 3",
           "id":3,
           "location_index":14,
           "service":120,
           "time_windows":[[1693400400,1693401300]]
        },
        "delivery":{
           "description": "Shipment Delivery 3",
           "id":3,
           "location_index":15,
           "service":120,
           "time_windows":[[1693407600,1693408500]]
        },
        "amount":[2]
       }
   ],
   "vehicles": [
       {
           "id": 1,
           "start_index": 16,
           "capacity":[20],
           "costs":{
               "fixed":1000,
               "per_hour":5400
            },
           "time_window": [
               1693382400,
                   1693418400
           ],
           "max_tasks": 5,
           "max_travel_cost": 5000
       },
       {
           "id": 2,
           "start_index": 17,
           "capacity":[20],
           "costs":{
               "fixed":3000,
               "per_hour": 3600
            },
           "time_window": [
               1693382400,
                   1693418400
           ],
           "max_tasks": 5,
           "max_travel_cost": 5000
       },
       {
           "id": 3,
           "start_index": 18,
           "capacity":[20],
           "costs":{
               "fixed":4000
            },
           "time_window": [
            1693382400,
                1693418400
           ],
           "max_tasks": 5,
           "max_travel_cost": 5000
       },
       {
           "id": 4,
           "capacity":[20],
           "start_index": 19,
           "costs":{
               "fixed":3000
            },
           "time_window": [
           1693382400,
                   1693418400
           ],
           "max_tasks": 5,
           "max_travel_cost": 5000
       }
   ],
    "locations":
        {
            "id": 1,
            "location": ["34.083950,-118.318640", "34.054927,-118.323726","34.075525,-118.361588","34.076350,-118.338519","34.090425,-118.338933","34.037925,-118.459842","34.004364,-118.421170", "34.000215,-118.318803","33.945884,-118.325628","34.000895,-118.204929", "34.076646,-118.376969","34.094986,-118.300885","34.018780,-118.317919","33.996658,-118.261708", "33.916595,-118.240132", "33.946275,-118.385486","34.057106,-118.361326", "34.016137,-118.253523", "33.940407,-118.265196","33.974060,-118.246945"]
        }
}
'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "96ba15bf2ef178053929bedd3b0f7d56",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=96ba15bf2ef178053929bedd3b0f7d56
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Vehicle MaxTravelCost & MaxTask Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 21899,
      "routes": 4,
      "unassigned": 0,
      "setup": 0,
      "service": 1910,
      "duration": 10502,
      "waiting_time": 25569,
      "priority": 0,
      "delivery": [6],
      "pickup": [6],
      "distance": 141270.5
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 2191,
        "steps": [
          {
            "type": "start",
            "arrival": 1693388364,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.057106, -118.361326],
            "location_index": 16,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693388700,
            "duration": 336,
            "service": 180,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 1,
            "id": 2,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693389206,
            "duration": 662,
            "service": 120,
            "waiting_time": 2194,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "id": 4,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693391652,
            "duration": 794,
            "service": 60,
            "waiting_time": 1548,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "id": 5,
            "load": [0]
          },
          {
            "type": "end",
            "arrival": 1693393260,
            "duration": 794,
            "service": 0,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "load": [0]
          }
        ],
        "service": 360,
        "duration": 794,
        "waiting_time": 3742,
        "priority": 0,
        "delivery": [0],
        "pickup": [0],
        "distance": 8868.1,
        "geometry": "ywznEjmlqUBG@G@GAEEEMIw@[q@WLoA@KB[JmAB_@?U@[?a@?iABiD?u@@c@@aB@iB@g@?S@_ABsF@aB?s@?k@@o@?m@@g@?UBgBB{EDcF@s@@qD@aB@[@gA?y@?]BuB?}@?W@m@?Q?W@{@?]?K@M?kA?Q?U?I@_@BuE@qA@W?c@DcB?u@?y@?M@}B@mA?]@g@@y@@s@@c@@aA?S?U@aB@g@?e@@s@?c@@uA?m@@o@?cC@u@@{@@o@?sA?Y?Q?I?Y@m@@g@AG?A?g@@[BUBUDUFYVmA@GH_@RgAb@}B\\mB`@sBX{ADUFUNy@ZgBReABQTgADSFYBKFc@BWD[F}@@IHaBZqFLaCPuCDo@D}@BS_@C^BCRE|@En@QtCM`C[pFI`BAHG|@EZCVGb@CJGXERUfACPSdA[fBOx@GTETYzAa@rB]lBc@|BSfAI^AFWlAGXETCTCTAZ?f@?@@FAf@Al@?X?H?P?X?rAAn@Az@At@?bCAn@?l@AtA?b@Ar@?d@Af@A`B?T?RA`AAb@a@Ii@MWG[IkA[cA[]Ia@Ma@MuCy@kBg@e@Mc@MmCu@]KW?KAI@K@M@KDGBC?MDWHE?M@QIM?O@O?}@@mB?cAAoC@w@?c@?c@@mB@Q?gE?_@?_@?_D?cAAkB@a@?g@?gAA}B@_E?kA?cF?iE?{A?gA@gCAM?s@@yBA]?a@?M?Q?{B?iF@iDAY?gEB_IAaFA[@[?_@?i@?{@?[?m@?cB?G?E?QLw@?sA@S?M?W?oA?U?W?aA?]?c@?y@?[?eB?W?S?i@?s@?oA?U?M?eA?U?q@@Y@U???"
      },
      {
        "vehicle": 4,
        "cost": 5171,
        "steps": [
          {
            "type": "start",
            "arrival": 1693400619,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.97406, -118.246945],
            "location_index": 19,
            "load": [0]
          },
          {
            "type": "pickup",
            "arrival": 1693401300,
            "duration": 681,
            "service": 120,
            "waiting_time": 0,
            "location": [33.916595, -118.240132],
            "location_index": 14,
            "id": 3,
            "load": [2],
            "description": "Shipment Pickup 3"
          },
          {
            "type": "job",
            "arrival": 1693402236,
            "duration": 1497,
            "service": 80,
            "waiting_time": 1764,
            "location": [33.945884, -118.325628],
            "location_index": 8,
            "id": 9,
            "load": [2]
          },
          {
            "type": "delivery",
            "arrival": 1693404754,
            "duration": 2171,
            "service": 120,
            "waiting_time": 2846,
            "location": [33.946275, -118.385486],
            "location_index": 15,
            "id": 3,
            "load": [0],
            "description": "Shipment Delivery 3"
          },
          {
            "type": "end",
            "arrival": 1693407720,
            "duration": 2171,
            "service": 0,
            "waiting_time": 0,
            "location": [33.946275, -118.385486],
            "location_index": 15,
            "load": [0]
          }
        ],
        "service": 320,
        "duration": 2171,
        "waiting_time": 4610,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 24304.5,
        "geometry": "iqjnElbvpU?nCj@?bA?Z?R?~C@fA?t@?\\?NAdA?L?xA?p@?pB?h@?N?\\?L?|@@t@ArBA|@B\\?X?j@?J?N@h@AZ?pAA|C?`DAP?z@?pA@dBAlA?`@?d@?^?V?nA?fB?fB?`A?Z?JAH?HAH?BALABADAFCFCNKHEFGNKLINGFADAPAJA??Z?@?r@@R@~DFzDFjA@rBB`@BvDDvABr@@`@?R@h@@n@?p@?^BF??_@@g@?U?U@_@@_@@_@Dw@@]bFFJ?hABz@@d@@xABT?xFJtABT?P?R@pBBt@@bA@lB@t@?^?Z?h@@X?v@?T?p@?R?j@?F?NAR?T?Z?VAj@?lA?^?bB@d@?l@@hA?^?J?fAAlA?l@@P?X?vA?xA?rA?jD?jC@~@?v@@R?pA?h@@lA?`@?d@@r@?\\?\\?X?V@L?L?`A?fB?R?nBAxA?\\?~AAn@?`@?JAX?dA?|AA~C?tBAp@@F?nA?J?H?J?J?P?H?N?F?n@Ap@?J?v@?dA@J?bB?x@?tB@lA?hA?f@?t@@x@?P?V?vA?d@?hAEf@?^AV?b@?|@ArCC|BClA?L?T?n@@B?f@@l@?h@?p@?dC?rB?`B?V?t@?hA?T?h@@R??w@?]?]?_@?_@?Y?S?U?iF?q@?sA?uA?w@?cD?oB?{@?o@?W?m@O?[HWF?@?AVGZIN??l@?V?n@?z@?nB?bD?v@?tA?rA?p@?hF?T?R?X?^?^?\\?\\?v@?dAAV?^?D?\\?F?NAX?t@?b@ArA?HCrC?|@?t@?NAT?L?NA^?dACvCApA?BCdGAp@?\\?T?^?\\?h@?f@?DAX?NQ?m@?eBA_@?Y?g@AY?eB?qC?gC?S?c@?[?w@AK?m@?gA?U?}DA[AO?U?UL[?Y@M?QAS?Q?gBAK?UO}ACK?c@?e@?G?SA{BA_A?_B@YAQ@W?c@A}@Ak@@IDIFO?c@Aa@?K?O?S?M?c@A]?@N@NDT@JBRBTDR@TJp@Df@DZD\\@NBTBL@PDTN`ADZF^BRBVHZF\\Jl@PfABv@Bx@HrD@|A?dD?vA?n@?n@?bB?v@A~B?rA?rA?jA?pD?H?fFAzH@bFAtACdAA|@Ch@Cb@GnAIjAEd@AVCPa@|DAFAHWrBKbAE^]nCQrAUzBCVKpAM|AIdBElAGnBA^CzB@lA?x@@nAAN?\\?`@?f@?J?P?`@?l@?R?f@@~@AV?b@?N?f@?Z@L?J?N?L?hF?jBBjL@pA?HQzBI`AEdACr@OzBC\\Cz@CVEj@Et@A~@A`B@^ARAJCHEDIDKBc@By@@W?oA?I?e@?c@?O?i@?]?kA?_@?}D@S?wA@eD?Y?s@?yD?{@AkA?u@?kCA]?U?e@?KAM@u@?g@@c@@_@?c@?Y?m@?eCA]AG?}BBW?_B?eA?Y?S?i@A_A?G?kBAa@Ae@?iB?cA@o@AQ@KDWJA@QBI?K@C?K?gA?M?G@I@E@KB@Z?L?T?Z?h@?PAP?d@?t@@pC?hD@zC?h@?b@@~@?jB?D?vO?p@?`A?x@@z@AJ@NAN@V?|@@|F?|HA\\?r@?`@@t@?l@?^?tA?rA?h@?vA?d@?p@?^?xA@n@?`@?\\?nA?d@?z@?X?\\?\\?f@?j@?vCAx@?zB?Z?~@?V?hB?^?z@@v@A`@?X?R?n@?lB?|E?x@?d@?z@?hA?x@?~@?p@?J?j@?ZKR?~@@t@?n@?j@?d@?F?\\ArEBzEEnD?j@AxE?xEU?o@?n@?T??`@?\\@n@?H?JAdAA\\?|@@^Al@?X?~@?z@@^?lA?f@?n@?l@?N?tB?V?~C@xAAz@@x@AZ?jA?r@AH@T?h@?dA@vA?V?lB@X@v@Cd@?^AL?h@?x@?r@AbB@pDHR?`@?X@|CAdA@tA?Z?R?X?L?RAlD?V?b@KT?V?n@@t@?vB?`BLV?T?b@?L?^?bA?l@?R?j@?|@@d@?d@?v@KRA`@@t@?\\?l@?R?b@?d@?N?X?T?t@@f@?^AL?J?L?P?b@@x@?`A?v@?z@?h@?h@?d@?z@?j@?j@?H?N?n@?x@?d@?\\?f@?X?rA@`@?j@At@@XA`@?r@@xA?V?`@A|@?T@nA?L?N?R?\\Al@?bB?bB?~@?R@J?d@AjA@f@?lA?bB?x@?\\@`@?z@?Z?L?`@?V?Z?Z?V?Z?v@?X?Z?T?T?Z?Z?Z?X?R?|@?dA?d@?f@?\\@lAA|A?l@?X?^@\\?~A?t@?z@?nA?T?f@?vA@j@Ap@?P?J@\\?R?N?P?N?Z?d@?j@@X?RAlA?n@?V?L?N?`@?n@?z@?X?N?tC?jD?J?|C?rA?fC?h@?L?t@?nD?\\@xDAZ?V?PAZ?PAJAP?HEl@Gr@?RAH?^Al@?p@?L?X?nB@bB?tA?\\?zA?rB?r@?^?jB?fD?P?|B?F?X?T?r@?L@fB?v@c@AgAA?aAz@?BA@A?E@uCc@?Y?C?ABA@@hB??"
      },
      {
        "vehicle": 2,
        "cost": 6989,
        "steps": [
          {
            "type": "start",
            "arrival": 1693385864,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.016137, -118.253523],
            "location_index": 17,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693386900,
            "duration": 1036,
            "service": 120,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "id": 1,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693387567,
            "duration": 1583,
            "service": 120,
            "waiting_time": 2033,
            "location": [34.075525, -118.361588],
            "location_index": 2,
            "id": 3,
            "load": [0]
          },
          {
            "type": "pickup",
            "arrival": 1693389978,
            "duration": 1841,
            "service": 120,
            "waiting_time": 5022,
            "location": [34.076646, -118.376969],
            "location_index": 10,
            "id": 1,
            "load": [2],
            "description": "Shipment Pickup 1"
          },
          {
            "type": "delivery",
            "arrival": 1693396078,
            "duration": 2799,
            "service": 120,
            "waiting_time": 1622,
            "location": [34.094986, -118.300885],
            "location_index": 11,
            "id": 1,
            "load": [0],
            "description": "Shipment Delivery 1"
          },
          {
            "type": "job",
            "arrival": 1693399010,
            "duration": 3989,
            "service": 120,
            "waiting_time": 6790,
            "location": [34.000895, -118.204929],
            "location_index": 9,
            "id": 10,
            "load": [0]
          },
          {
            "type": "end",
            "arrival": 1693405920,
            "duration": 3989,
            "service": 0,
            "waiting_time": 0,
            "location": [34.000895, -118.204929],
            "location_index": 9,
            "load": [0]
          }
        ],
        "service": 600,
        "duration": 3989,
        "waiting_time": 15467,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 47755.7,
        "geometry": "uwrnEbkwpUSKkBcAoAq@aB_AeAk@a@SsA{@{A{@g@a@a@_@mAeAmAkAmAgAmAiAoAgAsAgAUS_BoAkAy@w@m@SOGE{BcBqAaAOKm@c@[Ww@m@GHc@h@IJIJOTs@pAuAdCINS^OZQXO\\_@bAEv@CNKf@Sz@GTMb@Y~@Wx@?@GRO`@O`@Ul@I^]p@Yn@Sb@GVADk@nAq@nBc@tBgBzD_AtBSb@Q`@OZO^KRaAdCUl@e@pAUp@GROd@Md@M`@K^GTGVOj@CJKd@Sx@I`@SdAQv@Ot@S|@Ml@Oj@Kb@K`@St@KXGRITIVMZKXEJIRMZKTGNGNy@dBYn@S`@Ud@MVYn@o@tAO^MV]v@a@|@[v@Q\\u@~@CFMPGPOZWb@KTIHGHWX]^_@^GHIJKNe@v@e@v@]l@CDKP]p@_@t@Wf@c@z@EJOXk@hAe@h@OVQZW^ADOTQRIHEDQJOHGB[DS?[Am@Em@GSAI?[@WBUDSFQJOJ]`@IHSPSPUPMHk@b@WRYPWNSHYDO@Q?SCWCk@OcBi@e@M_@Mg@Ie@U[Oc@Wc@WWS[UUOSS[Wc@_@][QSQQ[_@gAyAQUQYk@{@_@m@S]Wc@}@aBYi@]m@AEQ[Ue@S]KSGMWg@Wg@_@u@Q_@_@s@[k@EIGQa@u@S]oFgKIUS_@[o@uAmC[m@GMwBgEUg@]o@ACOWSa@i@aAMWi@cA_@m@o@_AUYY]QSW[QQQSaAaAWU_@Y{DwCUSc@]KGWSKIOQQS_@W_Ay@QQWWq@k@KKu@s@e@c@SQqAsAq@q@MMUUMO[]aAy@e@g@QSa@a@QQSS]_@}B{Cy@eA}@iBS_@KQSYe@q@q@cAoBgCSYaAwAUUWQMIQGYKGAEAGAWCOCI?M?E?]Eo@EWBSBODC@QJMHC@QPOTILILwA`Da@|@yAjCYf@e@fAQX]d@_@d@a@l@_@j@QZ]j@MROVU^_@h@S^QXOXOVOVEJEFO\\Q^Qb@KTOZKVUn@Qh@Up@Sp@W|@YhAAFoA|EUz@ADcAdE{@lDOf@Qp@c@dBGTI^a@bBIZQp@Qr@CH_@xAw@jCCDGVUn@Qd@CHGPM\\_EnLEJ}AvEiAxDMf@Sh@w@fCUr@EL_@`Ae@jAMVMZ_@|@Wl@Up@KZWp@GXOh@Sr@Oj@K\\I^K`@IXGZK`@EVKj@Kf@SdAGTShAc@xB{@hEKh@UlAg@fCCJGZWrACN[dBIb@W|Ak@fEOhA_@`CG`@c@|CALEP_@hCIn@EVIl@UjBGh@QxAGh@Iv@KdAMhAOnACRKn@QbAUhAQz@K`@Uz@W|@_@bAe@lASf@uBvEGLy@pBO\\gApCaAfCc@nAYt@c@jA_@dAOb@GNGNs@nA[j@a@v@Uf@_@z@Yj@c@|@IPIJGHIDMBE?@v@?b@?b@?p@?RA`@@v@?j@?J?X@nB?h@?r@?pA?N?B?P?^?b@?n@@Z?F?N?L?nB?l@?f@?n@?X?hA?j@?f@?n@?j@@t@?n@?f@@j@?xB?r@?x@?hD?l@@lA?R?@?N?|@?n@?t@?`A?\\?TAl@?J@d@?R?j@?lA?d@?d@?T?pA?`@?f@?T?R?x@?T@x@?b@?p@?x@?X?pA?xA?X?d@?^?b@?n@?j@?\\?hC?\\?zA_B@A`@@B?@?@?@DDBB@@@B?P?R?N?b@?d@?J?K?e@?c@?O?S?QACAACCEE?A?A?AAC@a@~AA?r@nJCxO?`B?|B?xEAhB??`@?f@?l@?t@?l@?b@?d@?l@@tB?n@?l@?l@@hB?n@?l@?vB?j@A^?T?R?d@?pA?R?bBAf@@T?v@?~@?b@AbC?n@?T?F?F?H@L?DDb@D\\DRDN?BHXJVHVFRJ\\@FH^D`@?B?B@T@L?TENAX?V?LAPCVCVWnC[dDEf@CXCZARAp@?tC@nA?JAN?LA\\DNA~@?nA?^?^AXANANAN?JAJ?N@r@@hA?d@?d@?x@?tC?d@?x@@nA?Z?h@?r@?p@?X?p@?l@@b@?`@?l@?n@?tB?r@?n@?|@@fBAxE@n@?d@?T?v@?t@?p@?v@?L?d@?X?b@?`@?r@?d@?x@@`@A`@@`A?d@?fA?^?\\?j@?b@?xA?j@?b@?L?d@?f@?dA?b@?`@?f@?f@?T?nAAh@?`@?pA?b@?d@?`@@`@?T?f@?|@?f@@l@?^?b@?|@?^?\\?^?t@?h@?Z?\\?f@@X?L?X?b@?x@?l@?b@?f@?rA?^?R?h@?fA?b@@h@?lA?f@@P?\\?`@?h@?pA?L?T?b@?R@R?^?V?jAt@?\\?T?F?G?U?]?u@??n@?L?Z?X?N?T?R?Z?d@?d@?n@?T?N@n@?j@?b@?n@?h@?n@?d@?h@?`@?H?R?`A?l@@t@?b@AX@R?R?R?^?`@?v@@f@Aj@@f@?^?n@@d@?l@?d@?\\?\\?f@?|@?j@?j@?x@?f@@`@?b@?\\?bA?d@?h@@`@aB?cI??lE@pE@xE@`C?~A?^f@?N?P?zA@d@?Z?hA?@hAAiAP@v@ALAVA?q@AI?O?k@?W?Q?G?_@?M?a@?]?m@?y@?Y?K?W?[?a@?u@?e@?m@?e@?k@?q@?i@?a@?c@Aa@?i@?e@?cA?]?c@Aa@?g@?y@?k@?k@?}@?g@?]?]?e@?m@Ae@?o@?_@Ag@@k@Ag@?w@?a@?_@?S?SAS@Y?c@Au@?m@?aA?S?I?a@?i@?e@?o@?i@?o@?c@?k@Ao@?O?U?o@?e@?e@?[?S?U?O?Y?[?M?o@?kA?W?_@AS?S?c@?U?M?qA?i@?a@?]AQ?g@?mAAi@?c@?gA?i@?S?_@?sA?g@?c@?m@?y@?c@?Y?MAY?g@?]?[?i@?u@?_@?]?_@?}@?c@?_@Am@?g@?}@?g@?UAa@?a@?e@?c@?qA?a@@i@?oA?U?g@?g@?a@?c@?eA?g@?e@?M?c@?k@?yA?c@?k@?]?_@?gA?e@AaA@a@Aa@?y@?e@?s@?a@?c@?Y?e@?M?w@?q@?u@?w@?U?e@Ao@@yEAgB?}@?o@?s@?uB?o@?m@?a@Ac@?m@?q@?Y?q@?s@?i@?[AoA?y@?e@?uC?y@?e@?e@AiAAs@?O@K?K@O@O@O@Y?_@?_@?oA@_ADK@K@K@Q?W?K?mA?YAy@?c@?k@@U@U@]BYN{ALqA^wDBSDq@@Y?QASGM?UAMAU?C?CEa@I_@AGK]GSIWKWIY?CEOESE]Ec@?EAM?I?G?G?U?o@@cC?c@?_A?w@AU@g@?cB?S?qA?e@?S?U@_@?k@?wB?m@?o@AiB?m@?m@?o@AuB?m@?e@?c@?m@?u@?m@?g@?a@?y@?uA?S?aB?I?kA?M?eAAqA?gA?eA?mA?c@?Q?kAIAYCY?OA}B@mE?g@?wA@iA?S?gB?mA?mG@uD?_@?cA?Y?]?]??c@Ay@?U?y@?S?U?g@?a@?qA?U?e@?e@?mA?k@?SAe@?K@m@?U?]?aA?u@?o@?}@?O?A?SAmA?m@?iD?y@?s@?yBAk@?g@?o@Au@?k@?o@?g@?k@?iA?Y?o@?g@?m@?oB?M?O?GA[?o@?c@?_@?Q?C?O?qA?s@m@?aA?y@?QAM?U?S?U?O?C?I@K@A?G?wAAc@?U@oA?yC?_@@_B?kD?iJ@W?eA@eB?eB?wB?c@?{A?{A?m@?wD@iB?@z@?R?SA{@hB?vDAl@?zA?zA?b@?vB?dB?dB?dAAV?hJAjD?~A?^AxC?nA?TAb@?vA@F?@?JAHAB?N?T?R?T?L?P@x@?`A?l@??i@AoB?Y?K?k@Aw@NCJEHENQRSPSJKJMFGBAFKHKHMPWLUXk@FMHOFKJSHQP]Re@NYLYb@y@P]f@oBBG\\y@P_@J[f@sAJYDKDORk@DKX{@^cATi@Xq@Rc@BKNY`@}@Tg@Zo@\\u@^w@Rc@Zq@Ri@?CPi@L_@Ry@Nk@P}@V}BH_ABm@DkADaAJ_D@QBq@B]Dm@NiBBYJcALaARuA\\cCPiATcBPoA@KJo@Fa@LaAf@mDVgBLs@Js@FSRsABKN{@TeAHe@RaAJc@VuABOz@mENs@P}@P_ARgANq@Nw@Ji@Jg@Ps@Nm@No@Nk@Rw@\\gATq@HUVu@|@{B|@wBb@kAPi@`@kARs@Vs@Pq@La@DOv@iCn@mBl@gB~DoLL_@L[Z}@Xu@`@oAj@wBBS`@}A\\sAZqANm@Pq@H]HY@G`@aBbAaEZoAXiALi@T}@Ru@R{@Nk@@ERw@Ty@Nm@Pm@Ng@Tk@Ri@To@Vm@Zs@Xm@DIFMJMzAmCr@gA`@s@Zk@|@uAFKT]l@aAzA_CtAqBNWNS\\e@RUv@y@^]TSb@_@`@]f@c@TQDEFGFCLMLKFEZWfA{@jA_A~AqADGBCFGFELKNKb@[\\[ROJKLOPOV]TURUp@s@RYZe@R[LSj@m@v@mAXc@Va@NS~AgCb@u@r@oANWVe@NYHQFIFOTa@NYP[R_@R_@LSLWFMDGDIDGDIxAoCTa@FMZm@BE^s@HOXg@HOtByDBGHOVk@HQHSJUNc@J_@BKZiCBWDe@@Q?Q@u@Bu@AeA?c@Ai@@i@?[BmAHiD@SBk@HyB@W@U@UDm@Do@BW@MD]JqAL{AJqABYBYDo@BS@U@OFm@Bm@@I?I@K@QD_@@IBY@KToBH{@Hw@H_AD_@LaBPu@BMBIHm@DSH]Ni@Ng@Ri@Vk@BGR]Xc@Za@\\_@^]ZWLIJGLILIJGNGLGd@Qh@U|@_@p@WJELGPGFCb@Q^ORIbBo@~@Y|@W`AUHCNCJAREDA~@O`AM`AIB?x@GTAJAb@ApBCp@AL?N?h@?`@?fACfA?t@A^@h@@`@@ZBP@T@\\BZD\\BZDZDbANr@Ll@HvAXl@DZ@pA?t@Af@CRArAID?n@CZAL?n@@v@Bb@DhAJ`@DVBv@Dn@@n@?j@EPAHAp@EPCl@Gd@KDAh@QLE^K`@OBALGJGb@Ud@WNIDCNIHG@?jA_A\\YVUZ[BCRQ\\]TUDGZ]d@i@Za@^g@X_@RYV_@Zg@Xe@Zg@FO`@s@Rc@b@}@Xo@Vo@r@mBNa@L_@d@wA\\cAPc@V{@BEZ{@f@}Al@eAZs@^u@BGRc@BGR[TYVWDELMBCDCVSFEJOJSJ[DMl@kBd@cB\\gANg@jB`AlGdDj@VRm@Pe@Nc@Vw@h@}ARm@Rg@nAuDNFTNn@`@^Tj@VNHJFXNZNZPj@ZPH~@f@hAj@lAl@jAl@X@X?J?Z?ZAP?h@Ah@AZAXCHAHCLEPGPIXMr@_@b@S~Au@ZOPINGPKRMHEHGJIFKHKN[JUJQBGHMBGFOFIHKLKTMLGL@RANAHAT?n@?j@AHALANCXEHCNETINKrAo@XMn@Sl@SXIxBm@dA]HEv@]fAm@ZSXUXSRQX[z@y@d@a@TQZSVO\\ONEj@Qb@I@?VCNCH?b@C~@A^Al@Ar@CFAHAHIfAAhAAjBA\\?T?PAd@?d@Ap@?dCAZAh@?PAxA?T?f@?fCC\\?fAAf@A^?dFEL?lAAP?z@A@\\@b@?@@pA?`@@|A?R?b@?\\@rA@TmBB[?A?e@ACA?AEaDCuA?K?kCBGHGPAVK??"
      },
      {
        "vehicle": 3,
        "cost": 7548,
        "steps": [
          {
            "type": "start",
            "arrival": 1693396392,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.940407, -118.265196],
            "location_index": 18,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693397700,
            "duration": 1308,
            "service": 120,
            "waiting_time": 0,
            "location": [34.037925, -118.459842],
            "location_index": 5,
            "id": 6,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693398290,
            "duration": 1778,
            "service": 120,
            "waiting_time": 310,
            "location": [34.004364, -118.42117],
            "location_index": 6,
            "id": 7,
            "load": [0]
          },
          {
            "type": "pickup",
            "arrival": 1693399596,
            "duration": 2654,
            "service": 120,
            "waiting_time": 0,
            "location": [34.01878, -118.317919],
            "location_index": 12,
            "id": 2,
            "load": [2],
            "description": "Shipment Pickup 2"
          },
          {
            "type": "job",
            "arrival": 1693399918,
            "duration": 2856,
            "service": 150,
            "waiting_time": 1382,
            "location": [34.000215, -118.318803],
            "location_index": 7,
            "id": 8,
            "load": [2]
          },
          {
            "type": "delivery",
            "arrival": 1693402142,
            "duration": 3548,
            "service": 120,
            "waiting_time": 58,
            "location": [33.996658, -118.261708],
            "location_index": 13,
            "id": 2,
            "load": [0],
            "description": "Shipment Delivery 2"
          },
          {
            "type": "end",
            "arrival": 1693402320,
            "duration": 3548,
            "service": 0,
            "waiting_time": 0,
            "location": [33.996658, -118.261708],
            "location_index": 13,
            "load": [0]
          }
        ],
        "service": 630,
        "duration": 3548,
        "waiting_time": 1750,
        "priority": 0,
        "delivery": [2],
        "pickup": [2],
        "distance": 60342.2,
        "geometry": "q~cnEftypUr@?hD@xA?h@?X?PAJ?N?h@?^?dB?X?lA?rA?|C?x@?nB?jA?X?jA@`A@B?zBAbB?`@?ZAf@?b@?R@d@?^?d@?L?@kB?W?k@?c@?w@?y@@mEAiA@cADeF?m@@yA@yE?G?IBO@OBINk@JSJSf@s@~@qAf@q@b@m@d@s@BGDIBG@GDO@M@GD[?M?G@g@@qD?[?W?M?_A?K?KL?J?d@?P?L?N?T?l@?@N@NDT@JBRBTDR@TJp@Df@DZD\\@NBTBL@PDTN`ADZF^BRBVHZF\\Jl@PfABv@Bx@HrD@|A?dD?vA?n@?n@?bB?v@A~B?rA?rA?jA?pD?H?fFAzH@bFAtACdAA|@Ch@Cb@GnAIjAEd@AVCPa@|DAFAHWrBKbAE^]nCQrAUzBCVKpAM|AIdBElAGnBA^CzB@lA?x@@nAAN?\\?`@?f@?J?P?`@?l@?R?f@@~@AV?b@?N?f@?Z@L?J?N?L?hF?jBBjL@pA?H?zD?hA?fC?`@?r@@`@?ZAlBAdE?t@?t@?R?bC?xA@`ABhABdABl@BT@R@R@^B\\@VBP@XBT@N@NDX@LBX@LHn@Jx@NhADf@XjBXpBr@bFT~AL~@BLDVl@pEn@tEBN@BvBfPN~@L~@b@bDXtBR`BHt@NhBPb@@H@D?F@JB^BXF~@@HBj@@^@XDp@DpA@p@BjB@^@`CA~B?fA?V?r@?TA~@?z@?jBAhA?rAAxA?nAAbB?nB?|@A`B?x@?\\?tAAz@?rA?jA?|B@`A?f@@tABpA@ZBnA@n@@h@BpA@d@@f@Bz@BxA@X?TBr@BnABjA?F?^@`@Bt@Bv@@h@@n@B`@DrAFxBB|@D|AJlEJ|D@NBdADpB@r@?n@CbAAb@AZEjACl@Gt@MrAIn@Gf@Mv@Ih@UlACHCLEPK\\YhAGNUr@c@jAe@hAQ`@O\\KRYh@U^S\\a@n@[f@]f@Yd@S\\_@j@[d@i@x@QVa@n@{@nAGLc@n@m@`AW`@{@pAEDIHGDCBC@CDs@fAOVOV_@h@W^uBrDOXKRUd@OXWh@Yj@QZMT]z@_@x@Uj@GNAD_@|@Qb@Un@Wv@Sp@Ql@Qn@GVW`AKl@Kb@GXCPKf@If@CJOz@AFIj@Mx@OfAEf@Ip@Eb@Et@Ep@Cb@Cd@A`@Ab@?VAfAB`A?d@?R@f@@`@Dl@@`@B\\D`@Fh@H~@BNL|@PfAJd@Ln@F\\p@bDH\\TfADd@F~@n@xDVdBNh@DTHl@Hl@H^Jz@Df@?VJbAHt@R`BHt@J|@D^BVBVBT@PBP@V?R@P?VAXAXAXATCRALCRETENCNENENGPGNO`@KRU^GJQTMLMNMJIHEDMHMJMFGDKFOHSHUFUFg@H[DYBSBc@D]@YBc@@k@Be@?o@BaBBiA@y@Bi@?k@@m@@w@@g@@{@@eCBuA?eB?oA?G?yD@sBVoA?kB?W?mC@m@A_A@}@?_AAg@?q@?gA@m@?Y?cB@oA?cA@_@?gAAeEFU?WB_ADkAJo@DmAJ[D[D_@FI@e@Jo@Jy@Nc@FQBq@LG@K@s@XsARu@FU@o@Fw@D[Bi@@u@Be@?{A@w@AG?c@?O?}AAcBAsA?iDAcECoECiEAsA@]@cAFU?m@EI?MAO@i@JkAN}AZ]Fu@Nm@LQDQDYFc@JqAVyAl@a@J{@PeAR}@PyAZ{@P_A\\s@X[Lc@T[PYRSLUNKHUPYVKHKJ_@`@ONSRIJILMPGHKLKPILMROTGLGLGLILELKPGPQ`@m@zAc@hAO\\Ul@Uj@e@jAs@fBQ`@a@fAQ`@o@bBUh@Wj@ITGLELGLGNe@fAO\\Yl@Uf@S`@OZYj@s@tAYj@y@dAi@fAo@rACHk@lAYp@g@jAUl@Wp@KVWn@[v@s@hBWr@u@nBYr@KXUp@c@jAa@fAa@fA]bA_@bA]z@q@hBc@lAi@vA[z@aAlCc@pAQb@M^IPITOXKRMXMTOVW`@IN[`@GJKL]`@KLGFCB_@\\]ZMLMHYVg@\\c@ZsBxAoA`Ay@l@g@\\[TGDYTIFEBEDiAx@}@p@y@j@WPGFWRu@h@cCfBaAr@k@b@oA|@m@b@uAbAgBnAaChBi@\\[RKFMHEDGBCBIFKHUNUPGDGDYTu@bAgBnA[VOLKFo@d@wDnCaAr@gEzCcCdBoA|@_Ar@cAt@m@`@gAx@MJg@^OJMHKH_@X{AhAg@`@aBjAw@j@wB|AkAz@k@d@u@f@OLe@Za@XaAt@qA`Aa@Xw@h@g@`@i@^y@l@iAz@o@d@]TOLIFa@X{@n@SNu@h@a@XgAz@_@VeAt@QLYT]VWPsAbA_Ap@mAz@cAt@eAv@qA~@{@n@QNGDaAr@]VSLqDlCgBnAk@^_@Xk@b@cAx@MH[PsAh@{B`BwAdAaAr@{AfAiAx@MJSN]TUPUPOJ{@l@o@f@q@d@o@d@WRu@h@c@ZMJg@^]TqA`Ai@^m@b@iAz@i@`@o@d@eAt@s@j@uAdAq@d@a@\\u@h@}@p@m@`@_@Xc@\\QJYT[T_Ar@UPu@h@_Ap@QNKH}@n@{@n@y@j@u@j@u@h@q@f@e@Z{@n@[Vi@`@mAz@kBtAa@Zw@j@_BlA]Vo@f@c@ZuB|@}DbCUJa@Zq@`@q@`@QN[PwC|AIBmBdAWLe@Tc@V]TEDSP]^a@f@_@d@[f@Yf@Wf@Sh@IVGPEHGTCJAFCTIVCJIb@Gh@Gh@Cl@Cn@?p@?t@@H@j@Dl@Dd@?DHb@N`ADTd@rCFb@LnAP~ANzAB\\XjC\\jBf@hGNrAJfAFb@Dd@VxBBJ?DFZHh@BVFZDPBRDPNfALt@FZBJHh@Hf@F\\XzANtCBXLbAJv@LdAJ~@DV@RBPBP@N@J@P?J?LAD?BAHADAFCBEJGHGFSd@OL_@Xo@d@]\\ONILMPQT[b@OPcAlAW\\q@x@}@hAORGF{@`AMRQTWXQTILMN_@d@m@t@W`@W\\]b@[\\MPOPMNOPKLEFo@x@GHOPCDOP[^o@x@gArAeBrBQR[^q@t@s@|@{@hAyAnB}@jA_AhAq@x@KLcAjAEGUc@Tb@DFbAkAJMp@y@~@iA|@kAxAoBz@iAr@}@p@u@Z_@PSdBsBfAsAn@y@Z_@NQBENQFIn@y@DGJMNQLONQLQZ]\\c@V]Va@l@u@^e@LOHMPUVYPULSz@aAFGNS|@iAp@y@V]bAmANQZc@PULQHMNO\\]n@e@^YNMHELKNKr@g@FGVQJKLIRQh@_@M]CMc@aBMm@Sw@Me@Mg@Ka@Me@GYKa@AGI_@IWOw@I]GWQy@EQq@_CIe@Ii@Mo@EQ_@yBKy@Im@AIEWAKUuBGo@Is@AMWeDI}@WiD_@gFSoCMcB@}@@I?MGqACk@KwBI_BA_@?Y?[@YBS@QBQBSBODQDOFWHSHUJSFOJQJQFGDGLKLMp@i@bAyANMdAw@|@q@d@]xAeAtAcAhAw@pA}@`@Y~@s@z@m@FGrA_Ad@]dAu@tAcAtAaAlA}@`@[xFeEvDoCjBuAx@o@ZUJGf@]VS\\WJIROFEd@]r@i@pByAPMdGmExBaBtB{AxB_BtB}AzAiAf@]`As@|BcBbDaCz@o@XSVQRMFGFCFArAc@tA_Ax@e@VMLGTGHAL@PBHDHDFFJJJFZl@BFLXLTj@a@`As@JG~DyChAy@^Yh@a@`@t@JTR^NZDHXh@NX^v@R`@JRP\\LXVd@R`@Vf@NZLVP\\R`@R^NZLVXh@R^NXJTHLHNJRLVVh@R^LIMHS_@Wi@MWKSIOIMKUOYS_@Yi@MWO[S_@Sa@Q]MWO[Wg@Sa@We@MYQ]KSSa@_@w@OYYi@EIO[S_@KUa@u@_@s@MUKUKSIQS][m@IMKOIOKQMUM[Se@IQIOIQKSKQYm@]VMJYPKHGDMJ_@V]XGDWRQLu@j@c@\\o@b@]VKFSNQLMJMFLZPZBHHPBV@DHVBR?V?FCNAFEJILGJKJOL]Xo@f@]d@w@bAMJSN]TUPUPOJ{@l@o@f@q@d@o@d@WRu@h@c@ZMJg@^]TqA`Ai@^m@b@iAz@i@`@o@d@eAt@s@j@uAdAq@d@a@\\u@h@}@p@m@`@_@Xc@\\QJYT[T_Ar@UPu@h@_Ap@QNKH}@n@{@n@y@j@u@j@u@h@q@f@e@Z{@n@[Vi@`@mAz@kBtAa@Zw@j@_BlA]Vo@f@c@ZuB|@}DbCUJa@Zq@`@q@`@kAb@uChAo@Rk@P_@H]DQ@G?Y?YAYE[IYKWMWQUSWUQUQWMYK]IWIa@Ko@Kk@Iq@MiAMyACo@A_@Ay@Ek@QuB?wN?UAaI?k@?a@Ae@?W@mAAsDAmE?wA?i@?{@Au@?C?g@?u@CsB?_@@s@?gAA_@@g@?q@@u@?W@W@U@]@UBc@B]BYBU@QBQHk@Fo@DUTaAFYDSFWH]FUFWH[Jc@Nk@@ELe@HYH]FUNk@FUDODSDODQBODQDSBQDQDSDYDa@Hm@BUB[BYBYDe@@a@FmADcAF{AJqCBe@D_ABw@Be@Bi@?G@QBk@Bc@Bs@D}@DaAF}ADs@Be@B}@DaADkADkAB_@PaFBYD_A?OFuABk@HaCDi@?KLaDFyA?GBy@?]?_@?[?{@AKCaAEaAG_AGk@CUK_AO_AO_AS}@U}@U{@Y{@GOIQIW]w@i@kA[m@GMMWGMMWEKe@_AIMCGAEIO_@s@Ue@m@kAi@iAUc@wC_GUe@eCcFe@_Am@kAEK{A}CiCiF[o@c@}@gA{BUc@_@{@IS_@_AIUWy@GSMa@Kg@Kc@CKMw@Ky@Iy@Gy@Ey@C{@?y@?{@@g@@QB}@BQ?KBQ?GHu@BUBSBSN_AD[J{@Jy@Js@D[NmAJu@Hq@Jw@TiBL_AJs@B]BM@G@GHo@NkA\\gCNmAHo@Fk@ReBJ}@F_@@KFe@ZkCBKBWHk@XyBHm@Fg@X{BHg@NcA`@gDLu@@ONaAL}APeBD{@Do@FkADaABi@@u@BeA@_A@yACqCWwJCs@Aq@Au@AM?y@GwCAw@A_@CyAC_EUeMK_J?G?YAI?MEkCGoDCwAOgIC_BCkAAi@EqBA{@AeACy@EkCCs@MeHAa@?EAm@Ao@As@Cm@AiACu@IqEAWCu@CgAE{BIcEMoHAa@EeB?a@UmMEoBEyBC}BGmCCqA?OCu@A{@AYEyAAYK}BK}AAYc@mFIcAKoAIcAGw@[iEUsCIcA?wBGuBC{@Cs@?KEsAEgBGcBEq@r@ANAH?XCJE~@?rA?T?dB?vAAP?jA?b@?rA?h@?p@?`C?pCAb@?T?R?j@?b@?L?l@?v@?lA?d@?|@?jB?dDA`@?z@?n@?h@?vAAf@?L?h@?j@?^?T?X?r@?n@?rB?h@AhA@nA?fE@R?fH@X?dA?bA?N?b@?J?L@F@F?HB??D@FDHBHFFD\\VTPJHFBDBHBFBJBLBPBH?B@N?@?l@?|@?pD?nJ?nRAj@?tA?Z?T?L?L?T?T?pB?v@?dA?zB?nB?tBAxB?hF?`B?\\?fB?^?r@?RAP?j@CLA^Cf@CNAlB?nF?P@zAAh@?B?lA@?`B?`@?a@?aBAgB@eB?_@?kAAY?e@?m@?[?qA?eA?e@?c@?iA?aAAk@@e@?gAA}I?g@?a@?y@AgG?U?e@?I?u@?U?[?e@?]@{D?yA?g@?k@?mH?i@?s@?g@?e@C}H?i@?e@?_H?g@AM?u@p@?V@R?TAfA?vA?z@?b@?f@?r@?rD??mLA{H@sB?oB@}H?eB@gB@k@?eA?eB?Sv@?^??i@?_A?K?iGAcFA_CAgC?uCGyS?q@?U?_A?eAA]BYCgC?O?y@?MAG?I?S@i@?_@?gG?_@?u@?Y?k@?a@?O?a@?uB?[?k@?wK?s@?e@A]?w@?w@?g@?e@?_@AmBAiBAaI?_@?y@?U?y@?EAI?A?iDA_BA_BC_H?i@?S?W?_A@gA?o@AMAwP??"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints.

![](<https://static.nextbillion.io/docs-next/docs/route-optimization/v2/ max-travel-cost-and-max-tasks.webp>)

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- `summary` section:
  - We get an overview of the overall result with a total distance of 141270 meters covered within a total duration of 10502 seconds (~ 3 hrs) to complete all the assigned tasks.

  - Optimizer was able to assign all tasks using 4 routes with a total cost of 21899. This cost is in seconds as we did not explicitly specify any `travel_cost`, so the solver went with the default setting of `duration`.

  - Other fields in summary provide details about total service time of all the assigned tasks, total waiting_time for the assigned tasks among other details.

- `routes` section:
  - It can be observed that the max_tasks constraint for all vehicles has been successfully implemented in the solution - vehicle 1 is taking care of jobs 2, 4 and 5; vehicle 2 is assigned to shipment 1 and jobs 1,3 and 10; vehicle 3 is assigned to jobs 6, 7, 8 along with shipment 2; and lastly, vehicle 4 is assigned to job 9 and shipment 3.

  - In our example, the cost is calculated using the default metric - `duration`. Therefore, all costs in the solution are in seconds. Let’s take a look at the costs for each vehicle:
    - **Vehicle 1**: This vehicle was configured for both `fixed` and `per_hour` type of cost. When used, this vehicle incurs a cost of 1000 seconds along with additional 5400 seconds for every hour of operation. The total duration for which this vehicle operates is 794 seconds (~14 mins) and hence the `per_hour` cost for this vehicle comes out to be 1191 seconds. The total cost of the route, 2191 seconds, is then calculated by adding `per_hour` cost to the fixed cost of using the vehicle. Overall cost incurred for this vehicle is less than 5000 seconds, as specified by the `max_travel_cost` constraint.

    - **Vehicle 2**: This vehicle was configured for both `fixed` and `per_hour` type of cost. When used, this vehicle incurs a cost of 3000 seconds along with additional 3600 seconds for every hour of operation. The total duration for which this vehicle operates is 3989 seconds (~72 mins) and hence the `per_hour` cost for this vehicle comes out to be 3989 seconds. The total cost of the route, 6989 seconds, is then calculated by adding `per_hour` cost to the fixed cost of using the vehicle. It looks like that this vehicle did not adhere to the `max_travel_cost` constraint and incurred a total cost of more than 5000 seconds. But, it is important to note that `max_travel_cost` does not consider fixed cost in its calculations. The `max_travel_cost` applies to the travel_cost only, which in this case is the `per_hour` cost of 3989 seconds, which is well within the given cap of 5000 seconds.

    - **Vehicle 3**: This vehicle was configured for `fixed` cost considerations only. When used, this vehicle incurs a cost of 4000 seconds. The total duration that this vehicle operates for is 3548 seconds (~1 hr). The total cost for this vehicle is the sum of `fixed` cost and `travel_cost`, which comes out to be 7548 seconds. Similar to vehicle 2, the total cost for this vehicle also exceeds the given cap of 5000 seconds, but that can be attributed to the higher fixed cost. The travel_cost incurred is 3548 seconds only.

    - **Vehicle 4**: This vehicle was also configured for `fixed` cost considerations only. When used, this vehicle incurs a cost of 3000 seconds. The total duration that this vehicle operates for is 2171 seconds (~36 mins). The total cost for this vehicle is the sum of `fixed` cost and `travel_cost`, which comes out to be 5171 seconds. Similar to vehicle 2 and 3, the total cost for this vehicle also exceeds the given cap of 5000 seconds, but that can be attributed to the higher fixed cost. The travel_cost incurred is 2171 seconds only.

    - It is recommended to also refer to the Vehicle Costs example to understand more about cost calculations.

  - The total cost of solution, 21899 seconds, is arrived by adding up the costs of each individual route.

As demonstrated, NextBillion.ai’s Route Optimization API works within the provided constraints and suggests the best solution within those constraints. We encourage you to try out different configurations of vehicle or task locations, time window constraints, skills, number of tasks and explore how different routes, task distributions are returned when different scenarios are presented to Route Optimization API.

We hope this example was helpful. Check out some more [use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization API can handle for you!
