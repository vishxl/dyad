# Custom Cost Matrix

In this example, we cover an interesting feature of assigning user-defined travel costs of traveling from one point to another. NextBillion.ai’s Route Optimization Flexible API would then use these custom costs to arrange the job fulfillment in a way such that the overall costs are minimum.

It is important to highlight that user-defined costs are unitless and they are treated at face value for all calculations. So, without further ado let’s start building an example to understand this powerful feature.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please [contact us](mailto:support@nextbillion.ai) to get your API key now!

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### Jobs & Shipments

We start by defining 4 jobs. For these jobs we add:

- A unique identifier for each job

- Location indexes for each job

- Specify the schedule of jobs. This is done by adding time windows within which a job must be completed. We have not used any time windows for jobs to ensure that timing constraints don’t take precedence over routing cost constraints. This helps us observe the effect of custom costs in isolation. As a clarification, in case time windows and custom costs are used together, time constraints might override few cost constraints such that the task gets fulfilled. This situation is likely to occur when there are no feasible alternatives available for the optimizer, to assign the given task. Route Optimization Flexible API places a high priority on task fulfillment.

- The actual time taken to complete the jobs once the driver/vehicle is at the job’s location i.e. the service time for each job.

Let’s take a look at how the above properties are configured for the jobs:

```json
  "jobs": [
    {
      "id": 1,
      "location_index": 0,
      "service": 180,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693382400,
          1693418400
        ]
      ]
    },
    {
      "id": 2,
      "location_index": 1,
      "service": 120,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693382400,
          1693418400
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
          1693382400,
          1693418400
        ]
      ]
    },
    {
      "id": 4,
      "location_index": 3,
      "service": 150,
      "pickup": [
        0
      ],
      "time_windows": [
        [
          1693382400,
          1693418400
        ]
      ]
    }
  ]
```

### Vehicles

Next, we add the vehicle that is going to fulfill the jobs within the defined constraints. To describe the vehicle and its properties we add:

- A unique ID for the vehicle

- Vehicle shift time or the time window

- Capacity to denote the amount of load that the vehicle can take

- Start_index to denote the point from where the vehicle would start.

- Costs for all vehicles. We have specified a `fixed` cost of 1000 for the vehicle.

Again, for the sake of simplicity, we are using only 1 vehicle but rest assured Route Optimization Flexible API is equally efficient for any number of vehicles. Readers are encouraged to add multiple vehicles. Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
  "vehicles": [
    {
      "id": 1,
      "start_index": 4,
      "capacity": [
        20
      ],
      "costs": {
        "fixed": 1000
      },
      "time_window": [
        1693382400,
        1693418400
      ]
    }
  ]
```

### Locations

Next, we define the `locations` object and add all the locations used in the problem along with a valid `id`. The `locations` object with all the points used in this example:

```json
  "locations": {
    "id": 1,
    "location": [
      "34.054927,-118.323726",
      "34.075525,-118.361588",
      "34.004364,-118.421170",
      "34.000215,-118.318803",
      "34.057106,-118.361326"
    ]
  }
```

### Custom Cost Matrix

To define the cost of traveling between the locations involved in the optimization problem, we would define a cost matrix. The values in the matrix do not necessarily have to correspond to the actual journey time or distance data. The matrix values can be computed after taking into account any key metric that reflects the actual "cost" of taking a route in your business scenario.

For this example, we are going to use the following cost matrix of randomly selected values that would act as the costs of traveling between different locations.

|           | Job 1 | Job 2 | Job 3 | Job 4 | Vehicle 1 |
| --------- | ----- | ----- | ----- | ----- | --------- |
| Job 1     | 0     | 250   | 120   | 100   | 140       |
| Job 2     | 230   | 0     | 110   | 80    | 230       |
| Job 3     | 270   | 240   | 0     | 210   | 200       |
| Job 4     | 300   | 190   | 240   | 0     | 290       |
| Vehicle 1 | 90    | 100   | 240   | 260   | 0         |

The figures used in the example cost matrix above in no way reflect the real driving distance between the locations. For example, the actual distance between Job 1 & Job 3 locations is 16 kms whereas the actual distance between Job 1 & Job 2 is 6 kms only.

Once the matrix values are decided and configured, the resulting `cost_matrix` JSON is:

```json
    "cost_matrix": [
        [
            0,
            250,
            120,
            100,
            140
        ],
        [
            230,
            0,
            110,
            80,
            230
        ],
        [
            270,
            240,
            0,
            210,
            200
        ],
        [
            300,
            190,
            240,
            0,
            290
        ],
        [
            90,
            100,
            240,
            260,
            0
        ]
    ]
```

### Options

Lastly, we would need to set the `travel_cost=customized` for our `cost_matrix` to be effective.

```json
"options":{
  "objective":{
     "travel_cost":"customized"
  }
}
```

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Custom Cost Matrix Example",
   "jobs": [
       {
           "id": 1,
           "location_index": 0,
           "service": 180,
           "pickup":[0],
           "time_windows": [
               [
                   1693382400,1693418400
               ]
           ]
       },
       {
           "id": 2,
           "location_index": 1,
           "service": 120,
           "pickup":[0],
           "time_windows": [
               [
                   1693382400,1693418400
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
                   1693382400,1693418400
               ]
           ]
       },
       {
           "id": 4,
           "location_index": 3,
           "service": 150,
           "pickup":[0],
           "time_windows": [
               [
                   1693382400,1693418400
               ]
           ]
       }
   ],
   "vehicles": [
       {
           "id": 1,
           "start_index": 4,
           "capacity":[20],
           "costs":{
               "fixed":1000
            },
           "time_window": [
               1693382400,1693418400
           ]
       }
   ],
    "locations":
        {
            "id": 1,
            "location": ["34.054927,-118.323726", "34.075525,-118.361588","34.004364,-118.421170","34.000215,-118.318803","34.057106,-118.361326"]
        },
    "cost_matrix":[
        [0,250,120,100,140],
        [230,0,110,80,230],
        [270,240,0,210,200],
        [300,190,240,0,290],
        [90,100,240,260,0]
    ],
    "options":{
        "objective":{
            "travel_cost":"customized"
        }
    }
}
'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "ce52afbf0c52acfe5a09b2ac901257de",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=ce52afbf0c52acfe5a09b2ac901257de
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Custom Cost Matrix Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1490,
      "routes": 1,
      "unassigned": 0,
      "service": 570,
      "duration": 4954,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [0],
      "pickup": [0],
      "distance": 37768.399999999994
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 1490,
        "steps": [
          {
            "type": "start",
            "arrival": 1693382400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.057106, -118.361326],
            "location_index": 4,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693382983,
            "duration": 583,
            "service": 180,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 0,
            "id": 1,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693384160,
            "duration": 1580,
            "service": 150,
            "waiting_time": 0,
            "location": [34.000215, -118.318803],
            "location_index": 3,
            "id": 4,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693386117,
            "duration": 3387,
            "service": 120,
            "waiting_time": 0,
            "location": [34.075525, -118.361588],
            "location_index": 1,
            "id": 2,
            "load": [0]
          },
          {
            "type": "job",
            "arrival": 1693387804,
            "duration": 4954,
            "service": 120,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 2,
            "id": 3,
            "load": [0]
          },
          {
            "type": "end",
            "arrival": 1693387924,
            "duration": 4954,
            "service": 0,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 2,
            "load": [0]
          }
        ],
        "service": 570,
        "duration": 4954,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [0],
        "pickup": [0],
        "distance": 37768.399999999994,
        "geometry": "ywznEjmlqUBG@G@GAEEEMIw@[q@WLoA@KB[JmAB_@?U@[?a@?iABiD?u@@c@@aB@iB@g@?S@_ABsF@aB?s@?k@@o@?m@@g@?UBgBB{EDcF@s@@qD@aB@[@gA?y@?]BuB?}@?W@m@?Q?W@{@?]?K@M?kA?Q?U?I@_@BuE@qA@W?c@DcB?u@?y@?M@}B@mA?]@g@@y@@s@@c@@aA?S?U@aB@g@?e@@s@?c@@uA?m@@o@?cC@u@@{@@o@?sA?Y?Q?I?Y@m@@g@AG?A?g@@[BUBUDUFYVmA@GH_@RgAb@}B\\mB`@sBX{ADUFUNy@ZgBReABQTgADSFYBKFc@BWD[F}@@IHaBZqFLaCPuCDo@D}@BS_@C^B@U@SB]@IBQHa@H_@BM^uADSDQRu@Lk@FSPs@FS`@}Ah@mBJ_@\\oAr@VpCdAdC~@lAb@|@\\rAf@nAd@jG~B`FlBB@TJJBLDLBJBX@`@@D?L?pE?bB@pD?X?vCAR?hCAh@?`AAfB?zB@fFAN?@pA?\\DL?fA?d@N?J?tA@xA?lAAhB?hIAlA?H?VAvG?AiF?qF?}BAoB?}C?oApB@CcCAkBjA?b@?rA?h@?p@?`C?pCAb@?T?R?j@?b@?L?l@?v@?lA?d@?|@?jB?dDA`@?z@?n@?h@?vAAf@?L?h@?j@?^?T?X?r@?n@?rB?h@AhA@nA?fE@R?fH@X?dA?bA?N?b@?J?L@F@F?HB??D@FDHBHFd@\\TPJHFBDBHBFBJBLBPBH?B@N?@?l@?|@?pD?nJ?nRAj@?tA?Z?T?L?L?T?T?pB?v@?dA?zB?nB?tBAxB?hF?`B?\\?fB?^?r@?RAP?j@CLA^Cf@CNAlB?nF?P@zAAh@?B?lA@?`B?`@?@?rA?~A@h@?nA}R?{ABM?kABgGAaJ@aJAS@oF?s@?E?g@?gD?Q?U?wEAqI@q@AgTB?Z@z@A^?\\?HA^?RAFAJCRQhAE\\In@Gb@U|AId@E`@U~ACNIJCPCJCLIh@EXERG`@CRIf@E\\@PCPCXIp@ETM|@o@pEId@I`@Kj@I`@GXa@vBMl@EZ]nBCLIb@Gb@AJYjBGf@Gb@YjBIn@G^YrBIn@G\\QnAKp@Gd@Kl@ER?HCRADC\\CXAXAf@?VAt@?N?b@?P?PAT?b@?d@?h@CnB?j@?j@?nB?f@?l@?jB?h@O?mG?c@?]dFWDYDQ~BCXKtA[jFSrEUnEuE@}A@cB?uHAoJ?@xBO\\}ApD}ApD}ApDeEuCi@_@{@k@IGEEIG?{@?Y?W?a@AwAg@?k@@W?GAGACACAECGCECw@c@u@c@g@YIEg@YOIc@WKESO_Ag@w@c@WOgHcEg@tAMz@GXkCs@yC}@yC_AOEICKAI?UBw@NE@M@S@Q@K?KCSEQIYKcC}@i@SYIKEKGGGIKKQIQGOGKIMKMOOOMKKMIKIOIQISI[KsApHG^UpAK`@G`@?b@YdBy@vE_@KiA[i@OICOEKCUIa@K[ISGk@O]IICa@Ki@M[K[IQEkA]c@Mo@Qs@Ss@So@Qe@Mc@MA?}@WC?MEQA??UAO?o@BI@M@S?i@@o@?q@?Y?G@iADK@G?s@?K?OCQAUEGAa@M]KKCQGk@QsA_@ICUEMEEAa@IMCg@GSCEAA?C?SA_@?K?A?S@KBE@GDQHGDk@^OJMHs@f@WKUIUIOEWEUGaCi@KCKCKAG@K@KDOBKDODG?G?OBCtEA^?H?T?P?jAAL?J?\\Az@?V?PAl@?V?|@CtB?\\?x@AfAAZA`BApDAr@EbFCzECfB?TAf@?l@An@?j@?r@A`BCrFi@Uk@S_DeAaIkCMCIEOEOCIp@E^E`@EVA^El@yCaAw@WuAe@c@OWIMG]KuAi@W?g@?w@?{@A]@a@?m@?Q?M@K@I@?fA?b@@dC?xB?R?~A?~@?dG?P?zA?N?j@@rCA`@?T?\\?\\AhBg@@e@?U?cA?W?oC?U?mC?w@@c@?a@?O?[@g@?k@?i@?c@?e@?o@?a@@Y?[?Y?U?S?cA?]?U?[A_A@m@?i@?uBAY?_A?g@?g@?u@?Q?{@@U?_@?e@?a@?uB?{@@M?Q?P?L?z@AtB?`@?d@?^?T?z@AP?t@?f@?f@?~@?X?tB@h@?l@?~@AZ@T?\\?bA?R?T?X?Z?X?`@An@?d@?b@?h@?j@?f@?ZAN?`@?b@?v@AlC?T?nC?V?KhBItAMtBWzEQ|CtBPNB\\Bj@F|BP`AJb@Db@DJ@RBNDDNJLHFRTRTZVp@p@|@~@hBbBXVLHJFHBN@Z@JGz@@P?L@L@P@LBH@LBBBHDNPdAfAPRTTJJXX~A|ATVJJBDDBBHDHDLDL@FBFDHFHHDHFNDDBNDB@b@N|DzAvDpAnKxDfFjBp@VPF@@`@N\\NXH`@J@@JBPBpAV`Dh@t@LjB\\xCj@p@JlB^TD`@FhBZr@L`BXz@PvBb@RDlBb@HBtFnA`JnBlCl@jH`BSlBGh@G`@Gh@ZFd@JF@PBHBRB\\FRDPBNBP@B@L?N@N?J?D?NAp@EPAJ?L?L@R@P@VBXDXDL@RDF@f@FAHCNCHCX?FC^?`@@b@Bj@H|@JfAFl@BZLz@TpAT~@FVH^r@vAZ~@\\~@^x@v@|AxDxHnAfCnAdCJPHPLVTd@Tb@Rb@P\\Vf@P^Zp@b@z@Xn@Zl@^v@LVZn@Vf@DH?@^r@Zp@DJPZf@`AXp@R\\NZLZHJDHFLLVHLFNFLJRJRVf@JTJTFLHPFLFLFLFLJVHVJR@BFRFNFPDLDLDNDNDLDPDNBLDPFTDTFVDTBRDRDXDZDXBRBRBVBXBT@V@N@L@P@N@XBh@BrA?h@Aj@?TAb@A^A^Cb@AZAZCd@AVSfFOnDGlAAj@QlECf@OlEE~@GtAAJOfD?HATK`CCX?JAJGhBQxDKrCAXAZA\\Cj@CXALCd@KdAC\\EZO`ACNKn@U`AMh@Kd@i@rBg@vBo@nCGZQv@GXKl@ETANEZGp@E\\Eh@Cb@Ch@AZA`@A^Ar@?r@@n@Aj@@j@?b@Al@@\\?R?n@AlA@`A?V?^?`A?jA?rA?R?b@@vA?fA?h@?Z?F@X?l@?\\@^AV@lB@tE?`A?h@O|BCrAG|BSjFGpACf@Aj@Ar@?d@@^@N@L@L?N@J@LBN@JBL@J@JBJBLBJ@FBJDNDLBJDJBJDH@B@FBFBDDFBHFLNZFHHLLRFJFHFHDDJLLJDFDFJHHHJHLJHFJFLHNHBBNFRJRFRHRFTFNBTFLBL@J@J@R?N@P?PAR?PAF?ZCJANANAHAHAFADCHADAHCLELCJEHEJEHCHGHEHEJIFENKNORQtAsAZYXYr@o@Z[j@e@f@_@p@i@FEDGpAyAtAcAtAaAlA}@`@[xFeEvDoCjBuAx@o@ZUJGf@]VS\\WJIROFEd@]r@i@pByAPMdGmExBaBtB{AxB_BtB}AzAiAf@]`As@|BcBbDaCz@o@XSVQRMFGFCFArAc@tA_Ax@e@VMLGTGHAL@PBHDHDFFJJJFZl@BFLXLTZ~@Td@r@|Ax@o@vIkGfAy@NX^v@R`@JRP\\LXVd@R`@Vf@NZLVP\\R`@R^NZLVXh@R^NXJTHLHNJRLVVh@R^LI??"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following is a visual representation of the initial locations of tasks, vehicles and the routes suggested after optimization as per the given constraints.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/custom-cost-matrix.webp)

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- We have the regular details of the optimized solution in the `summary` section. Key detail in context of our example is that none of the jobs remained unassigned.

- In the `routes` section we can see the details of `steps` to understand the order in which the jobs were completed.
  - The vehicle, after starting from its start point, completes job 1 first. We can observe from the cost matrix that job 1 was the least costly option indeed from the vehicle's starting point.
  - Once the vehicle completes the job 1, it then goes to job 4 which was most economical (100) among all other valid options, then to job 2 which again was the cheapest option (190) when compared to job 3 which is covered at the last.
  - In order to arrive at the total cost of the optimized solution, 1490, the sum of individual costs of the routes taken _(90 + 100 + 190 + 110)_ is added to the fixed cost of using the vehicle.

As we learned, the custom cost matrix feature of NextBillion.ai’s Route Optimization Flexible API is a powerful way for the users to model real life business constraints. As an experiment, users can try the same example with different cost matrix values or with realistic time windows added to the jobs and find out how these variations affect the original solution.

We hope this example was helpful. Check out some more [use cases](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) that Route Optimization Flexible API can handle for you!
