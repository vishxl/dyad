# Routing Profiles

Managing a fleet with a variety of vehicle types—such as cars, trucks, and minivans—often requires separate route planning requests for each vehicle type, leading to unnecessary complexity and inefficiency. NextBillion.ai Route Optimization allows users to define multiple **Routing Profiles** to plan routes for mixed vehicle fleets in a single request.

This tutorial will guide you through how to set up and configure routing profiles, where you can define unique routing constraints and preferences for each vehicle type, including travel mode, departure time and more. Each vehicle can be tagged to a profile, enabling seamless, optimized route planning for an entire fleet with varied vehicle types, saving time and improving operational efficiency in the process.

## Setup

We have a total of 10 delivery jobs to be fulfilled by a fleet of mixed vehicle types. The fleet has 2 types of vehicles in it - minivans and cars. For each of the vehicle profiles, we will define its routing characteristics and then use them when defining actual vehicles. Let’s start with configuring the locations, delivery jobs with their revenues, and the vehicles one by one in the following sections.

### Locations

First, we define the `locations` object and add all the location coordinates used in the problem along with a valid `id`. The `locations` object used in this example:

```json
"locations": {
      "id": 1,
      "location": [
          "34.02410429,-118.25503086",
          "34.04118314,-118.24377960",
          "34.05248264,-118.25345384",
          "34.04890945,-118.25881547",
          "34.04456349,-118.26277841",
          "34.03674018,-118.25811613",
          "34.03374589,-118.25333728",
          "34.02947273,-118.24628531",
          "34.04736425,-118.23375569",
          "34.04077071,-118.26444905",
          "34.04523018,-118.24971985"

      ]
  }
```

### Jobs

Next, we define the 10 delivery jobs in our problem statement. For each of these tasks, we add:

- A unique identifier
- Location index
- Delivery quantities
- A service time

Following is the JSON we use in this example:

```json
"jobs": [
  {
    "id": "Delivery 1",
    "location_index": 1,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 2",
    "location_index": 2,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 3",
    "location_index": 3,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 4",
    "location_index": 4,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 5",
    "location_index": 5,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 6",
    "location_index": 6,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 7",
    "location_index": 7,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 8",
    "location_index": 8,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 9",
    "location_index": 9,
    "delivery": [
      1
    ],
    "service": 120
  },
  {
    "id": "Delivery 10",
    "location_index": 10,
    "delivery": [
      1
    ],
    "service": 120
  }
]
```

### Routing Profiles

Next we set up the routing profiles for all types of vehicles in the fleet. As per our problem statement, we have to define 2 types of profiles - “car” and “minivan”.

The “car” type profile has a travel mode of car and needs to avoid highways. Whereas, the “minivan” type profile is of truck type and has specific weight and size dimensions. The “minivan” also needs to avoid tolls and should not make any left turns.

Following is the JSON script to configure these routing profiles:

```json
"options": {
       "routing": {
           "mode":"car",
           "traffic_timestamp":1724679300,
           "profiles": {
               "car": {
                   "mode": "car",
                   "avoid": [
                       "highway"
                   ]
               },
               "minivan": {
                   "mode": "truck",
                   "truck_weight": 10000,
                   "truck_size": "200,210,400",
                   "avoid": [
                       "toll",
                       "left_turn"
                   ]
               }
           }
       }
   }
```

Do observe that we have defined `routing.mode = car` and `routing.traffic_timestamp = 1724679300` outside `profiles` attribute. These routing properties apply to vehicles with default profiles i.e. vehicles which do not belong to any defined route profiles. Check the next section, to know how we define vehicles with default profiles.

### Vehicles

Now we configure each of the vehicles in the fleet and tag them to a routing profile defined earlier. To configure the van properties, we specify:

- A unique ID
- `start_index` & `end_index` to indicate the starting and ending locations of the route
- `capacity` indicating the storage capacity of the vehicle
- `profile` to tag the vehicle to the routing profile defined in the previous step

Once the vehicle and its properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
       {
           "id": "Vehicle_1_car",
           "start_index": 0,
           "end_index": 0,
           "capacity": [2],
           "profile": "car"
       },
       {
           "id": "Vehicle_2_minivan",
           "start_index": 0,
           "end_index": 0,
           "capacity": [6],
           "profile": "minivan"
       },
       {
           "id": "Vehicle_3_car",
           "start_index": 0,
           "end_index": 0,
           "capacity": [2],
           "profile": "car"
       },
       {
           "id": "Vehicle_4_default",
           "start_index": 0,
           "end_index": 0,
           "capacity": [2]
       }
   ]
```

Notice that for “Vehicle_4_default”, we haven’t specified any `profiles`. This vehicle is automatically assigned to the “default” profile and is subject to default routing properties. The default routing properties are defined as part of `options.routing` attribute and not as part of any `profiles`.

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>'
--header 'Content-Type: application/json'
--data '{
    "description": "Multiple Routing Profiles",
    "locations": {
        "id": 1,
        "location": [
            "34.02410429,-118.25503086",
            "34.04118314,-118.24377960",
            "34.05248264,-118.25345384",
            "34.04890945,-118.25881547",
            "34.04456349,-118.26277841",
            "34.03674018,-118.25811613",
            "34.03374589,-118.25333728",
            "34.02947273,-118.24628531",
            "34.04736425,-118.23375569",
            "34.04077071,-118.26444905",
            "34.04523018,-118.24971985"
        ]
    },
    "jobs": [
        {
            "id": "Delivery 1",
            "location_index": 1,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 2",
            "location_index": 2,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 3",
            "location_index": 3,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 4",
            "location_index": 4,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 5",
            "location_index": 5,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 6",
            "location_index": 6,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 7",
            "location_index": 7,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 8",
            "location_index": 8,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 9",
            "location_index": 9,
            "delivery": [
                1
            ],
            "service": 120
        },
        {
            "id": "Delivery 10",
            "location_index": 10,
            "delivery": [
                1
            ],
            "service": 120
        }
    ],
    "options": {
        "routing": {
            "mode":"car",
            "traffic_timestamp":1724679300,
            "profiles": {
                "car": {
                    "mode": "car",
                    "avoid": [
                        "highway"
                    ]
                },
                "minivan": {
                    "mode": "truck",
                    "truck_weight": 10000,
                    "truck_size": "200,210,400",
                    "avoid": [
                        "toll",
                        "left_turn"
                    ]
                }
            }
        }
    },
    "vehicles": [
        {
            "id": "Vehicle_1_car",
            "start_index": 0,
            "end_index": 0,
            "capacity": [2],
            "profile": "car"
        },
        {
            "id": "Vehicle_2_minivan",
            "start_index": 0,
            "end_index": 0,
            "capacity": [6],
            "profile": "minivan"
        },
        {
            "id": "Vehicle_3_car",
            "start_index": 0,
            "end_index": 0,
            "capacity": [2],
            "profile": "car"
        },
        {
            "id": "Vehicle_4_default",
            "start_index": 0,
            "end_index": 0,
            "capacity": [2]
        }
    ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "8c81e7e3bb9e0fb2217f862e986b9175",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=8c81e7e3bb9e0fb2217f862e986b9175&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Multiple Routing Profiles",
  "result": {
    "code": 0,
    "summary": {
      "cost": 3863,
      "routes": 3,
      "unassigned": 0,
      "setup": 0,
      "service": 1200,
      "duration": 3863,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [10],
      "pickup": [0],
      "distance": 25210
    },
    "routes": [
      {
        "vehicle": "Vehicle_2_minivan",
        "cost": 2299,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [6],
            "distance": 0,
            "snapped_location": [34.02418, -118.25498]
          },
          {
            "type": "job",
            "arrival": 720,
            "duration": 720,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04736425, -118.23375569],
            "location_index": 8,
            "id": "Delivery 8",
            "load": [5],
            "distance": 4412,
            "internal_id": 3723081941,
            "snapped_location": [34.04735, -118.2339]
          },
          {
            "type": "job",
            "arrival": 1286,
            "duration": 1166,
            "service": 120,
            "waiting_time": 0,
            "location": [34.05248264, -118.25345384],
            "location_index": 2,
            "id": "Delivery 2",
            "load": [4],
            "distance": 9047,
            "internal_id": 3823747655,
            "snapped_location": [34.05248, -118.25344]
          },
          {
            "type": "job",
            "arrival": 1624,
            "duration": 1384,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04890945, -118.25881547],
            "location_index": 3,
            "id": "Delivery 3",
            "load": [3],
            "distance": 10082,
            "internal_id": 3806970036,
            "snapped_location": [34.0488, -118.25892]
          },
          {
            "type": "job",
            "arrival": 1881,
            "duration": 1521,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04456349, -118.26277841],
            "location_index": 4,
            "id": "Delivery 4",
            "load": [2],
            "distance": 10691,
            "internal_id": 3790192417,
            "snapped_location": [34.04449, -118.26266]
          },
          {
            "type": "job",
            "arrival": 2245,
            "duration": 1765,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04077071, -118.26444905],
            "location_index": 9,
            "id": "Delivery 9",
            "load": [1],
            "distance": 11891,
            "internal_id": 3706304322,
            "snapped_location": [34.04076, -118.26443]
          },
          {
            "type": "job",
            "arrival": 2504,
            "duration": 1904,
            "service": 120,
            "waiting_time": 0,
            "location": [34.03674018, -118.25811613],
            "location_index": 5,
            "id": "Delivery 5",
            "load": [0],
            "distance": 12633,
            "internal_id": 3773414798,
            "snapped_location": [34.03679, -118.25807]
          },
          {
            "type": "end",
            "arrival": 3019,
            "duration": 2299,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [0],
            "distance": 14918,
            "snapped_location": [34.02418, -118.25498]
          }
        ],
        "service": 720,
        "duration": 2299,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [6],
        "pickup": [0],
        "distance": 14918,
        "geometry": "ejtnErtwpUm@dBq@pBYv@??_@fA?@kDzJ??MG??iAo@A?GE??c@Uo@][S_Ai@??OI??GE??]Qa@UYQ??IGQK??e@WSMMIy@e@??gAm@c@W]S??GE??SMOISK]S??EEA?]U??OKA?]SWQ??aAi@??]Uq@a@??k@]iAq@??uBoA?Ai@Y??UOWO?A_@S??_@U?AIE??UO]S_B_A??sAaAmCiB]Uo@c@??y@e@QM{@i@A?UO[UOK??UWw@}@_AcAWY??m@s@?Ae@e@QS??MM_@_@?AaAeA??SS??m@o@o@s@A?SSMO??[[g@i@_@a@??SUAAiBmB??}@aASUA?MM??e@g@WYQSSS??uAyAA?k@m@WWc@a@OIa@WA?_@WyAaA}DeCOI??YQA?_@Om@[AAYOgAi@eAc@u@[?A[K[Mi@S_@MME??YG??YE[E??]G[Ic@KA?a@K??y@U??WIA?yCy@m@Q??SIMC?AQG??aA[??KEc@U??YOMKOK??eA{@UUMK??JS??JELO?Ai@xA{B??d@w@??Ve@FM@OBGDODSHKDk@?AHy@EMFe@??@UBYNQ?A?ADa@??HsAB_@F{@HeA??Fy@HsABY??JuAHmA??HiAFcAB]l@?X?hA?x@?b@A??@rA???fD?f@???X???b@??@xA??A`E???dA?X@hBm@De@?QKa@A??W@??Q???Q@??UCuC@w@Dq@AK?gBC[?A?o@?UDWAgAA??k@n@UV??MN??UX??SXA?q@|@}ArBaBzBOR??QT??Y??g@l@??e@c@UQa@a@??MKKK??KK??EEECCMAC?AAAGGc@a@??WQ??_@[MMEEMMYWSQ??_@[??IGUS[S??[U??CK?AAAAAAAEECCCCAEAEAEAC?E?GBQ??BI@?DIHKLIFCBA??J?J?H?B@D@F@??BBDFHJDJ@JBV?H?@AVQx@?@EVEPGX??Kj@Ol@GT?@Wz@CD{@`B_@p@QA@GNMPGLiArB??CDUd@CDS^EHCFGJKRWd@Ub@]n@m@bAa@r@]h@]h@A@MPq@~@??m@j@a@h@ONe@d@??EHEDOPw@n@s@n@iAz@QRkA~@e@^[V??e@Xm@`@??KJ_AbAs@r@SPKLGF??OXKVELGRIXAB?D?F?H?@?@@F??@L?RBJ@PBL@?HXJTJNHHb@`@RN|@n@?@HF??p@t@??`BdBl@l@BBzAjAlAbBr@|@`@h@LNl@r@bAjA??HH??FF@@^l@r@dAVZ@@?@t@`ATX?@PTJNDDDF??LLb@l@l@r@??b@~@??DFp@x@b@r@??BF??DFb@NNRP`@VPTJNB??PBTAN???LCFCRGTM??JE??DALEPILEJA??FE??NMHGNMVWTYR]P_@R_@HO??d@u@??Zk@dAmANU??hB{B?Aj@gAKc@MMII??QOPNHH??LLJb@VPPP@?n@n@FDDDD@B@B@DAHCT_@fAmBd@y@d@^??PN??`@^h@d@??n@j@??RRfAdAZZ@@x@x@RPl@f@??dCrBLLn@j@??d@b@@?v@n@??CDGBc@t@S^AJi@~@_@j@a@l@m@jAQZc@|@EFS^R_@fBxA?@VR@@FFRP`@`@VT??jAhAfDvC??TRbB~A^d@`@??PPr@l@^Zp@r@TP??NNDB@@NL@?GJ??GBKPKVA?ELIPOXELKR??IP??KXAF@J??IZ??_A{@_@a@A?c@e@QQ??[[WUk@g@?I@U@s@???K?G@S@MFMP[b@{@NW??DG??bCoE??b@^?@tDfDf@d@??BBRRFDXV@@zAxADB??NP??b@^??XNNZV^??fB~A??^Z??VVFFHHNL??HHRRZX??JHKIx@}AHMP]^o@R]Ta@??P[@?Zo@l@iA??P]??n@eA??Xe@??dAgB??nBuD`@u@Va@??^q@??Zg@??~@kB@?`AgB??Zo@^o@??|@gB??bAeB??`AeBb@q@BGR[??PYHMf@}@??p@mA??JQ`AiBb@u@?AXg@bAiBz@mBh@sA??z@yBvAuDX_Ar@}B??n@qBv@kCdAkD??tA`A??tAz@??n@^??f@XtA`ArAfA??vAhA??lEhDd@^f@f@JH??VTXT@?TP??nBzAzAlA??l@h@JJg@zAMVO^KMZ??NX??NTPL??JF??FDLF??FDp@h@Z@?xAv@@?xA|@Qd@",
        "internal_id": 3908779753,
        "profile": "minivan",
        "adopted_capacity": [6]
      },
      {
        "vehicle": "Vehicle_4_default",
        "cost": 551,
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
            "snapped_location": [34.02418, -118.25498]
          },
          {
            "type": "job",
            "arrival": 230,
            "duration": 230,
            "service": 120,
            "waiting_time": 0,
            "location": [34.03374589, -118.25333728],
            "location_index": 6,
            "id": "Delivery 6",
            "load": [1],
            "distance": 1384,
            "internal_id": 3756637179,
            "snapped_location": [34.03372, -118.25333]
          },
          {
            "type": "job",
            "arrival": 482,
            "duration": 362,
            "service": 120,
            "waiting_time": 0,
            "location": [34.02947273, -118.24628531],
            "location_index": 7,
            "id": "Delivery 7",
            "load": [0],
            "distance": 2306,
            "internal_id": 3739859560,
            "snapped_location": [34.02946, -118.24628]
          },
          {
            "type": "end",
            "arrival": 791,
            "duration": 551,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [0],
            "distance": 3555,
            "snapped_location": [34.02418, -118.25498]
          }
        ],
        "service": 240,
        "duration": 551,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [0],
        "distance": 3555,
        "geometry": "ejtnErtwpUm@dBq@pBYv@??_@fA?@kDzJ??MG??iAo@A?GE??c@Uo@][S_Ai@??OI??GE??]Qa@UYQ??IGQK??e@WSMMIy@e@??gAm@c@W]S??GE??SMOISK]S??EEA?]U??OKA?]SWQ??aAi@??]Uq@a@??k@]iAq@??uBoA?Ai@Y??UOWO?A_@S??_@U?AIE??UO]S_B_A??~A~@??RTNHD??^V??P[Pg@??Pi@iA??b@wAjAiDv@cCt@{BPg@??gAjAqDZeAX{@??vCcJFQ?AHY??FSXw@?AXV??rAnA??fAbA@?h@h@??j@h@??jAhA??f@b@??XXHH??f@d@??r@p@p@j@NNd@b@JH??RPBBPNZT??XTFFFF??l@j@??VV??TPRRhA`A??^XNN??`@^`@@@RRRP@@LJ?@VTj@f@n@h@??x@t@PN??s@vB??Wv@??kD|J?@Qd@",
        "internal_id": 1700845722,
        "profile": "default",
        "adopted_capacity": [2]
      },
      {
        "vehicle": "Vehicle_3_car",
        "cost": 1013,
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
            "arrival": 509,
            "duration": 509,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04523018, -118.24971985],
            "location_index": 10,
            "id": "Delivery 10",
            "load": [1],
            "distance": 3133,
            "internal_id": 1174366558,
            "snapped_location": [34.04517, -118.24979]
          },
          {
            "type": "job",
            "arrival": 742,
            "duration": 622,
            "service": 120,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 1,
            "id": "Delivery 1",
            "load": [0],
            "distance": 3865,
            "internal_id": 3840525274,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "end",
            "arrival": 1253,
            "duration": 1013,
            "service": 0,
            "waiting_time": 0,
            "location": [34.02410429, -118.25503086],
            "location_index": 0,
            "load": [0],
            "distance": 6737,
            "snapped_location": [34.02419, -118.25498]
          }
        ],
        "service": 240,
        "duration": 1013,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [0],
        "distance": 6737,
        "geometry": "ejtnErtwpUPe@yA}@{Aw@k@[q@]GEMGGEKGQMOSO[Sj@IVWr@cAnC_AjCi@rAk@zAQd@M^c@lAWr@IGQKe@WSMMIy@e@gAm@c@W]SGESMOISK]SGE]UQK]SWQaAi@]Us@a@i@]iAq@uBqAi@YUOWO_@U_@UIGUO]S_B_AsAaAmCiB]Uo@c@y@e@QM}@i@UO[UOKUWw@}@_AcAWYm@u@e@e@QSMM_@a@aAeASSm@o@k@Nc@NYJGB[Lk@p@s@x@wA`BkAjAg@j@SVw@x@[UVST_@`@UVe@l@gAhAMJgAdAQJk@gAQYQ[IOKOk@cA_@q@KOIQ]k@sA_Bc@i@gBgBo@o@T]PY`BiC`@}@f@}@LYh@aA|AqC~BeExAmCVg@Xg@`@w@p@qA|AwCRPSQXg@dAsBl@iAl@iANYjAwBr@sAd@}@HO`@y@^u@pABL@zAJLBRBJDNHhAjAp@r@HHFDHFLHZRJFz@h@TN~@n@nAv@d@Zh@Z^Tn@ZPJJDXPLFRJ~@b@t@^j@Th@Xh@TTLr@b@R^Rh@Vf@Rb@P^PVLd@Tl@ZzBfA`@VNHTPJHXXbA|@XXXVrAnAhAbAh@h@j@h@jAhAf@b@XXHHf@d@r@p@p@j@NNd@b@JHRPBBPNZTVTHFFFl@j@VVTPRRhA`A^XNN`@^b@^RRTRLLVTj@f@n@h@x@t@PNs@vBWv@kD~JQd@",
        "internal_id": 3641880380,
        "profile": "car",
        "adopted_capacity": [2]
      }
    ],
    "routing_profiles": {
      "car": {
        "mode": "car",
        "avoid": ["highway"]
      },
      "default": {
        "traffic_timestamp": 1724679300,
        "mode": "car"
      },
      "minivan": {
        "truck_size": "200,210,400",
        "truck_weight": 10000,
        "mode": "truck",
        "avoid": ["toll", "left_turn"]
      }
    }
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![Sample route plan for multiple vehicle profiles](https://static.nextbillion.io/docs-next/docs/route-optimization/multiple-routing-profile.webp)

_Route Plan for different routing profiles_

## Analyzing the Solution

Looking at the result we can observe that:

- All 3 vehicles were used to fulfill all the tasks.
- One “car” type and a “default” type vehicle was used for 2 deliveries each, while the “minivan” type vehicle was used for remaining 6 deliveries.
- We can see the “minivan” takes a route (blue route in the image representation) which always avoids left turns as defined by its routing profile.
- The solution also returns the details of all the profiles - namely “car”, “minivan” and “default” - used while generating the solution.

The above example exhibits how NextBillion.ai’s Route Optimization API allows making use of multiple routing profiles to generate most efficient routes for a fleet with a variety of vehicle types. We encourage you to go ahead and try out different configurations of profiles, number of tasks / vehicles and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the [other powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
