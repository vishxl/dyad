# Transportation Cost Optimization

In the world of logistics and transportation, managing costs is as critical as ensuring timely deliveries. With rising fuel prices, vehicle maintenance expenses, licensing fees, and a host of other varieties of costs, effective cost optimization becomes absolutely critical. This guide explores the transportation cost management features that NextBillion.ai Route Optimization API offers to emulate real-world business constraints. For each vehicle used in the planning process, users can configure all or any combination of `fixed`, `per_hour`, `per_km` and `per_order` costs. Once specified, the routes with lower costs are preferred over others, in general, subject to other constraints like - time_windows, location of the tasks etc.

The transportation cost management functions of Route Optimization API aid users in

1.  Minimizing overall transportation costs
2.  Analyze actual costs incurred to identify favourable third party logistics providers

Let’s explore how transportation cost optimization comes into play when applied to a real-world route optimization problem.

## Setup

We have a total of 3 pickup jobs and a couple of shipments to be fulfilled. We use a total of 3 vans, which starts from a designated warehouse location and brings the items collected from the pickup locations back to the depot. To highlight the impact of transportation costs on the final solution, we provide multiple combinations of different cost types for each vehicle. Let’s configure the locations, tasks, and the vehicles along with their costs one by one in the following sections.

### Locations

We will start with adding the `locations` used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
"locations": {
       "id": 11,
       "location": [
           "34.083950,-118.318640",
           "34.076350,-118.338519",
           "34.000895,-118.204929",
           "34.018780,-118.317919",
           "33.996658,-118.261708",
           "33.916595,-118.240132",
           "33.946275,-118.385486",
           "34.02316039722285,-118.46149125160315"
       ]
   }
```

### Jobs & Shipments

Next we define 3 pickup jobs and 2 shipments. For each these tasks we configure:

- A unique identifier
- A Location index
- Specify the schedule of tasks using the `time_windows`
- A service time

Following is the completely built JSON with the desired configurations for the jobs and shipments:

```json
  "jobs": [
    {
      "id": "Pickup 1",
      "location_index": 0,
      "service": 300,
      "pickup": [
        10
      ],
      "time_windows": [
        [
          1693398600,
          1693399500
        ]
      ]
    },
    {
      "id": "Pickup 2",
      "location_index": 1,
      "service": 180,
      "pickup": [
        5
      ],
      "time_windows": [
        [
          1693401300,
          1693402200
        ]
      ]
    },
    {
      "id": "Pickup 3",
      "location_index": 2,
      "service": 300,
      "pickup": [
        8
      ],
      "time_windows": [
        [
          1693408500,
          1693409400
        ]
      ]
    }
  ],
  "shipments": [
    {
      "pickup": {
        "description": "Shipment Pickup 1",
        "id": 1,
        "location_index": 3,
        "service": 120,
        "time_windows": [
          [
            1693404000,
            1693404900
          ]
        ]
      },
      "delivery": {
        "description": "Shipment Delivery 1",
        "id": 1,
        "location_index": 4,
        "service": 120,
        "time_windows": [
          [
            1693405800,
            1693406700
          ]
        ]
      },
      "amount": [
        5
      ]
    },
    {
      "pickup": {
        "description": "Shipment Pickup 2",
        "id": 2,
        "location_index": 5,
        "service": 120,
        "time_windows": [
          [
            1693407600,
            1693408500
          ]
        ]
      },
      "delivery": {
        "description": "Shipment Delivery 2",
        "id": 2,
        "location_index": 6,
        "service": 120,
        "time_windows": [
          [
            1693409400,
            1693410300
          ]
        ]
      },
      "amount": [
        5
      ]
    }
  ]
```

### Vehicles

Next, we add the 3 vans that are going to fulfill the tasks along with their cost components. To configure each of these vans and their properties we specify:

- A unique ID
- A shift time or the time window
- Capacity to denote the amount of load that the van can take
- Start_index and end_indexes to denote the start and end points for a van.
- Skills of the driver or the van
- In order to demonstrate the impact of each type of transportation costs, let’s add
  - Van 1: A `per_hour` cost
  - Van 2: A `per_order` cost.
  - Van 3: A fixed cost.

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
       {
           "id": "Vehicle 1",
           "start_index": 7,
           "capacity": [
               50
           ],
           "costs": {
               "per_hour": 1000
           },
           "time_window": [
               1693396800,
               1693404000
           ]
       },
       {
           "id": "Vehicle 2",
           "start_index": 7,
           "capacity": [
               50
           ],
           "costs": {
               "per_order": 800
           },
           "time_window": [
               1693402200,
               1693411200
           ]
       },
       {
           "id": "Vehicle 3",
           "start_index": 7,
           "capacity": [
               50
           ],
           "costs": {
               "fixed": 2500
           },
           "time_window": [
               1693402200,
               1693413000
           ]
       }
   ]
```

## Optimization POST Request

Bringing all these components together to create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "description": "Transportation Cost Optimization Example",
    "locations": {
        "id": 11,
        "location": [
            "34.083950,-118.318640",
            "34.076350,-118.338519",
            "34.000895,-118.204929",
            "34.018780,-118.317919",
            "33.996658,-118.261708",
            "33.916595,-118.240132",
            "33.946275,-118.385486",
            "34.02316039722285,-118.46149125160315"
        ]
    },
    "jobs": [
        {
            "id": "Pickup 1",
            "location_index": 0,
            "service": 300,
            "pickup": [
                10
            ],
            "time_windows": [
                [
                    1693398600,
                    1693399500
                ]
            ]
        },
        {
            "id": "Pickup 2",
            "location_index": 1,
            "service": 180,
            "pickup": [
                5
            ],
            "time_windows": [
                [
                    1693401300,
                    1693402200
                ]
            ]
        },
        {
            "id": "Pickup 3",
            "location_index": 2,
            "service": 300,
            "pickup": [
                8
            ],
            "time_windows": [
                [
                    1693408500,
                    1693409400
                ]
            ]
        }
    ],
    "shipments": [
        {
            "pickup": {
                "description": "Shipment Pickup 1",
                "id": 1,
                "location_index": 3,
                "service": 120,
                "time_windows": [
                    [
                        1693404000,
                        1693404900
                    ]
                ]
            },
            "delivery": {
                "description": "Shipment Delivery 1",
                "id": 1,
                "location_index": 4,
                "service": 120,
                "time_windows": [
                    [
                        1693405800,
                        1693406700
                    ]
                ]
            },
            "amount": [
                5
            ]
        },
        {
            "pickup": {
                "description": "Shipment Pickup 2",
                "id": 2,
                "location_index": 5,
                "service": 120,
                "time_windows": [
                    [
                        1693407600,
                        1693408500
                    ]
                ]
            },
            "delivery": {
                "description": "Shipment Delivery 2",
                "id": 2,
                "location_index": 6,
                "service": 120,
                "time_windows": [
                    [
                        1693409400,
                        1693410300
                    ]
                ]
            },
            "amount": [
                5
            ]
        }
    ],
    "vehicles": [
        {
            "id": "Vehicle 1",
            "start_index": 7,
            "capacity": [
                50
            ],
            "costs": {
                "per_hour": 1000
            },
            "time_window": [
                1693396800,
                1693404000
            ]
        },
        {
            "id": "Vehicle 2",
            "start_index": 7,
            "capacity": [
                50
            ],
            "costs": {
                "per_order": 800
            },
            "time_window": [
                1693402200,
                1693411200
            ]
        },
        {
            "id": "Vehicle 3",
            "start_index": 7,
            "capacity": [
                50
            ],
            "costs": {
                "fixed": 2500
            },
            "time_window": [
                1693402200,
                1693413000
            ]
        }
    ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "abf22b1aac3334e8d3908712e2056580",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location curl --location 'https://api.nextbillion.io/optimization/v2/result?id=abf22b1aac3334e8d3908712e2056580&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Transportation Cost Optimization Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 9047,
      "routes": 3,
      "unassigned": 0,
      "setup": 0,
      "service": 1260,
      "duration": 7061,
      "waiting_time": 2970,
      "priority": 0,
      "delivery": [10],
      "pickup": [33],
      "distance": 100773
    },
    "routes": [
      {
        "vehicle": "Vehicle 3",
        "cost": 5027,
        "steps": [
          {
            "type": "start",
            "arrival": 1693403941,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02316039722285, -118.46149125160315],
            "location_index": 7,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.02322, -118.46154]
          },
          {
            "type": "pickup",
            "arrival": 1693404900,
            "duration": 959,
            "service": 120,
            "waiting_time": 0,
            "location": [34.01878, -118.317919],
            "location_index": 3,
            "id": 1,
            "load": [5],
            "description": "Shipment Pickup 1",
            "distance": 15900,
            "internal_id": 1,
            "snapped_location": [34.01873, -118.31783]
          },
          {
            "type": "delivery",
            "arrival": 1693405800,
            "duration": 1739,
            "service": 120,
            "waiting_time": 0,
            "location": [33.996658, -118.261708],
            "location_index": 4,
            "id": 1,
            "load": [0],
            "description": "Shipment Delivery 1",
            "distance": 23487,
            "internal_id": 1,
            "snapped_location": [33.99659, -118.26171]
          },
          {
            "type": "job",
            "arrival": 1693406708,
            "duration": 2527,
            "service": 300,
            "waiting_time": 1792,
            "location": [34.000895, -118.204929],
            "location_index": 2,
            "id": "Pickup 3",
            "load": [8],
            "distance": 29980,
            "internal_id": 4237063940,
            "snapped_location": [34.00089, -118.20496]
          },
          {
            "type": "end",
            "arrival": 1693408800,
            "duration": 2527,
            "service": 0,
            "waiting_time": 0,
            "location": [34.000895, -118.204929],
            "location_index": 2,
            "load": [8],
            "distance": 29980,
            "snapped_location": [34.00089, -118.20496]
          }
        ],
        "service": 540,
        "duration": 2527,
        "waiting_time": 1792,
        "priority": 0,
        "delivery": [5],
        "pickup": [13],
        "distance": 29980,
        "geometry": "cdtnEr_`rUc@cA}@p@u@cBSe@a@{@_AyBKWM_@Q_@e@iAaA{BQc@]{@s@mB[u@Wq@a@_AQc@Qg@O]]y@O_@Yu@y@sBSg@[}@i@mAIQ[q@MYEOCGCGQg@FGTWVS^[PMHGNKHIJKFUXOOW?CEKCKGQESGYCQO_AG_@Gc@G[I[?CK_@I[IWCKESQm@I[Q}@GSEW{@{B[iBaAyFSkAG_@EUE[My@QkAQcAIe@Ii@Mo@EQ_@yBKy@Im@AIEWAKUuBGo@Is@AMWeDI}@WiD_@gFSoCMcBCa@Eo@AUCSMoBWkDKqAIoAS{B?IAG?GCM?OAMAKC[Cc@WoDKmAI{AQ{DCeAAy@CoACiBAgC?i@?mAA_D?wN?UAaI?k@?a@Ae@?W@mAAsDAmE?wA?i@?{@Au@?C?g@?u@CsB?_@@s@?gAA_@@g@?q@@u@?W@W@U@]@UBc@B]BYBU@QBQHk@Fo@DUTaAFYDSFWH]FUFWH[Jc@Nk@@ELe@HYH]FUNk@FUDODSDODQBODQDSBQDQDSDYDa@Hm@BUB[BYBYDe@@a@FmADcAF{AFeBFqAD_AH_C@O@QBk@Bc@Bs@D}@DaAF}ADs@Be@B}@DaADkADkAB_@PaFBYD_A?OFuABk@HaCDi@?KLaDFyA?GBy@?]?_@?[?{@AKCaAEaAG_AGk@CUK_AO_AO_AS}@U}@U{@Y{@GOIQIW]w@i@kA[m@GMMWGMMWEKe@_AIMCGAEIO_@s@Ue@m@kAi@iAUc@wC_GUe@eCcFe@_Am@kAEK{A}Cg@}AMUIQM[g@oA[s@a@}@Qa@[m@[q@_@w@Ug@Q_@M[ISGOEMKYMa@GUGYI_@Mo@G[GYGc@KaACSC_@Ci@C]AY?e@Aa@?g@@s@B]@Y?a@?MBS@K@M?EDk@Ho@Lm@DWBIHa@FWBMLe@TaAfAyEFUR}@Fc@Dc@Bg@By@@U?S?G@UBoC?O@_@?MD]Fs@NaBBsALgAD]J}@F_@@KFe@ZkCBKBWHk@XyBHm@Fg@X{BHg@NcA`@gDLu@@ONaAL}APeBD{@Do@FkADaABi@@u@BeA@_A@yACqCWwJCs@Aq@Au@AM?y@HiB@}BAaC?OAmBImFEaAA_@EaCG}CAuAAsB?IA]?G?IAGAY[{PGsBQeFIaCIs@AeACy@EkCCs@MeHAa@?EAm@Ao@As@Cm@AiACu@IqEAWCu@CgAE{BIcEMoHAa@EeB?a@UmMEoBEyBC}BGmCCqA?OCu@A{@AYEyAAYK}BK}AAYc@mFIcAKoAIcAGw@[iEUsCIcA?wBGuBC{@Cs@?KEsAEgBGcBEq@r@ANAH?XCJE~@?rA?T?dB?vAAP?jA?b@?rA?h@?p@?`C?pCAb@?T?R?j@?b@?L?l@?v@?lA?d@?|@?jB?dDA`@?z@?n@?h@?vAAf@?L?h@?j@?^?T?X?x@?h@?rB?h@AhA@nA?fE@R?fH@X?dA?bA?N?b@?J?L@F@F?HB??D@FDHBHFFDGEIGICPqB@SNaBLcBHeBDw@Bo@Bu@?yDHm@Fa@F[Fa@BS@O?S?g@?S?S@[AO@a@D_@@Y?UAW@g@?i@?W?aE?_@?Y?W@}A?u@?_@BuA@kB@wA?SAeB?O?eA?W?O?sA?U@O?kA?oB@iB?aC?yA?_E@eE?_@?}B?k@?eACcG?qB?uD@S?{@?c@?kA?yA?cB?G@{A@a@CaB@y@?mA?{@@q@?gA?S?_@@{@^?f@?V?^AtA@r@?|@?zB?n@?f@?^?dD?bA?tD?|A?bC?\\Ah@?\\?H?HGv@?bA?Aq@A]?I?I?KAWAa@Ag@Cq@?Y?WCmAIeE?o@Co@AYAYA_ACcAEaAAgAAs@?W?mBAoC?g@?m@?]AiB?yA?C?K?qA@Q?q@?g@@_@?]?W?O?m@L?Z@V?n@AzBA`@Ad@AHAhAIlBMbC]n@?x@?V?bBApC?zA?x@Af@?tDAH?v@?R?|AA~A?JAvAA`ACxDKhAE\\Cl@CdBGlBJ\\?v@@~@Bd@?vAAdA?r@?`@?R?L?R?`@?J?F?J??O?y@?MAG?I?S@i@?_@?gG?_@?u@?Y?k@?a@?O?a@?uB?[?k@?wK?s@?e@A]?w@?w@?g@?e@?_@AmBAiBAaI?_@?y@?U?y@?EAI?A?iDA_BA_BC_H?i@?S?W?_A@gA?o@AMAwP?s@?M?kBeB@_B?iDAo@@wB?yA@eB?q@?m@?O?_BAeA@a@AuC?eE@c@?e@??}@?c@AqD?_AAkA?oA?e@?c@?c@@iA?w@?O?M?W?sA?{A?W?a@?O@kB?g@?Y?mF@aB?g@?c@?Y?G?uA?u@?y@?cE?U?o@?w@@sA?u@CsD?O?IA[?cA?mA?oA?s@A_@@[Aa@@]?U?_A?[?]?Q@a@?a@AeB?]?c@@W?u@?QAc@?u@?Y?kA?gB?]?_@?k@?}@?gD?c@?m@?m@?gA?{@AU?U?aA?Y?q@?w@?qA?y@?}A?k@AY?W?I?qF?e@?OAkA@{@?[?UAQ?cB?S?K?iA?K?S?e@?W?k@?[?e@?q@?M?K?]?g@?u@?[?eA?G?GHW?wB?s@?m@@cA@aA@u@@WG[@GD]Hc@FYDOLc@FSFMHSR_@NW@CZe@RWPQXUBCNKNMTMJILENIJGBATILCBALCNEJCLCHA`@CD?NAL?TAb@?N?J?L@ZAN?n@A^?~@??k@?[?a@A]?g@?eB?e@AgA?Y?oC?SAiH?oB?_@@k@?cAAcA?WAc@?I?]A{@?[AY?M?w@AS?K?k@?SAiA?[A{@?iA?[AoA?c@?EA]?O?g@?w@AS?mA?[AU?i@?_@Ak@?cAAu@?i@?Y?eAA_A?k@CgC?I?SCeE@WAs@?eCAgAAoA?]Ai@?e@?q@mBB[?A?e@ACA?AEaDCuA?K?kCBGHGPAVK??",
        "internal_id": 554473738,
        "profile": "default",
        "adopted_capacity": [50]
      },
      {
        "vehicle": "Vehicle 2",
        "cost": 3515,
        "steps": [
          {
            "type": "start",
            "arrival": 1693406565,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02316039722285, -118.46149125160315],
            "location_index": 7,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.02322, -118.46154]
          },
          {
            "type": "pickup",
            "arrival": 1693408085,
            "duration": 1520,
            "service": 120,
            "waiting_time": 0,
            "location": [33.916595, -118.240132],
            "location_index": 5,
            "id": 2,
            "load": [5],
            "description": "Shipment Pickup 2",
            "distance": 30071,
            "internal_id": 2,
            "snapped_location": [33.91656, -118.24025]
          },
          {
            "type": "delivery",
            "arrival": 1693409400,
            "duration": 2715,
            "service": 120,
            "waiting_time": 0,
            "location": [33.946275, -118.385486],
            "location_index": 6,
            "id": 2,
            "load": [0],
            "description": "Shipment Delivery 2",
            "distance": 48869,
            "internal_id": 2,
            "snapped_location": [33.94611, -118.38548]
          },
          {
            "type": "end",
            "arrival": 1693409520,
            "duration": 2715,
            "service": 0,
            "waiting_time": 0,
            "location": [33.946275, -118.385486],
            "location_index": 6,
            "load": [0],
            "distance": 48869,
            "snapped_location": [33.94611, -118.38548]
          }
        ],
        "service": 240,
        "duration": 2715,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [5],
        "pickup": [5],
        "distance": 48869,
        "geometry": "cdtnEr_`rUc@cA}@p@u@cBSe@a@{@_AyBKWM_@Q_@e@iAaA{BQc@]{@s@mB[u@Wq@a@_AQc@Qg@O]]y@O_@Yu@y@sBSg@[}@i@mAIQ[q@MYEOCGCGQg@FGTWVS^[PMHGNKHIJKFUXOOW?CEKCKGQESGYCQO_AG_@Gc@G[I[?CK_@I[IWCKESQm@I[Q}@GSEW{@{B[iBaAyFSkAG_@EUE[My@QkAQcAIe@Ii@Mo@EQ_@yBKy@Im@AIEWAKUuBGo@Is@AMWeDI}@WiD_@gFSoCMcB@}@@I?MGqACk@KwBI_BA_@?Y?[@YBS@QBQBSBODQDOFWHSHUJSFOJQJQFGDGLKLMp@i@bAyANMdAw@|@q@d@]xAeAtAcAhAw@pA}@`@Y~@s@z@m@FGrA_Ad@]dAu@tAcAtAaAlA}@`@[xFeEvDoCjBuAx@o@ZUJGf@]VS\\WJIROFEd@]r@i@pByAPMdGmExBaBtB{AxB_BtB}AzAiAf@]`As@|BcBbDaCz@o@XSVQRMFGNKVSFCxAgAp@g@POVQl@c@ROLIp@g@PO`@Yx@m@l@e@jDeCZU`As@l@c@p@g@nA_An@c@d@]`Au@h@_@h@a@JGHI|@q@RM~IoGzAiA`@YZUDEf@]VSXSbAu@r@i@JITOVSPMhAw@LKbAu@DCjA}@h@_@vB{An@g@d@]~AiA`E{CXUbBmAbCgBjCoB^YlCoBNINMHGHGPMNMXS~@q@\\WZUXSb@[\\WRQr@i@dAw@NMf@_@^WnAaAhA{@d@]tEkDj@c@TQXU\\YpByAx@o@RMHIVQVSHGLKFIFEDEJILK`@S\\QfAy@ZU`Au@vAeAhBqAd@]~AkArAcAfCkBBCPMdAw@tCuBNKt@i@`@[HIPKDCh@c@n@c@t@i@`Aq@VSZWj@_@POTOf@_@l@c@NMVUJIFIXUFGJMPURW`@k@JOLQJQDIP[NYN[Vo@Zy@Zw@Xu@J]JWL]Tq@f@wATo@Xs@To@Z{@HUL[Pk@\\_AN_@f@wAfA}CJYd@mAHWN_@|AmE`@gAJWHUVq@Rk@hAqCb@eA\\s@f@kAp@wABEZo@LWn@oAr@wAFKbBoDn@}ABEDMFMZw@\\{@pAaDvBkFRe@z@wBVm@Xs@Tm@P_@Vk@\\m@Ta@TYRYRYFIj@o@NQ@AVW^_@^[`@YLIRO`@WZQTORKRITKPIJCPG\\KRGTGn@Q|@S|@QPC\\Ij@Mp@Oh@MXETG\\Ib@It@QREVGHAh@MnAWt@On@Kl@It@K\\EPAJAJAl@Ef@Cn@C`ACnAA~A@j@?tA?~A@xA@jA?v@@rB@xA@~B@\\?~@@p@?z@@X?tA?T?`AAZAp@Cx@E\\Cn@EZCh@Gf@El@IVENCr@Kh@IJCl@Kl@KbAOZGXE`@Gh@G`AKn@GF?r@G`@A^CPAj@AL?l@C\\?~@ArA?hA?lA@fB?r@@Z?rA?l@?jC@fAAvE?t@?r@?t@?nA?vA?zA?x@?j@AhDA`B?^?PAVDRBzAVxA@vCJ|@BhABrABJ?H@z@DtADX@rADp@B|AD~CPJ?L@P@\\?d@?RAPAb@ARALCFCFADAFCRIJGJGTKRKNOFENODC@AFINOLMFGFKJODGHKDG@EFKFM@?HSDMFQDOBODUDOBO@MBQBYBQ@Q?O?O@Q?[?SAUAYCQAUE_@EUESESGSGUIWIQ_AuCSm@M_@K[M_@Wu@W{@K]GWEKIUGMGOEOGSM]CKSk@EMGMK[u@yB[gAUu@Sw@CGAGa@Wm@_DG[Ou@Q{@_@iBMo@GUG]CSCMIm@Ie@Gi@Gq@EWC_@Ek@C[A[CWAS?MAOAU?[Ai@CuA?}@@e@@s@@_@@W@k@Dq@Fm@B]Fg@Da@D_@Fa@Fe@Hm@Hc@Hi@TuAH]P}@TcALe@Ja@DSJg@Lc@HULc@^gAPi@Vs@f@sABIf@gAZq@JSh@mAJUNYd@}@f@_Ar@qA\\i@f@y@V_@Xc@r@iAR[bBkC~AeCn@aA`@m@P[n@_Ab@q@l@_Az@wAh@{@f@w@^s@Ra@Zo@Vm@^_AX{@Rq@Pi@Po@d@qBBO@KBOP}@Fm@Ju@Hm@BYDc@B[Bc@FoAFoABsA?kA?g@Ai@Ay@Am@Cs@Au@E{A?QI_DAi@G_C?UCeAE}AKmEGsB?_@AQ?OEgB?_@WmJGsBIyCC}C?K?y@AyB@iC?sD?O?q@?Y?A?_@@wB?e@@uE?{A?iA@_D@mB?S@aD@e@?qA?cBAq@AaCG}BGuBM_DIyAE_@CYGw@c@sEW_C_@oCe@qDc@cD_@gCE]a@}CQkAq@uEm@sEQgAUeBQmAMgAk@_EIo@Ks@Ea@g@iEE]CYImAI}AI{AAc@Aa@Cg@CkBAm@?eAA{B?i@?k@?[?w@@aE?aB?K?U?m@?]?Q?G?M?Y?K?qC?s@?e@?uA?a@?Y?oC@mDAmC?mA?gD?_D?S?O?e@Ag@@g@?K?[?KAs@@K?K?WAm@?Y?O?M?i@?M?U?S?M?e@@cA@iCBuB@a@Bs@Bo@Dy@DgALyBN}BTeCN_BJ_AHs@BQ`@}CHi@Hq@BUBWBYVkDDaAHeB@_@@Y@m@@k@@{@?cG?k@?g@?M?o@?i@?{@?_A?{@?uA?cA?kA?I?M?{A?A?eD?s@?u@?c@?{A?Y@eAAsG?M?q@AyA?cAAa@A_@EoBCu@Ew@Y_FEg@Ew@Gq@ASG}@Eg@Eg@G}@E{@I_AGw@AMAQAQMkBC[GeAAKAM?CIgAG}@Ei@SqCG_ACa@IsAAIOyCE}@GyAAm@Am@Au@?m@?a@Aa@?a@@s@@eA?W@k@@]@o@@i@@g@@]@i@D{@?SBo@?EZgCBs@FkAD_@L}ARmCH_AD_@D[FUFOLST[x@cA`@g@PWHQFQDQ@M@Q?S?]?A?]?i@PAT?b@?j@?b@?v@?p@?pAAV?D?X?R@|@A|@?z@?H?`@?N?XAj@?L@p@?J?vC?X?lA@rB@r@?l@?l@?^?X?t@?r@?X?bA?jA@r@@h@?J?b@?j@?P?X?bAAN?`@@lA?b@?N@JA?XJT?h@?~@?h@O?[HWFVGZIN??l@?V?n@?z@?nB?bD?v@?tA?rA?p@?hF?T?R?X?^?^?\\?\\?v@?dAAV?^?D?\\?F?NAX?t@?b@ArA?HCrC?|@?t@?NAT?L?NA^?dACvCApA?BCdGAp@?\\?T?^?\\?h@?f@?DAX?NQ?m@?eBA_@?Y?g@AY?eB?qC?gC?S?c@?[?w@AK?m@?gA?U?}DA[AO?U?UL[?Y@M?QAS?Q?gBAK?UO}ACK?c@?e@?G?SA{BA_A?_B@YAQ@W?c@A}@Ak@@IDIFO?c@Aa@?K?O?S?M?c@A]?@N@NDT@JBRBTDR@TJp@Df@DZD\\@NBTBL@PDTN`ADZF^BRBVHZF\\Jl@PfABv@Bx@HrD@|A?dD?vA?n@?n@?bB?v@A~B?rA?rA?jA?pD?H?fFAzH@bFAtACdAA|@Ch@Cb@GnAIjAEd@AVCPa@|DAFAHWrBKbAE^]nCQrAUzBCVKpAM|AIdBElAGnBA^CzB@lA?x@@nAAN?\\?`@?f@?J?P?`@?l@?R?f@@~@AV?b@?N?f@?Z@L?J?N?L?hF?jBBjL@pA?H?zD?hA?fC?`@?r@@`@?ZAlBAdE?t@?t@?R?bC?xA@`ABhABdABl@BT@R@R@^B\\@VBP@XBT@N@NDX@LBX@LHn@Jx@NhADf@XjBXpBr@bFT~AL~@BLDVl@pEn@tEBN@BvBfPN~@L~@b@bDXtBR`BHt@NhBBRB^@RB^JdBHdBBv@Bt@D`BBpA?z@@p@?|@?r@?z@AjA?X?t@AlA?V?jA?V?n@?~@A|A?nA?n@?h@AhAAhC?nA?pAArA?P?dA?jA?~@?nA@nE@t@?V@d@BrABrABdABpABjA@x@F|BDnB?PBfB?V?H@^@d@@f@BdADz@HpB@n@PfGNtGFtB?RHrB@v@?p@AnA?DAh@Ah@Ch@AXGtA?FK`AGn@Ip@G`@CVIb@Ih@Kj@ELCNCLCLEPIZMb@ERKXABENMb@Sh@m@vAKXGNUd@Wd@Q\\S\\MR[h@W`@k@x@a@p@a@l@oAnBMTe@p@MRGJg@r@OVe@t@{A`Cs@jAs@fAOVOV_@h@W^uBrDOXKRUd@OXWh@Yj@QZMT]z@_@x@Uj@GNAD_@|@Qb@Un@Wv@Sp@Ql@Qn@GVW`AKl@Kb@GXCPKf@If@CJOz@AFIj@Mx@OfAEf@Ip@Eb@Et@Ep@Cb@Cd@A`@Ab@?VAfAB`A?d@?R@f@@`@Dl@@`@B\\D`@Fh@H~@BNL|@PfAJd@Ln@F\\p@bDH\\TfANp@Jb@Ln@Jh@VjAjAxFPt@H`@DPDNH^d@zBb@pBTdAVnAJf@R~@Nx@HZLn@TbAH`@Lr@VjADZLr@LfAHbADh@BV@^BX@N@H?H@L?L?P@Z@V@R@T@\\?\\?l@@~A@^?dA?nA?hE?nA?nE?r@?rCAzACj@AXAXAb@Ex@Gv@Gd@ARGh@CVAJAFEZGh@Gf@CNGd@Kv@Gh@Gb@Gf@G`@AJAJCRADEXO|@Mn@Ih@Ef@Gf@Iz@?FKlAEx@AXEjAAr@Ar@A|@@b@@p@@|@?P@|@@b@BnA@bADhC?JBvDAt@?f@Ev@C|@Cl@?TCdAC`@Cp@?\\ATAf@CjAAf@ATAhAAlCEHCJEd@It@IpAC\\Gt@C\\E`AEr@AvAApBB~AAn@A\\CZEVIXK^GLGLINKNUVKJ[VSJMJULQFSHcC?kAAg@AM?I?I?O@K?U???M?g@@[?{B?Q?m@?cA?m@?cA?eA?o@@mB?iB?mB?q@@_@?Q?{@?G?g@?Q?W?kA?S@S?gA@_@Ge@Ei@ESA[EUAQ?W?c@?c@?a@?W?UAQCOGMGKKIKGMEKGQISKQKQOQSOUQm@a@g@SGIKOIOGSQc@[_AUm@GOGQKYKa@EQSWI_AAe@Ak@?q@BuC?W?]?cA@oBA{E?}@AeC@kB?Y?_@?g@?[@gBAa@@QQ?QAc@AgAA?aAz@?BA@A?E@uCc@?Y?C?ABA@@hB??",
        "internal_id": 571251357,
        "profile": "default",
        "adopted_capacity": [50]
      },
      {
        "vehicle": "Vehicle 1",
        "cost": 505,
        "steps": [
          {
            "type": "start",
            "arrival": 1693398003,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02316039722285, -118.46149125160315],
            "location_index": 7,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.02322, -118.46154]
          },
          {
            "type": "job",
            "arrival": 1693399500,
            "duration": 1497,
            "service": 300,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "id": "Pickup 1",
            "load": [10],
            "distance": 19037,
            "internal_id": 4270619178,
            "snapped_location": [34.08391, -118.31864]
          },
          {
            "type": "job",
            "arrival": 1693400122,
            "duration": 1819,
            "service": 180,
            "waiting_time": 1178,
            "location": [34.07635, -118.338519],
            "location_index": 1,
            "id": "Pickup 2",
            "load": [15],
            "distance": 21924,
            "internal_id": 4253841559,
            "snapped_location": [34.07635, -118.33851]
          },
          {
            "type": "end",
            "arrival": 1693401480,
            "duration": 1819,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07635, -118.338519],
            "location_index": 1,
            "load": [15],
            "distance": 21924,
            "snapped_location": [34.07635, -118.33851]
          }
        ],
        "service": 480,
        "duration": 1819,
        "waiting_time": 1178,
        "priority": 0,
        "delivery": [0],
        "pickup": [15],
        "distance": 21924,
        "geometry": "cdtnEr_`rUc@cA}@p@u@cBSe@a@{@_AyBKWM_@Q_@e@iAaA{BQc@]{@s@mB[u@Wq@a@_AQc@Qg@O]]y@O_@Yu@y@sBSg@[}@i@mAIQ[q@MYEOCGCGQg@FGTWVS^[PMHGNKHIJKFUXOOW?CEKCKGQESGYCQO_AG_@Gc@G[I[?CK_@I[IWCKESQm@I[Q}@GSEW{@{B[iBaAyFSkAG_@EUE[My@QkAQcAIe@Ii@Mo@EQ_@yBKy@Im@AIEWAKUuBGo@Is@AMWeDI}@WiD_@gFSoCMcBCa@Eo@AUCSMoBWkDKqAIoAS{B?IAG?GCM?OAMAKC[Cc@WoDKmAI{AQ{DCeAAy@CoACiBAgC?i@?mAA_D?wN?UAaI?k@?a@Ae@?W@mAAsDAmE?wA?i@?{@Au@?C?g@?u@CsB?_@@s@?gAA_@@g@?q@@u@?W@W@U@]@UBc@B]BYBU@QBQHk@Fo@DUTaAFYDSFWH]FUFWH[Jc@Nk@@ELe@HYH]FUNk@FUDODSDODQBODQDSBQDQDSDYDa@Hm@BUB[BYBYDe@@a@FmADcAF{AFeBFqAD_AH_C@O@QBk@Bc@Bs@D}@DaAF}ADs@Be@B}@DaADkADkAB_@PaFBYD_A?OFuABk@HaCDi@?KLaDFyA?GBy@?]?_@?[?{@AKCaAEaAG_AGk@CUK_AO_AO_AS}@U}@U{@Y{@GOIQIW]w@i@kA[m@GMMWGMMWEKe@_AIMCGAEIO_@s@Ue@m@kAi@iAUc@wC_GUe@eCcFe@_Am@kAEK{A}Cg@}AMUIQM[g@oA[s@a@}@Qa@[m@[q@_@w@Ug@Q_@M[ISGOEMKYMa@GUGYI_@Mo@G[GYGc@KaACSC_@Ci@C]AY?e@Aa@?g@@s@B]@Y?a@?MBS@K@M?EDk@Ho@Lm@DWBIHa@FWBMLe@TaAfAyEFUR}@Fc@Dc@Bg@By@@U?S?G@UBoC?O@_@?MD]Fs@NaBBsALgAD]J}@F_@@KFe@ZkCBKBWHk@XyBHm@Fg@X{BHg@NcA`@gDLu@@ONaAL}APeBD{@Do@FkADaABi@@u@BeA@_A@yACqCWwJCs@Aq@Au@AM?y@HiB@}BAaC?OAmBImFEaAA_@EaCG}CAuAAsB?IA]?G?IAGBe@@Q@QDMFKFIJGBAFCJAF?H@LDJHFFDFFLBL@J?NCNCLINKHKFKBKBK?MCOC[IQGGAG?G@KEOCGAMEEAMEoA_@AAMCMEWGQEKC]ISGWDSG]KeCu@_EmAq@UKC[KOEYK_@Me@Qi@Q_@Om@SWI]OQIIEeAa@]Mg@QOGa@Kk@Sc@Mo@Qs@SSGeAY{@WWIk@OyCy@UIqBk@WG_@KiA[i@OICOEKCUIa@K[ISGk@O]IICa@Ki@M[K[IQEkA]c@Mo@Qs@Ss@So@Qe@Mc@MA?}@WC?MEQA??UAO?o@BI@M@S?i@@o@?q@?Y?G@iADK@G?s@?K?OCQAUEGAa@M]KKCQGk@QsA_@ICUEMEEAa@IMCg@GSCEAA?C?SAu@]IAICICGEECGGGOEOAECIKGSk@iAeDs@sBa@mAQe@CGEOIMGGGEEAECICsCy@MCe@Ka@Ia@Ii@MWG[IkA[cA[]Ia@Ma@MuCy@kBg@e@Mc@MmCu@]KW?KAI@K@M@KDGBC?MDWHE?M@QIM?O@O?}@@mB?cAAoC@w@?c@?c@@o@?}@@Q?gE?_@?_@?_D?cAAkB@a@?g@?gAA}B@_E?kA?cF?iE?{A?gA@gCAM?s@@yBA]?o@?Q?{B?iF@iDAY?gEB_IAaFA[@[?_@?AaA?c@?U?g@?y@AwD?q@?}CAo@?qA?wA?g@?_C?O?OBY?Q@U?S?i@?i@?yAA_B?c@AwA?_B?Y@{AAcB?_@@{AAk@AO?_@?q@?W?m@?m@?_@?g@?IAq@?k@?c@?u@?Y?o@?Q?y@?iBA{A@]?c@?[?u@?m@?W?m@?g@?e@?K?c@?g@?k@?cA?q@?e@?oB?a@?Y?i@AoB?Q?oA?oA?k@?e@?wA?s@_B@A`@@B?@?@?@DDBB@@@B?P?R?N?b@?d@?J?K?e@?c@?O?S?QACAACCEE?A?A?AAC@a@~AA?r@?vA?d@?j@?nA?nA?P@nB?h@?X?`@?nB?d@?p@?bA?j@?f@?b@?J?d@?f@?l@?V?l@?t@?Z?b@A\\@zA?hB?x@?P?n@?X?t@?b@R@F?`@BT@RDNBNDLDLDDBJFTLPLTJNFPFD@N@TBV@N?fA?xA?b@?vBAp@DlAJTBV@r@?N?pB?R?t@?D?B?d@?f@Ad@En@ID?b@EZAJ?L?X?D?F?NB@?p@JJVHVFRJ\\@FH^D`@?B?B@T@L?TENAX?V?LAPCVCVWnC[dDEf@CXCZARAp@?tC@nA?JAN?LA\\DNA~@?nA?^?^AXANANAN?JAJ?N@r@@hA?d@?d@?x@?tC?d@?x@@nA?Z?h@?r@?p@a@???",
        "internal_id": 520918500,
        "profile": "default",
        "adopted_capacity": [50]
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

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints.

![Sample route plan when different transportation costs are in play](https://static.nextbillion.io/docs-next/docs/route-optimization/transportion-cost-optimization.webp)

_Route Plan to optimize transportation cost_

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- As we know from the Basic Route Optimization example that the `cost` value is returned as per the `travel_cost` set in the input request. In our example, the cost is calculated based on the `duration`. Let’s take a look at the costs for each vehicle:
  - **Vehicle 1**: This van’s incurs costs `per_hour` at the configured rate of 1000 per hour. In the solution, this vehicle is assigned to a route that takes around half an hour to complete (~1819 seconds). Hence, the overall cost for this van, and effectively for the route, comes out to be 505.
  - **Vehicle 2**: This vehicle was configured to incur cost for each order that it completes at a rate of 800 per order. In the solution, this vehicle fulfills only 1 order (Shipment 2) and hence the cost of 1 order is added to the overall duration of 2715 seconds that it takes to complete the route, leading to an overall cost of 3515.
  - **Vehicle 3**: This vehicle was configured with a `fixed` cost of 2500. So the overall duration for this route, 2527 seconds, was added to the fixed cost to give a final route cost of 5027.

As we saw, NextBillion.ai’s Route Optimization API understands the cost considerations you provide and suggests the best solution accordingly. We encourage you to go ahead and try out different configurations of vehicle or task locations, time window constraints, number of tasks and explore how different solutions are generated for different scenarios presented to Route Optimization API.

We hope this example was helpful. Check out more [tutorials & use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization API can handle for you!
