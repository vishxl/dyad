# Basic Route Optimization

In this example we will play around with basic constraints offered in NextBillion.ai’s Route Optimization Flexible API. The constraints covered here are time windows of jobs, vehicle shift timings, skills needed to complete the tasks and capacities involved to carry out pickup/delivery type tasks. We specifically demonstrate how the time windows are used to determine the job sequence & assignment and if the time windows are such that they could not be honored then the task would be left unassigned. We will also see how the starting and ending stops for the vehicle are configured when they are assigned to depots versus when they are not assigned to depots.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please [contact us](mailto:support@nextbillion.ai) to get your API key now!

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### Jobs & Shipments

We start by defining 5 jobs and 2 shipments. For these tasks we add:

- A unique identifier for each task
- Location indexes for each task
- Specify the schedule of tasks. This is done by adding time windows within which a task must be completed. We have added a 15 min time window for all tasks for the sake of simplicity, but the Route Optimization Flexible API is fully capable of handling much complex task schedules.
- Skills needed to perform each task
- Pickup and Delivery amounts for all jobs
- The actual time taken to complete the task once the driver/vehicle is at the task’s location i.e. the service time for each task. We have added a uniform

service time of 2 mins for all tasks, but the readers can use varying service times instead.

Let’s take a look at the `jobs` JSON after the above properties are configured:

```json
"jobs": [
    {
        "id": 1,
        "location_index": 0,
        "service": 120,
        "pickup": [
            1
        ],
        "skills": [
            1
        ],
        "time_windows": [
            [
                1693393200,
                1693394100
            ]
        ]
    },
    {
        "id": 2,
        "location_index": 1,
        "service": 120,
        "skills": [
            1
        ],
        "pickup": [
            1
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
            1
        ],
        "skills": [
            2
        ],
        "time_windows": [
            [
                1693396800,
                1693397700
            ]
        ]
    },
    {
        "id": 4,
        "location_index": 3,
        "service": 120,
        "skills": [
            1
        ],
        "pickup": [
            1
        ],
        "time_windows": [
            [
                1693402200,
                1693403100
            ]
        ]
    },
    {
        "id": 5,
        "location_index": 4,
        "service": 120,
        "skills": [
            2
        ],
        "pickup": [
            1
        ],
        "time_windows": [
            [
                1693400400,
                1693401300
            ]
        ]
    }
],
"shipments": [
    {
        "pickup": {
            "description": "Shipment Pickup 1",
            "id": 1,
            "location_index": 5,
            "time_windows": [
                [
                    1693397400,
                    1693397760
                ]
            ]
        },
        "delivery": {
            "description": "Shipment Delivery 1",
            "id": 1,
            "location_index": 6,
            "time_windows": [
                [
                    1693400700,
                    1693401300
                ]
            ]
        },
        "skills": [
            2,
            3
        ],
        "amount": [
            3
        ]
    },
    {
        "pickup": {
            "description": "Shipment Pickup 2",
            "id": 2,
            "location_index": 7,
            "time_windows": [
                [
                    1693429200,
                    1693430100
                ]
            ]
        },
        "delivery": {
            "description": "Shipment Delivery 2",
            "id": 2,
            "location_index": 8,
            "time_windows": [
                [
                    1693432800,
                    1693433700
                ]
            ]
        },
        "skills": [
            2,
            3
        ],
        "amount": [
            2
        ]
    }
]
```

### Depot

Next, we add a depot that we want to assign to one of the vehicles. The assigned vehicle would start from the depot’s location. We assign an ID and a `location_index` to the depot:

```json
"depots": [
       {
           "description":"Depot 1",
           "id":0,
           "location_index":9
       }
   ]
```

### Vehicles

Next, we add 2 vehicles that are responsible for fulfilling the tasks within the defined constraints. To describe the vehicles and their properties we add:

- A unique ID for each vehicle
- Vehicle shift time or the time window
- Capacity to denote the amount of load that the vehicle can take
- Vehicle’s depot, if any.
- Start_index to denote the point from where the vehicle would start. It is important to highlight here that we need to add a start point for all vehicles either by specifying the `start_index` or by assigning them to a `depot`. In this example, we cover both cases and define a `start_index` for one vehicle and assign a `depot` to the other.
- Skills of the driver or the vehicle
- We are not mentioning any cost for the vehicles. Please take a look at the [Vehicle Cost](./vehicle-costs) example to know more about its usage.

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
    {
        "id": 1,
        "start_index": 10,
        "skills": [
            1
        ],
        "capacity": [
            10
        ],
        "time_window": [
            1693382400,
            1693411200
        ]
    },
    {
        "id": 2,
        "depot": 0,
        "skills": [
            2,
            3
        ],
        "capacity": [
            10
        ],
        "time_window": [
            1693382400,
            1693411200
        ]
    }
]
```

### Locations

And now, lastly we define the `locations` object and add all the locations used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
"locations": {
    "id": 1,
    "location": [
        "34.083950,-118.318640",
        "34.054927,-118.323726",
        "34.075525,-118.361588",
        "34.076350,-118.338519",
        "34.090425,-118.338933",
        "34.076646,-118.376969",
        "34.094986,-118.300885",
        "34.018780,-118.317919",
        "33.996658,-118.261708",
        "34.059244,-118.376969",
        "34.057106,-118.361326"
    ]
}
```

## Optimization POST Request

Bringing all these components together to create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>'
--header 'Content-Type: application/json'
--data '{
   "description": "Basic Route Optimization Example",
   "jobs": [
       {
           "id": 1,
           "location_index": 0,
           "service": 120,
           "pickup":[1],
           "skills": [1],
           "time_windows": [
               [
                   1693393200,
                   1693394100
               ]
           ]
       },
       {
           "id": 2,
           "location_index": 1,
           "service": 120,
           "skills": [1],
           "pickup":[1],
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
           "pickup":[1],
           "skills": [2],
           "time_windows": [
               [
                   1693396800,
                   1693397700
               ]
           ]
       },
       {
           "id": 4,
           "location_index": 3,
           "service": 120,
           "skills": [1],
           "pickup":[1],
           "time_windows": [
               [
                   1693402200,
                   1693403100
               ]
           ]
       },
       {
           "id": 5,
           "location_index": 4,
           "service": 120,
           "skills": [2],
           "pickup":[1],
           "time_windows": [
               [
                   1693400400,
                   1693401300
               ]
           ]
       }
   ],
   "shipments": [
       {
        "pickup":{
           "description": "Shipment Pickup 1",
           "id":1,
           "location_index":5,
	"time_windows":[[1693397400,1693397760]]
        },
        "delivery":{
           "description": "Shipment Delivery 1",
           "id":1,
           "location_index":6,
"time_windows":[[1693400700,1693401300]]
           },
        "skills":[2,3],
        "amount":[3]
        },
        {
         "pickup":{
           "description": "Shipment Pickup 2",
           "id":2,
           "location_index":7,
           "time_windows":[[1693429200,1693430100]]
        },
        "delivery":{
           "description": "Shipment Delivery 2",
           "id":2,
           "location_index":8,
           "time_windows":[[1693432800,1693433700]]
        },
        "skills":[2,3],
        "amount":[2]
       }
   ],
   "depots": [
       {
           "description":"Depot 1",
           "id":0,
           "location_index":9
       }
   ],
   "vehicles": [
       {
           "id": 1,
           "start_index": 10,
           "skills":[1],
           "capacity":[10],
           "time_window": [
               1693382400,
                   1693411200
           ]

       },
       {
           "id": 2,
           "depot": 0,
           "skills": [
               2,3
           ],
           "capacity":[10],
           "time_window": [
               1693382400,
            1693411200
           ]
       }
   ],
    "locations":
        {
            "id": 1,
            "location": ["34.083950,-118.318640","34.054927,-118.323726","34.075525,-118.361588","34.076350,-118.338519","34.090425,-118.338933","34.076646,-118.376969","34.094986,-118.300885","34.018780,-118.317919","33.996658,-118.261708","34.059244,-118.376969","34.057106,-118.361326"]
        }
}
'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "777fe88e8748be4f95d478ce657252d8",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=777fe88e8748be4f95d478ce657252d8&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Basic Route Optimization Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 4162,
      "routes": 2,
      "unassigned": 2,
      "setup": 0,
      "service": 600,
      "duration": 4162,
      "waiting_time": 14268,
      "priority": 0,
      "delivery": [3],
      "pickup": [8],
      "distance": 33584
    },
    "unassigned": [
      {
        "id": 2,
        "type": "pickup",
        "location": [34.01878, -118.317919],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 2,
        "type": "delivery",
        "location": [33.996658, -118.261708],
        "reason": "cannot be completed due to time constraint"
      }
    ],
    "routes": [
      {
        "vehicle": 1,
        "cost": 1341,
        "steps": [
          {
            "type": "start",
            "arrival": 1693388307,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.057106, -118.361326],
            "location_index": 10,
            "load": [0],
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1693388700,
            "duration": 393,
            "service": 120,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 1,
            "id": 2,
            "load": [1],
            "distance": 3579
          },
          {
            "type": "job",
            "arrival": 1693389407,
            "duration": 980,
            "service": 120,
            "waiting_time": 3793,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "id": 1,
            "load": [2],
            "distance": 7968
          },
          {
            "type": "job",
            "arrival": 1693393681,
            "duration": 1341,
            "service": 120,
            "waiting_time": 8519,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "id": 4,
            "load": [3],
            "distance": 10855
          },
          {
            "type": "end",
            "arrival": 1693402320,
            "duration": 1341,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "load": [3],
            "distance": 10855
          }
        ],
        "service": 360,
        "duration": 1341,
        "waiting_time": 12312,
        "priority": 0,
        "delivery": [0],
        "pickup": [3],
        "distance": 10855,
        "geometry": "ywznEjmlqUBG@G@GAEEEMIw@[q@WLoA@KB[JmAB_@?U@[?a@?iABiD?u@@c@@aB@iB@g@?S@_ABsF@aB?s@?k@@o@?m@@g@?UBgBB{EDcF@s@@qD@aB@[@gA?y@?]BuB?}@?W@m@?Q?W@{@?]?K@M?kA?Q?U?I@_@BuE@qA@W?c@DcB?u@?y@?M@}B@mA?]@g@@y@@s@@c@@aA?S?U@aB@g@?e@@s@?c@@uA?m@@o@?cC@u@@{@@o@?sA?Y?Q?I?Y@m@@g@AG?A?g@@[BUBUDUFYVmA@GH_@RgAb@}B\\mB`@sBX{ADUFUNy@ZgBReABQTgADSFYBKFc@BWD[F}@@IHaBZqFLaCPuCDo@D}@BS_@C^B@U@SB]@IBQHa@w@]YMSKICOIQIyAo@uAo@UMcJaE_Bs@[OeAe@w@_@[M]OuGyCYMUKe@Mc@MIC@gA?I?q@?c@@c@?g@?K?I?M?i@@e@?_C?eC?c@@uBA_@?i@?g@?]?gAKEMEYEOCUAGGMAY?Q?cA?S?MDi@AWA[?W?U?wE?oBBU@gB?kF@c@?kE?[?U?W?E@]BO@GBKBUDI?K@G?m@?S?cD@I?i@?Q?s@?G?IASGOGKGGECCIKGKEKM}@CEGEICKAK?I?{AA]?S@ODGBQFA?OBE@I?U?S?[?_B@wC?uB@s@?S?Y?I?Q?I?K?E???IAG?IAGAGAEAIAYCY?OA}B@mE?g@?wA@iA?S?gB?mA?mG@uD?_@?cA?Y?]?]??p@?x@?X?pA?xA?X?d@?^?b@?n@?j@?\\?hC?\\?zA_B@A`@@B?@?@?@DDBB@@@B?P?R?N?b@?d@?J?K?e@?c@?O?S?QACAACCEE?A?A?AAC@a@~AA?r@?vA?d@?j@?nA?nA?P@nB?h@?X?`@?nB?d@?p@?bA?j@?f@?b@?J?d@?f@?l@?V?l@?t@?Z?b@A\\@zA?hB?x@?P?n@?X?h@?n@V@N@N@D?T@RDNBNDLDLDDBJFTLPLTJNFPFD@N@TBV@N?fA?xA?b@?vBAp@DlAJTBV@r@?`C?R?t@?D?B?d@?f@Ad@En@ID?b@EZAJ?L?X?D?F?NB@?p@JJVHVFRJ\\@FH^D`@?B?B@T@L?TENAX?V?LAPCVCVWnC[dDEf@CXCZARAp@?tC@nA?JAN?LA\\DNA~@?nA?^?^AXANANAN?JAJ?N@r@@hA?d@?d@?x@?tC?d@?x@@nA?Z?h@?r@?p@a@???"
      },
      {
        "vehicle": 2,
        "cost": 2821,
        "steps": [
          {
            "type": "start",
            "arrival": 1693397145,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.059244, -118.376969],
            "location_index": 9,
            "load": [0],
            "distance": 0
          },
          {
            "type": "pickup",
            "arrival": 1693397515,
            "duration": 370,
            "service": 0,
            "waiting_time": 0,
            "location": [34.076646, -118.376969],
            "location_index": 5,
            "id": 1,
            "load": [3],
            "description": "Shipment Pickup 1",
            "distance": 2251
          },
          {
            "type": "job",
            "arrival": 1693397700,
            "duration": 555,
            "service": 120,
            "waiting_time": 0,
            "location": [34.075525, -118.361588],
            "location_index": 2,
            "id": 3,
            "load": [4],
            "distance": 3808
          },
          {
            "type": "delivery",
            "arrival": 1693398744,
            "duration": 1479,
            "service": 0,
            "waiting_time": 1956,
            "location": [34.094986, -118.300885],
            "location_index": 6,
            "id": 1,
            "load": [1],
            "description": "Shipment Delivery 1",
            "distance": 11654
          },
          {
            "type": "job",
            "arrival": 1693401229,
            "duration": 2008,
            "service": 120,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "id": 5,
            "load": [2],
            "distance": 15612
          },
          {
            "type": "end",
            "arrival": 1693402162,
            "duration": 2821,
            "service": 0,
            "waiting_time": 0,
            "location": [34.059244, -118.376969],
            "location_index": 9,
            "load": [2],
            "distance": 22729
          }
        ],
        "service": 240,
        "duration": 2821,
        "waiting_time": 1956,
        "priority": 0,
        "delivery": [3],
        "pickup": [5],
        "distance": 22729,
        "geometry": "gf{nEbooqU?GAWC{@Co@AUe@?_@Ak@?O?Q?G?QMK?Q?}@AK?U?gB?cB?W@OH}AA}@@c@?u@@M?cA@w@@Q@]?a@@W?S?[@Y?c@@{@@W?]@I?k@?U@aA@oA@kBBaA@uA@q@@i@@]?Y@sABm@?M@Y?g@@I?]?a@?OII?[@m@@O?Q?y@Bg@ZWRURMLi@d@OJOHQFWDc@DQBKBMDOFSHOH?@MF_Ad@ULkCrAa@Tk@XYNULaB|@YLw@`@g@Vk@XMAEAGCEAAECGAG?IA_@F[QIGCKGKG?{@BgC?aB?g@AiAP@v@ALAVA?q@AI?O?k@?W?Q?G?_@?M?a@?]?m@?y@?Y?K?W?[?a@?u@?e@?m@?e@?k@?q@?i@?a@?c@Aa@?i@?e@?cA?]?c@Aa@?g@?y@?k@?k@?}@?g@?]?]?e@?m@Ae@?o@?_@Ag@@k@Ag@?w@?a@?_@?S?SAS@Y?c@Au@?m@?aA?S?I?a@?i@?e@?o@?i@?o@?c@?k@Ao@?O?U?o@?e@?e@?[?S?U?O?Y?[?M?o@t@?\\?T?F?G?U?]?u@??kA?W?_@AS?S?c@?U?M?qA?i@?a@?]AQ?g@?mAAi@?c@?gA?i@?S?_@?sA?g@?c@?m@?y@?c@?Y?MAY?g@?]?[?i@?u@?_@?]?_@?}@?c@?_@Am@?g@?}@?g@?UAa@?a@?e@?c@?qA?a@@i@?oA?U?g@?g@?a@?c@?eA?g@?e@?M?c@?k@?yA?c@?k@?]?_@?gA?e@AaA@a@Aa@?y@?e@?s@?a@?c@?Y?e@?M?w@?q@?u@?w@?U?e@Ao@@yEAgB?}@?o@?s@?uB?o@?m@?a@Ac@?m@?q@?Y?q@?s@?i@?[AoA?y@?e@?uC?y@?e@?e@AiAAs@?O@K?K@O@O@O@Y?_@?_@?oA@_ADK@K@K@Q?W?K?mA?YAy@?c@?k@@U@U@]BYN{ALqA^wDBSDq@@Y?QASGM?UAMAU?C?CEa@I_@AGK]GSIWKWIY?CEOESE]Ec@?EAM?I?G?G?U?o@@cC?c@?_A?w@AU@g@?cB?S?qA?e@?S?U@_@?k@?wB?m@?o@AiB?m@?m@?o@AuB?m@?e@?c@?m@?u@?m@?g@?a@?y@?uA?S?aB?I?kA?M?eAAqA?gA?eA?mA?c@?Q?kAIAYCY?OA}B@mE?g@?wA@iA?S?gB?mA?mG@uD?_@?cA?Y?]?]??c@Ay@?U?y@?S?U?g@?a@?qA?U?e@?e@?mA?k@?SAe@?K@m@?U?]?aA?u@?o@?}@?O?A?SAmA?m@?iD?y@?s@?yBAk@?g@?o@Au@?k@?o@?g@?k@?iA?Y?o@?g@?m@?oB?M?O?GA[?o@?c@?_@?Q?C?O?qA?s@m@?aA?y@?QAM?U?S?U?O?C?I@K@A?G?wAAc@?U@oA?yC?_@@_B?kD?iJ@W?eA@eB?eB?wB?c@?{A?{A?m@?wD@iB?@z@?R@b@@^@b@@dABxA@r@BbCB~ABjC@bADtC?d@B~@@lADdB@f@HtHB`@?f@@v@Av@?l@?L?\\?L?HAB@N?N?PDp@BVBXBRB`@@PBp@?R?~@@`C?|B?^?t@@z@?dB?xB?bB?p@`EA@vE?bA@zC|@?dC?`@?`DA`@?lDA?dA?l@?z@?l@?r@?p@@nBAl@?l@?hA?t@?V?N?P?R?R?b@?^?n@?v@?b@?~@?|@?xE@dC?L?lA?L?`A?d@?\\?~@ApA?b@?v@?h@?r@?lA?d@?z@@t@?V?h@?N?fA?t@@d@?p@?lA?r@@^?X?\\?jA?lA?J?rA?l@?r@AxD?bA?^?tA?r@@hA?V?n@?p@?b@?z@?^@t@?x@?@?z@?r@?|@h@?L?T?XAp@AT?dA?L?T?nA?r@?h@?R?V?dB?Z?x@?b@?\\?`A?V?T?nA?V?L?R?rAAv@?RLP?hBAXArA@V?\\?Z?z@@`F@|HC`A?N?|H?jBC|A?zE@^?T?zB?B?r@?zGA|G?tC?h@?Z?lA?vE?~A?f@?`@AF?b@?v@?hF@b@?X?xE?pBAb@??|@?tC@vE?zE?jDAd@@rB?hB?lB@jB?rC?~@@rEAnE?tE?pE?rB@`@?P?j@?|@?d@?n@?P@j@?jB?rA?bA?zA?lA?fA?b@@dC?xB?R?~A?~@?dG?P?zA?N?j@@rCA`@?T?\\?\\AhBCj@A^A@A\\Ep@m@nKS|CMpCCX]rGOvCO`Ci@|JCVIzAQxCKrB?L?F?DDLHXX~@DLHXXMt@c@\\Sb@Ub@WLOHILMRSTU?ARSHKTYFEDEDENQPSRUFKHIT]DFDDHBH@\\Dh@DbBJ^DT@PBTFRH\\RRP\\^LRXf@R`@f@`A|CjGvBjEHRJVNVVd@Bf@Bd@@TBn@Bz@@V?F"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/basic-route-optimization.webp)

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- `summary` section:
  - We get an overview of the overall result with a total distance of 33584 meters covered within a total duration of 4162 seconds of driving time to complete all the assigned tasks.
  - There are 2 routes with a total cost of 4162. This cost is in seconds as we did not explicitly specify any `travel_cost`, so the solver went with the default setting of `duration`.
  - Other fields in summary tell us that there are 2 tasks (belonging to the shipment with ID 2) which remained unassigned, total service time of all the assigned tasks, total waiting_time for the assigned tasks and other details.

- `routes` section:
  - Gives step wise and route wise details of each route along with the vehicle which is going to cover each of them.
  - For each route we get details of the steps involved, ID of the vehicle which is going to cover the route, cost of the route, distance of the route and duration needed to cover it, encoded geometry of the route, service and setup times, pickup/delivery amounts involved in the route among other details. Please note the `cost` value is based on the `travel_cost` value provided in the input request. In our example, the cost is calculated based on the `duration`, hence all costs in the solution are in seconds. Consequently, we can see that `cost` and `duration` of both routes are the same as no [vehicle costs](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials/vehicle-costs) were involved.
  - For each step we get details like - step type, arrival time at the location of the step, service time, priority, setup time, location, ID of the job/shipment among others.
  - We can see that vehicle 1 is taking care of job 1, 2 & 4 while vehicle 2 is assigned to fulfill jobs 3 & 5 along with the shipment 1 pickup and delivery. This is because of the skills needed to complete those jobs. Take a look at the skills specified for jobs and 1,2 and 4 and that specified for vehicle 1.
  - The vehicle 1 starts from the provided start point but the vehicle 2 start from the depot location to which it was assigned to
  - On analyzing the routes further we can see that vehicle 1 waited for more than 3 plus hours to complete jobs 1 & 4. This is because vehicle 1, after completing job 2, arrives at the location of job 1 almost an hour earlier than scheduled time to start job 1. The vehicle then waits for the start of the time window when job 1 can be completed. Same happens with job 4 for which the vehicle arrives almost two and half hours earlier than the scheduled start time of the job.
  - `unassigned` section gives the details of the tasks that remained unassigned along with the reason for it. We can observe that this task was scheduled outside the `time_window` of vehicle 2 and hence remained unassigned. The shift timing of the other vehicle did also not cover the task’s scheduled time, but please note that vehicle 1 could not have fulfilled the task anyway because of the missing skills.

As we witnessed, NextBillion.ai’s Route Optimization Flexible API closely adheres to the time windows, skill constraints of the tasks and returns the best possible routes while keeping other factors into consideration. We encourage you to go ahead and try out different configurations of locations, time windows, skills, number of tasks and explore the powerful Route Optimization Flexible API.

We hope this example was helpful. Check out some more [use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization Flexible API can handle for you!
