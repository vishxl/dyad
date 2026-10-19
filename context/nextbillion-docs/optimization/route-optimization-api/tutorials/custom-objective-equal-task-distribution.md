# Custom Objective Equal Task Distribution

Custom Objective is a valuable feature that empowers users to pursue unique objectives which are significantly different from the typical approach of minimizing travel costs. This feature allows users to tune the optimization algorithm to achieve following objectives:

- Minimize the number of vehicles used in the solution

- Minimize the time taken to complete all the tasks

- Distribute tasks equally among all the routes

- Distribute `travel_cost` equally among all the routes

The above objectives can be used in conjunction with other constraints of vehicle costs, task time window constraints, re-optimization and other features that are offered by Route Optimization Flexible API.

In this example, we are going to cover the equal task distribution objective. The Custom Objective feature proves highly effective in addressing optimization challenges, especially in business scenarios having a critical need to ensure equal distribution of workload - either in terms of the number of tasks or the travel cost - among all routes. This feature helps in addressing challenges like optimizing resource utilization, better workforce management, better vehicle availability among other benefits.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please [contact us](mailto:support@nextbillion.ai) to get your API key now!

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### Jobs & Shipments

We start by defining 16 jobs. For these jobs we:

Add a unique identifier for each task Provide location indexes for each task Specify the schedule of tasks. This is done by adding time windows within which a task must be completed. Here we have considered the same time window for all tasks for the sake of simplicity, but Route Optimization Flexible API can handle tighter time windows easily. Configure the actual time taken to complete the tasks once the driver/vehicle is at the task’s location i.e. the service time for each task.

Let’s take a look at the `jobs` JSON after the above properties are configured:

```json
  "jobs": [
    {
      "id": 1,
      "location_index": 0,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 2,
      "location_index": 1,
      "service": 180,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 3,
      "location_index": 2,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 4,
      "location_index": 3,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 5,
      "location_index": 4,
      "service": 60,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 6,
      "location_index": 5,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 7,
      "location_index": 6,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 8,
      "location_index": 7,
      "service": 150,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 9,
      "location_index": 8,
      "service": 80,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 10,
      "location_index": 9,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 11,
      "location_index": 10,
      "service": 90,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 12,
      "location_index": 11,
      "service": 60,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 13,
      "location_index": 12,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 14,
      "location_index": 13,
      "service": 150,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 15,
      "location_index": 14,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    },
    {
      "id": 16,
      "location_index": 15,
      "service": 120,
      "time_windows": [
        [
          1693386000,
          1693393200
        ]
      ]
    }
  ]
```

### Vehicles

Next, we add 2 vehicles that are going to fulfill the tasks. To describe the vehicles and their properties we add: A unique ID for each vehicle

- Vehicle shift time or the time window

- Start_index to denote the point from where the vehicle would start.

- Costs for all vehicles.

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
  "vehicles": [
    {
      "id": 1,
      "start_index": 16,
      "costs": {
        "fixed": 1000
      },
      "time_window": [
        1693385100,
        1693397700
      ]
    },
    {
      "id": 2,
      "start_index": 17,
      "costs": {
        "fixed": 2000
      },
      "time_window": [
        1693385100,
        1693397700
      ]
    }
  ]
```

### Locations

And lastly, we define the `locations` object by adding all the locations used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
{
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
      "33.940407,-118.265196"
    ]
  }
}
```

Now that we have built the fundamental attributes of a request, readers are encouraged to submit a request containing the above components and analyze the solution returned under default settings. Most likely there will be 2 routes returned with 1 route having decidedly more tasks than the other.

### Options

Moving forward we incorporate our objective of equal task distribution, into the request by using the `objective` attribute. We set:

- `type` as `min-max` to indicate that we want to invoke the equal distribution algorithm.

- `value` as `tasks` to indicate that we want to apply the algorithm on the number of tasks metric.

The resulting `objective` attribute JSON is:

```json
{
  "options": {
    "objective": {
      "custom": {
        "type": "min-max",
        "value": "tasks"
      }
    }
  }
}
```

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Custom Objective (task distribution) Example",
   "jobs": [
       {
           "id": 1,
           "location_index":0,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 2,
           "location_index": 1,
           "service": 180,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 3,
           "location_index": 2,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 4,
           "location_index": 3,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 5,
           "location_index": 4,
           "service": 60,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 6,
           "location_index": 5,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 7,
           "location_index": 6,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 8,
           "location_index": 7,
           "service": 150,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 9,
           "location_index": 8,
           "service": 80,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 10,
           "location_index": 9,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 11,
           "location_index": 10,
           "service": 90,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 12,
           "location_index": 11,
           "service": 60,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 13,
           "location_index": 12,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 14,
           "location_index": 13,
           "service": 150,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 15,
           "location_index": 14,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       },
       {
           "id": 16,
           "location_index": 15,
           "service": 120,
           "time_windows": [
               [
                   1693386000,
                   1693393200
               ]
           ]
       }
   ],
   "vehicles": [
       {
           "id": 1,
           "start_index": 16,
           "costs":{
               "fixed":1000
            },
           "time_window": [
                1693385100,
                1693397700
           ]
       },
       {
           "id": 2,
           "start_index": 17,
           "costs":{
               "fixed":2000
            },
           "time_window": [
                1693385100,
                1693397700
           ]
       }
   ],
    "locations":
        {
            "id": 1,
            "location": ["34.083950,-118.318640", "34.054927,-118.323726","34.075525,-118.361588","34.076350,-118.338519","34.090425,-118.338933","34.037925,-118.459842","34.004364,-118.421170", "34.000215,-118.318803","33.945884,-118.325628","34.000895,-118.204929", "34.076646,-118.376969","34.094986,-118.300885","34.018780,-118.317919","33.996658,-118.261708", "33.916595,-118.240132", "33.946275,-118.385486","34.057106,-118.361326","33.940407,-118.265196"]
        },
    "options":
        {
            "objective": {
                "custom": {
                    "type": "min-max",
                    "value": "tasks"
                }
            }
        }
}
'
```

## Optimization POST Response

Once the request is successfully submitted, we get a unique ID in the API response:

```json
{
  "id": "682b0756abb75427be030457db66ee5e",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=682b0756abb75427be030457db66ee5e
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Custom Objective (task distribution) Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 14061,
      "routes": 2,
      "unassigned": 0,
      "setup": 0,
      "service": 1850,
      "duration": 11061,
      "waiting_time": 0,
      "priority": 0,
      "distance": 101643.7
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 5831,
        "steps": [
          {
            "type": "start",
            "arrival": 1693385396,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.057106, -118.361326],
            "location_index": 16
          },
          {
            "type": "job",
            "arrival": 1693386000,
            "duration": 604,
            "service": 90,
            "waiting_time": 0,
            "location": [34.076646, -118.376969],
            "location_index": 10,
            "id": 11
          },
          {
            "type": "job",
            "arrival": 1693386376,
            "duration": 890,
            "service": 120,
            "waiting_time": 0,
            "location": [34.075525, -118.361588],
            "location_index": 2,
            "id": 3
          },
          {
            "type": "job",
            "arrival": 1693386861,
            "duration": 1255,
            "service": 120,
            "waiting_time": 0,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "id": 4
          },
          {
            "type": "job",
            "arrival": 1693387247,
            "duration": 1521,
            "service": 60,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "id": 5
          },
          {
            "type": "job",
            "arrival": 1693387922,
            "duration": 2136,
            "service": 60,
            "waiting_time": 0,
            "location": [34.094986, -118.300885],
            "location_index": 11,
            "id": 12
          },
          {
            "type": "job",
            "arrival": 1693388485,
            "duration": 2639,
            "service": 120,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "id": 1
          },
          {
            "type": "job",
            "arrival": 1693389225,
            "duration": 3259,
            "service": 180,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 1,
            "id": 2
          },
          {
            "type": "job",
            "arrival": 1693390977,
            "duration": 4831,
            "service": 120,
            "waiting_time": 0,
            "location": [34.000895, -118.204929],
            "location_index": 9,
            "id": 10
          },
          {
            "type": "end",
            "arrival": 1693391097,
            "duration": 4831,
            "service": 0,
            "waiting_time": 0,
            "location": [34.000895, -118.204929],
            "location_index": 9
          }
        ],
        "service": 870,
        "duration": 4831,
        "waiting_time": 0,
        "priority": 0,
        "distance": 42179.5,
        "geometry": "ywznEjmlqUBG@G@GAEEEMIw@[q@WIbAEd@Ir@ADEf@S|BO`BEVCRE^Ef@CVAXi@SYKa@OQZuA~BEFq@jAiBzCgAjB]l@KPo@bAQZYd@]j@MTU^S\\[f@[l@{CdF[f@a@p@ILOXSZs@lAc@v@OVILIN[f@OTW`@a@h@GHi@n@_@b@YXOPOJOJ]TUJe@T_@RYNc@TYNULwBhAc@ReAj@i@X}@b@m@ZyBjAWN[PSHy@b@QH[Lk@TcA^_@Pa@Vu@`@]RWNaAl@}@@aA@s@BG?I?QLQ?i@?Q@K?Q?I?i@?K?_@A_@AK?K?]@I?Q?M?E?I?A?{@@K@kBBK?O?O@{@Bk@@_@@M@I@?~@AZA^?VA\\EN?N?VALAHAVERBRENe@fBQIGCKGKG?{@BgC?aB?g@AiAP@v@ALAVA?q@AI?O?k@?W?Q?G?_@?M?a@?]?m@?y@?Y?K?W?[?a@?u@?e@?m@?e@?k@?q@?i@?a@?c@Aa@?i@?e@?cA?]?c@Aa@?g@?y@?k@?k@?}@?g@?]?]?e@?m@Ae@?o@?_@Ag@@k@Ag@?w@?a@?_@?S?SAS@Y?c@Au@?m@?aA?S?I?a@?i@?e@?o@?i@?o@?c@?k@Ao@?O?U?o@?e@?e@?[?S?U?O?Y?[?M?o@t@?\\?T?F?G?U?]?u@??kA?W?_@AS?S?c@?U?M?qA?i@?a@?]AQ?g@?mAAi@?c@?gA?i@?S?_@?sA?g@?c@?m@?y@?c@?Y?MAY?g@?]?[?i@?u@?_@?]?_@?}@?c@?_@Am@?g@?}@?g@?UAa@?a@?e@?c@?qA?a@@i@?oA?U?g@?g@?a@?c@?eA?g@?e@?M?c@?k@?yA?c@?k@?]?_@?gA?e@AaA@a@Aa@?y@?e@?s@?a@?c@?Y?e@?M?w@?q@?u@?w@?U?e@Ao@@yEAgB?}@?o@?s@?uB?o@?m@?a@Ac@?m@?q@?Ya@?M?Q?{B?iF@iDAY?gEBAkA?YA}B}H?eC@sD@?x@?f@?T?b@@`Ai@?{@?[?m@?cB?G?E?QLw@?sA@S?M?W?oA?U?W?aA?]?c@?y@?[?eB?W?S?i@?s@?oA?U?M?eA?U?q@@Y@U?M?i@??}@?s@?{@?A?y@Au@?_@?{@?c@?q@?o@?WAiA?s@?uA?_@?cA@yD?s@?m@?sA?K?mA?kA?]?YA_@?s@?mA?q@Ae@?u@?gA?O?i@?WAu@?{@?e@?mA?s@?i@?w@?c@@qA?_A?]?e@?aA?M?mA?MAeC?yE?}@?_A?c@?w@?o@?_@?c@?S?S?Q?O?W?u@?iA?m@@m@AoB?q@?s@?m@?{@?m@?eAmD@a@?aD@a@?eC?}@?A{C?cAAwEaE@?q@?cB?yB?eBA{@?u@?_@?}BAaC?_A?SCq@AQCa@CSCYCWEq@?Q?OAO@C?I?M?]?M?m@@w@Aw@?g@Ca@IuHAg@EeBAmAC_A?e@EuCAcACkCC_BCcCAs@CyAAeAAc@A_@Ac@@b@@^@b@@dABxA@r@BbCB~ABjC@bAfEAZA@zD?L?fFC`JAbACv@J?L?J?L?X?X?z@?T?Z?V?\\A^?N?L?nA?X?`@?V?Z?dA?n@?v@?RAR?Z?xBCjAA^?dB?bB?^?n@?d@?pCA`@?V?\\?l@?Z?^?Z?V?jB?V?^?N?H?x@?F?N?fA?h@A?t@?`A?\\?TAl@?J@d@?R?j@?lA?d@?d@?T?pA?`@?f@?T?R?x@?T@x@?b@?p@?x@?X?pA?xA?X?d@?^?b@?n@?j@?\\?hC?\\?zA_B@A`@@B?@?@?@DDBB@@@B?P?R?N?b@?d@?J?K?e@?c@?O?S?QACAACCEE?A?A?AAC@a@~AA?r@nJCxO?`B?|B?xEAhB??y@?uA`AAdJ?vEAzJ?zJAt@??f@?t@?|B@~@dA?`D?zAAd@?hJ?R?l@?lC?lB?l@?AfAAb@AxAAzAh@?jD?ZAP?P?bA?L??|@B@B?dAb@LDjJjEpFbCb@RJFFB@@BFBD?F?L?LbF|Bf@RzGbDTJVHRHDo@D}@BS_@C^B@U@SB]@IBQHa@H_@BM^uADSDQRu@Lk@FSPs@FS`@}Ah@mBJ_@\\oANi@VaA^wA`@gBH_@ViAf@P`@N^LlCdAz@\\RFPFNFz@b@h@PtBt@fJzCz@Xl@RPDPFNDPBT@L?J?rC?jA?~@A~IAXAlD@nD?AiE?sGvD?hA?F?d@?`@?j@?P?T?p@?P?J?R?r@AjD?R?j@?P?JHd@@T?n@AT@f@@J?XAH?N?\\??EAE?C?CSeCQuBOwBCWKwAKaBMqAAe@CkBCq@GkDAuBAuACWAa@AyBAaBAeBCa@CKES?_@Ac@?u@@yCDwM?eB?U?U@yE@uC@}ABqE@}A?w@?y@?_@B_C?g@@}BBsD?oA?a@?a@@_@?aA?q@@_B@oD@mC?[@sABmL@cCBsK?G@k@?qA@gC?}DAcAAoA?QCe@Cu@CYCk@Ck@I_AKqAEa@Gk@MeAMcAOmACSG]Gm@AGGc@Ea@Gi@OsAKmACWAIKeBG}@Ek@AYEm@?GAWAUG{AAy@OmICeA?WCyBCmB?_@?_@?Y?W?W@Q@Q?QBQ@SDk@DYBUBUFWHc@F_@Le@Jc@L]HSBKDMHQHQXq@d@aAJQx@wAf@y@PWNWh@{@\\m@HMLOLWR[`@o@hBeDHMFMNWJWr@{AFKZq@JSl@qAZs@n@wAP]p@wAd@eATg@Te@NY\\w@Vg@Te@FQJUJWFOXw@^aADOTu@XgA\\sA`@oBl@_DFWLk@DWLg@VgAH_@HYDMHYDSJ]HUNi@Nc@L]Pg@BMPc@L[^aA`@eAP_@Rc@n@{AvAaDv@eBp@{AlAqC\\u@^}@Rc@HQh@oAf@iATc@b@aAr@{AXs@\\w@Xo@f@kAr@}AfEqJHQRe@Ri@JWTu@Pq@Ry@Ny@Ny@Fg@BQJ{@Fy@?EDu@Bu@@S@_@Am@?]AYASCk@Ae@G{@Iw@K{@Q_AG]G[EMESUw@Uw@Uq@Wy@EQIWOc@Ma@g@_BOk@GQY}@aA}Ca@qAa@yASm@Ss@_@oA_@gACMK[M_@{@qCQo@q@oB]kAa@oAK[g@eBc@{A[wA]_BMo@Km@Kk@Gg@M_AE_@Ea@CWe@gFI_ACUEm@I{@Gk@E_@CYCSE_@Gq@ASEYAIAIEi@Gk@C_@IsACm@Eq@Au@AgA@m@?U@Q?[Be@@m@Be@B_ABg@B{@DqAJaD?KDkA@o@@G@]?KD{A@[@a@?W@gA@s@AaALyB?U@cA@w@BeADe@?EFk@Hg@Ha@Ja@J[DMt@sBPe@rAaENc@Zu@H]Jc@Ry@DOBKJc@HWRy@`@sAVy@@G^gAJc@DYFg@Fm@`@qA^gAv@mCH[DQJ_@H_@Le@n@eCVkAT}@DKXeAZ_A\\_ARq@v@aCDMDMJ[Pi@Nc@Pi@Ne@Ro@HQHWPg@Le@^gANc@Ne@HUXy@J]La@FQNe@Pg@Ne@Pg@Na@Ts@FQBIFQRo@L]Ts@Pg@L_@L_@Vy@Pg@d@}A\\gAL_@HUL_@HUNg@FUJ_@HYRaADWDQHi@Hg@F[NoAJ_ABYJsA@]FqABq@?iB?qA?kB?y@?mA?}D?Q?O?M?_@@iC?eBAiAAmGAyD?S?s@AoA@s@?C?G@e@@]@_@Be@Ba@Da@B_@De@DYDa@DYHk@Jo@Fc@Jc@BOBKLi@Pq@HYPm@V}@\\cAHUZq@HQBGN_@b@}@l@oATc@Xo@BCh@mA\\{@Zs@LYPc@FKZy@j@{@NWFKJOLSv@uADG\\k@PWLUR[HOLMJOLOJKNOFGROJILGPKJGRIJENETGNEVGNCJARCNAhBWpFGJ?f@?\\?lAA`B?N?L?l@AT?lA?X?Z?V?l@?T?p@A^?nA@bA@hB@rAHhAFzAJz@DdCXRDhBVb@H^HJBv@RpBf@|Ad@d@Nv@XrAf@LDVLd@Pl@VXL`@RNFNJRHFFHB`@Rt@b@h@XbAnAdAt@dAp@r@d@v@j@j@f@FFHJRd@DLFZHj@J`@?DDTDRFNHLHJJFLFNDZ@n@DXBPFNFNHLLJLBBFLnAjDb@jAJZVx@@DNj@DN?@BDRN^`ADLJTHNFJJLRTh@f@`@XbAr@LHvA`AVVLJVRZr@@FBJ?PANGp@]t@S`@MVKPMXWh@Ud@OXOXCFS`@iDzGKRc@`Ak@fAsBfEWf@QZKRo@pAoB~DQZi@fA[n@_@t@GJSb@[n@eAtBELCHABAHAHATCf@E|@Eh@EjACVA\\K~BEp@A\\ALKhBMjCC\\AVKlBEfAMrCC`@Cb@KnB?JEx@AREn@Ct@En@Ab@En@KfBATALATObCKtBYhE?LAL?LB|@Hz@Bh@@\\@b@?@@pA?`@@|A?R?b@?\\@rA@TmBB[?A?e@ACA?AEaDCuA?K?kCBGHGPAVK??"
      },
      {
        "vehicle": 2,
        "cost": 8230,
        "steps": [
          {
            "type": "start",
            "arrival": 1693385441,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.940407, -118.265196],
            "location_index": 17
          },
          {
            "type": "job",
            "arrival": 1693386000,
            "duration": 559,
            "service": 120,
            "waiting_time": 0,
            "location": [33.916595, -118.240132],
            "location_index": 14,
            "id": 15
          },
          {
            "type": "job",
            "arrival": 1693387192,
            "duration": 1631,
            "service": 150,
            "waiting_time": 0,
            "location": [33.996658, -118.261708],
            "location_index": 13,
            "id": 14
          },
          {
            "type": "job",
            "arrival": 1693388361,
            "duration": 2650,
            "service": 120,
            "waiting_time": 0,
            "location": [34.01878, -118.317919],
            "location_index": 12,
            "id": 13
          },
          {
            "type": "job",
            "arrival": 1693388753,
            "duration": 2922,
            "service": 150,
            "waiting_time": 0,
            "location": [34.000215, -118.318803],
            "location_index": 7,
            "id": 8
          },
          {
            "type": "job",
            "arrival": 1693389644,
            "duration": 3663,
            "service": 80,
            "waiting_time": 0,
            "location": [33.945884, -118.325628],
            "location_index": 8,
            "id": 9
          },
          {
            "type": "job",
            "arrival": 1693390605,
            "duration": 4544,
            "service": 120,
            "waiting_time": 0,
            "location": [33.946275, -118.385486],
            "location_index": 15,
            "id": 16
          },
          {
            "type": "job",
            "arrival": 1693391781,
            "duration": 5600,
            "service": 120,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 6,
            "id": 7
          },
          {
            "type": "job",
            "arrival": 1693392531,
            "duration": 6230,
            "service": 120,
            "waiting_time": 0,
            "location": [34.037925, -118.459842],
            "location_index": 5,
            "id": 6
          },
          {
            "type": "end",
            "arrival": 1693392651,
            "duration": 6230,
            "service": 0,
            "waiting_time": 0,
            "location": [34.037925, -118.459842],
            "location_index": 5
          }
        ],
        "service": 980,
        "duration": 6230,
        "waiting_time": 0,
        "priority": 0,
        "distance": 59464.2,
        "geometry": "q~cnEftypUr@?hD@xA?h@?X?PAJ?N?h@?^?dB?X?lA?rA?|C?x@?nB?jA?X?jA@`A@B?zBAbB?`@?ZAf@?b@?R@d@?^?d@?L?@kB?W?k@?c@?w@?y@@mEAiA@cADeF?m@@yA@yE?G?IBO@OBINk@JSJSf@s@~@qAf@q@b@m@d@s@BGDIBG@GDO@M@GD[?M?G@g@@qD?[?W?M?_A?K?K?O?cA?C?[?cA?W?q@?_@?e@?aA?Q?u@?iH?e@?_A?m@@uAAyA?S?{A?cA?k@AwC?kCF?nA?J?H?J?J?P?H?N?F?n@Ap@?J?v@?dA@J?bB?x@?tB@lA?hA?f@?t@@x@?P?V?vA?d@?hAEf@?^AV?b@?|@ArCC|BClA?L?T?n@@B?f@@l@?h@?p@?dC?rB?`B?V?t@?hA?T?h@@R??w@?]?]?_@?_@?Y?S?U?iF?q@?sA?uA?w@?cD?oB?{@?o@?W?m@O?[HWF?@?AVGZIN??l@?V?n@?z@?nB?bD?v@?tA?rA?p@?hF?T?R?X?^?^?\\?\\?v@S?i@AU?iA?u@?W?aB?sB?eC?q@?i@?m@?g@AC?o@AU?M?mA?}BBsCB}@@c@?W?_@@g@?iADe@?wA?W?Q?y@?u@Ag@?iA?mA?uBAy@?cB?K?eAAw@?K?q@?o@@G?O?I?Q?K?K?I?K?oA?G??cAAsBAsAAcB?u@?k@AsA?o@?m@@iABgD@oDA}@CsAA_@AwA?{@@[?K@ODgAB_@Bg@Dy@@_@DiAFsB@]FiA@QLiDBg@@e@BeABk@?UB}@BkA?QTBPBPFNFJJHJFLDN@F@H@T?H?TB~CALB|B?b@@j@?\\@n@ApA@tAD~@?HA`@AVAr@AZAZ?LAf@ANAZ?RAl@A`@Ch@GvBEjAChAIbDIhDK~DC`ACz@?HAn@E`CEpACpAAd@?n@AzAAx@?l@@j@@f@@p@@\\?\\@^@\\D`ABx@Dn@Dn@HpA^lFF`ANlBNtB?LBVBZHzADh@@P@N@LLzBJpAL|ANzBLzAJh@Nz@@ZDh@Bd@B|@Br@Bx@Bp@@~@?`A@|A?tD?`B?DAbB?tJ?fF?vB?vB@vA?p@?N?jCB^BX@dA?nBAl@?r@At@CjAEpAEv@Cj@OxBAFGz@OvAAR_@nCSxACXm@fFIn@Iz@KtAKbBMrCGrAIpAA^Gf@Mn@Mf@Wt@Q\\CFCFEF[d@c@d@URGDSLKFSJ[LeAZWDQ@Q@U@[?OAe@AeBIe@A_@Cg@@iCMsBK{@Ew@EkAGoAGsDOmCIgEGo@?{AA]My@BcGB}C@k@?eDBM@yA@e@?aA?{AA_A?W?yAGaBKqBMUCOAI?cBMgCQq@C_@CK?C?K?UA[?m@?k@@y@@Q@{@F}@Hk@Ho@HcALkALcBTwFp@iD`@MBsBVyBVk@FiAFaADE?aA@G@o@AY@sEE[?kDC{KEQ?W?W?Y?qB@mE@}GDy@?{@@y@?cA?oCBM?qGBU?{E?wA?sA?C?a@?oAOk@IyF?S?cD?M?I?e@?{B?kJ?e@?U?qN?{BAmB?aA@q@?k@Au@?K?C?oA@uAC_BCoBI_DOWCe@AWCqBIK?uBEoDEM?a@AmBAi@?k@AI?yAUYC}@E}@Gw@CWAQEMEMIKKKMQ]KQIKKIMEQEc@DsAA[AA{A?Q?_@AkA?_@?QAeA?Y?_@?k@AuA?m@AoA?Y?c@?k@?w@AwA?a@?yC?}@?_@?mA?q@?}A?c@?mA?{A?[AcC?sAM@I?U@iAA_B?oA?iD?cA?o@@}@?{@@W?w@?i@?wA?yA?{A@[?qA?kA?GAEAECGEUSg@e@IGGEGEEAICKCSCMA?y@?EAI?A?iDA_BA_BC_H?i@?S?W?_A@gA?o@AMAwP@vP@L?n@AfA?~@?V?R?h@B~G@~A@~A?hD?@@H?D?x@eAAY?yAA}A?wA@qA?cB?yA?yA?_B@sA?_B@aBAqD?uA?W@gA@?|@?Z?J@tE?fB?z@@V?j@?b@?N?L?V@l@?H?R?^?@?H?J?fB?f@?V?n@?J?n@@hG@fC?J@vB?bA?j@?L?f@?`A@|@?^?`@?~A?\\?T?bA?X?b@?j@@R?R?N?f@?\\?tA?V@vB?R@`B?d@@dD@zK?Z?@@Z?|A?p@?N?L@b@?J@~C?f@?h@?v@?n@@Z?hA@~A?d@?x@@j@?dA?lB?N?R?f@?xB?^?l@?n@?~@Ah@?\\?v@?Z?r@?j@?l@AfA?dA?j@@n@?J?N?V?b@An@?r@?lA?xAAr@?fA?`A?f@?z@?r@?z@At@?H?`@@x@Ab@?J?dD?hE?P?jA?x@AvA?vA?h@?|A?tEArE?lA?Z?jA?T?R_@?[?M?K?yA?Y?i@?mBAoA?e@?U?Q?S?mB?aA?qD?{@@sBAyA?K?K?_@?a@?i@?i@?y@?S?U??x@?Z?\\?l@?T?bA?t@?^?p@?n@?p@@|JiB@_BA?|J@zI?b@}D?uD@uD?oJ?}C?U?sD@?`A?d@@p@?d@?TGCICECGCKIUQ]W\\VTPJHFBDBHBFBJBLBPBH?B@N?@?l@?|@?pD?nJ?nRAj@?tA?Z?T?L?L?T?T?pB?v@?dA?zB?nB?tBAxB?hF?`B?\\?fB?^?r@?RAP?j@CLA^Cf@CNAlB?nF?P@zAAh@?B?lA@?`B?`@?a@?aBnA?tE@X?pD?tD@p@@f@ArC?d@?l@@b@?X?dBAn@E^KFALG@AVMVQb@YHGb@YVQJIFCXOHCHEdAWh@AX?`B?Z?bA@f@A\\?^@\\?`@F\\JHB^Nx@XPHNDPFNBH@F@F?T@P?F?p@@B?b@@p@?tC?hF@~@?|@@fB?pB?T@\\?r@?z@?n@?xC@~A?r@?~@?`A@r@?dA?pB?rA@bB?fB@hA?`A?^?fC@^?\\?`A?lE@V?N?X?P?XAj@?X?d@AV?|@?^?^?P?^?`B?rD?~B?`@?Z?dB?tA?|B@t@?rD?vDA`A?lBAbA@bA?l@?d@?bB@d@@fB@^?r@?v@?L?F?f@?XAj@?jC@h@?h@?|A?j@?tA?P?x@?V?r@?n@?f@?|A?rB?h@?l@A~@?Z?f@AdA?X?|@An@?X?~@@lCAb@?j@?pD?xA?H?Z?x@?t@?b@?b@?lB?N?j@?~@?R?fB?T?T?|@?z@?J?~@??|E@tEAxE?|E?lE?N?xEAvElA?dI?lFAn@?T??`@?\\@n@?H?JAdAA\\?|@@^Al@?X?~@?z@@^?lA?f@?n@?l@?N?tB?V?~C@xAAz@@x@AZ?jA?r@AH@T?h@?dA@vA?V?lB@X@v@Cd@?^AL?h@?x@?r@AbB@pDHR?`@?X@|CAdA@tA?Z?R?X?L?RAlD?V?b@KT?V?n@@t@?vB?`BLV?T?b@?L?^?bA?l@?R?j@?|@@d@?d@?v@KRA`@@t@?\\?l@?R?b@?d@?N?X?T?t@@f@?^AL?J?L?P?b@@x@?`A?v@?z@?h@?h@?d@?z@?j@?j@?H?N?n@?x@?d@?\\?f@?X?rA@`@?j@At@@XA`@?r@@xA?V?`@A|@?T@nA?L?N?R?\\Al@?bB?bB?~@?R@J?d@AjA@f@?lA?bB?x@?\\@`@?z@?Z?L?`@?V?Z?Z?V?Z?v@?X?Z?T?T?Z?Z?Z?X?R?|@?dA?d@?f@?\\@lAA|A?l@?X?^@\\?~A?t@?z@?nA?T?f@?vA@j@Ap@?P?J@\\?R?N?P?N?Z?d@?j@@X?RAlA?n@?V?L?N?`@?n@?z@?X?N?tC?jD?J?|C?rA?fC?h@?L?t@?nD?\\@xDAZ?V?PAZ?PAJAP?HEl@Gr@?RAH?^Al@?p@?L?X?nB@bB?tA?\\?zA?rB?r@?^?jB?fD?P?|B?F?X?T?r@?L@fB?v@c@AgAA?aAz@?BA@A?E@uCc@?Y?C?ABA@@hB?n@?`AKAs@AO?UAU?i@AoACeAAa@Co@AaAAi@?M?[A[?gA?Q?o@?[?c@?g@Ag@?kBE_AA]A_A?UAO?Q?W?U?S?{@Aq@Ai@AU?G?OAi@Aa@AI?sBEy@AmACYA]?iBE]A]AqBEmCEy@Cs@A{CGg@AW?A?WAc@Aw@AA?_@AKAO?aBAY?WAW?MAK?mEKiBCaACsBEQAi@?SA}@AQ?]AW?q@AKAY?_ABi@o@e@k@m@{@UWm@o@uI}JaBmB]c@e@k@i@m@eAsAeBmBW]GKGGSSMOUWEEa@c@UYc@e@SUQS_@a@IM]c@_@c@QUW[KMAAIK[_@QSOXGLk@`Bi@~AM^Wj@Wj@Yf@c@n@w@dAk@t@EF]j@EDWf@Yp@KXM\\ENCHABENQf@W|@ENIf@GTCJCL?BEJUz@Sp@i@bBe@vAEFCFc@~BYr@KXUp@c@jAa@fAa@fA]bA_@bA]z@q@hBc@lAi@vA[z@aAlCc@pAQb@M^IPITOXKRMXMTOVW`@IN[`@GJKL]`@KLGFCB_@\\]ZMLMHYVg@\\c@ZsBxAoA`Ay@l@g@\\[TGDYTIFEBEDiAx@}@p@y@j@WPGFWRu@h@cCfBaAr@k@b@oA|@m@b@uAbAgBnAaChBi@\\[RKFMHEDGBCBIFKHUNUPGDGDYTKHe@\\_@XQJ_@ZUP]VGBSPq@f@iAv@kHfFYRKHGDi@\\s@h@OJuAdAYTg@\\y@j@y@l@w@j@{@n@aAr@OLYR_@TGFEBg@`@IDOLSNUPk@^o@f@eExCuB~AaAr@o@d@yCvBWPYTWL}@b@QHk@V]Ps@^_CxAs@b@YPc@ZwCvBw@f@{@n@i@`@_@VQOc@[_@Ye@]c@[[WUQk@a@IGGNGJSb@MZMVIRINO\\KTWf@m@nAs@rAQXWZMNIJ[XKHIHOHOJID{@`@c@ROHSJGBIDa@Ri@VOFUJa@PIDu@\\QJKFIFa@XXl@JPJRHPHNHPRd@LZLTJPHNJNHLZl@R\\HPJRJTLT^r@`@t@JTR^NZDHXh@NX^v@R`@JRP\\LXVd@R`@Vf@NZLVP\\R`@R^NZLVXh@R^NXJTHLHNJRLVVh@R^LIMHy@j@SL_JxGgAv@oCnBeAv@o@d@OLMHIF_@XURWRc@^URUNk@`@cAt@}@p@kAz@UPmBvAyBzA_CdBQL]Ro@XWNWPgE|CSLkAx@WPcD~BYTm@b@g@^QLCB]XYRCBOLSPUTOP[^KNOTKPGLOZO^K\\K`@Mj@G^E\\CZC`@GrAA\\EXG`@GV?DKb@Od@GRSh@MVMTOVOTY\\QRURURSNiBpAmE`DmA~@_CbBOJKF{@n@]VKHMJYRMJe@Zi@`@[TYTWRUNiAx@a@Xk@`@{@n@YTyBbBUNEDm@`@YRkAz@UP_GjEWRSNUPWPWPSNUNa@X_@X_@Xu@f@OLMJOJy@n@QLMLu@h@uCrB[T_@XQNIDMJc@ZSLWN}@f@UPQJOHk@`@MHSNO@GDIHa@^IHKJOLi@b@GNMJMHWRURe@`@SNm@h@Vf@LVR\\BFFJFLP\\R\\NXBFJVJT@DDLJVPh@BHHZJZBNFNF^BHBNLr@DXDXHr@BRDf@?FBTHr@LtAFj@Hn@@JBXD\\BVDXBXBX@HW`@W\\]b@[\\MPOPMNOPKLEFo@x@GHOPCDOP[^o@x@gArAeBrBQR[^q@t@s@|@{@hAyAnB}@jA_AhAq@x@KLcAjAEGUc@??"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints.

![](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/equal-task-distribution.webp)

## Analyzing the Solution

Looking at the result we can see that all the tasks are accommodated on the 2 routes with each vehicle taking care of 8 jobs. We can see that the optimizer has favored equal distribution of the task over the cost considerations of the route as is evident from the locations of some of the jobs which were located closer to vehicle 1 than to vehicle 2. NextBillion.ai’s Route Optimization Flexible API offers a unique feature to tackle the challenges of uniform cost distribution across multiple resources as per the rules defined by the user and prepare the best solution. Readers are encouraged to try the other metric available for equal distribution, travel cost, as well.

We hope this example was helpful. Check out some more [use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization Flexible API can handle for you!
