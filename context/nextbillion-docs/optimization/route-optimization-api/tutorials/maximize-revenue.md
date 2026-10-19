# Maximize Revenue

The ultimate goal of any route optimization exercise is to improve the profitability of the business. One of the ways to do so is to choose the routes which lead to the highest revenue earned. NextBillion.ai Route Optimization API allows users to add potential revenue earned from fulfilling each task. During optimization this value helps identify the profit earned from fulfilling the task after considering all the costs incurred to fulfill the task. The algorithm applies this approach to assign and schedule every task resulting in a final route with maximum potential revenue within a given set of constraints.

## Setup

We have a total of 3 pickup jobs to be fulfilled along with the potential revenue they can earn configured into the task properties. We use only one pickup van, which starts from a designated depot location and brings the items collected from the pickup locations back to the depot. To highlight the impact of adding revenues on the final solution, we provide different revenues for each task. Let’s configure the locations, pickup jobs with their revenues, and the vehicle one by one in the following sections.

### Locations

First, we define the `locations` object and add all the location coordinates used in the problem along with a valid `id`. The `locations` object used in this example:

```json
"locations": {
   "id": 1,
   "location": [
     "34.06933155,-118.30306696",
     "34.05793824,-118.30306696",
     "34.05108131,-118.29468212",
     "34.05155159,-118.08175255"
   ]
 }
```

### Jobs

Next, we define the 3 pickup jobs in our problem statement. For each of these tasks, we add:

- A unique identifier
- Location index
- Pickup quantities
- A service time
- Potential revenue earned by fulfilling the task

Following is the JSON we use in this example:

```json
"jobs": [
   {
     "id": 1,
     "location_index": 1,
     "pickup": [
       10
     ],
     "service": 300,
     "revenue": 800
   },
   {
     "id": 2,
     "location_index": 2,
     "pickup": [
       10
     ],
     "service": 300,
     "revenue": 900
   },
   {
     "id": 3,
     "location_index": 3,
     "pickup": [
       10
     ],
     "service": 300,
     "revenue": 600
   }
 ]
```

### Vehicles

Now we configure the pickup van that will be responsible for fulfilling the tasks. To configure the van properties, we specify:

- A unique ID
- `start_index` & `end_index` to indicate the starting and ending locations of the route
- `capacity` indicating the storage capacity of the vehicle

Once the vehicle and its properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
   {
     "id": "Vehicle 1",
     "start_index": 0,
     "end_index": 0,
     "capacity": [
       30
     ]
   }
 ]
```

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Revenue per Order Example",
  "locations": {
    "id": 1,
    "location": [
      "34.06933155,-118.30306696",
      "34.05793824,-118.30306696",
      "34.05108131,-118.29468212",
      "34.05155159,-118.08175255"
    ]
  },
  "jobs": [
    {
      "id": 1,
      "location_index": 1,
      "pickup": [
        10
      ],
      "service": 300,
      "revenue": 800
    },
    {
      "id": 2,
      "location_index": 2,
      "pickup": [
        10
      ],
      "service": 300,
      "revenue": 900
    },
    {
      "id": 3,
      "location_index": 3,
      "pickup": [
        10
      ],
      "service": 300,
      "revenue": 600
    }
  ],
  "vehicles": [
    {
      "id": "Vehicle 1",
      "start_index": 0,
      "end_index": 0,
      "capacity": [
        30
      ]
    }
  ],
  "options": {
    "objective": {
      "travel_cost": "duration"
    }
  }
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "b2baf540b8818d04d16f3b867ed3959d",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=b2baf540b8818d04d16f3b867ed3959d&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Revenue per Order Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1011,
      "routes": 1,
      "unassigned": 1,
      "setup": 0,
      "service": 600,
      "duration": 1011,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [0],
      "pickup": [20],
      "distance": 5984,
      "revenue": 1700
    },
    "unassigned": [
      {
        "id": 3,
        "type": "job",
        "location": [34.02015501, -118.15534557],
        "reason": "fulfilling the job will not be profitable"
      }
    ],
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 1011,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06933155, -118.30306696],
            "location_index": 0,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.06941, -118.30309]
          },
          {
            "type": "job",
            "arrival": 502,
            "duration": 502,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05108131, -118.29468212],
            "location_index": 2,
            "id": 2,
            "load": [10],
            "distance": 2977,
            "internal_id": 2,
            "snapped_location": [34.05108, -118.29476]
          },
          {
            "type": "job",
            "arrival": 1016,
            "duration": 716,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05793824, -118.30306696],
            "location_index": 1,
            "id": 1,
            "load": [20],
            "distance": 4514,
            "internal_id": 1,
            "snapped_location": [34.05794, -118.30308]
          },
          {
            "type": "end",
            "arrival": 1611,
            "duration": 1011,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06933155, -118.30306696],
            "location_index": 0,
            "load": [20],
            "distance": 5984,
            "snapped_location": [34.06941, -118.30309]
          }
        ],
        "service": 600,
        "duration": 1011,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [0],
        "pickup": [20],
        "distance": 5984,
        "geometry": "yd}nEhaaqUa@A?lAAbCb@?\\Aj@AF?J?~I?jJ@|D?jDA|B?^?P?J?t@?b@?b@?V?H@F@HBH@D@H?bA?J?T?N?|A?x@?B?|@?f@?fI?lA?A}D?[?eCAsA?c@?i@?wA?s@d@?X?~A?fE?`D?Z?ZAL?J?TAPARCPCNEPE?ANENGTIPKFCNIDCNGJG^SPKNIVKPGTGLCNCH??mB?m@?{@?_A?g@?S?YA{@?aB?e@?gA?uA?g@?uAAeA?e@?aBH?lH?mH?I??`B?d@@dA?tA?f@?tA?fA?d@?`B@z@?X?R?f@?~@?z@?l@?lB?t@A^@t@?z@?`@?b@?v@@tA?pA?n@?lAuA@cA?kA?_CAEACCCAIAoG?_A@_A?]?sC?w@?a@?O?c@?}A?aF?@dE?Rg@?}@?C?y@?}A?O?U?K?cA?I?EAIAICGAIAW?c@?c@?u@?K?Q?_@?}B?kD@}D?kJA_J?K?G?k@@]@?oE",
        "internal_id": 520918500,
        "revenue": 1700
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![Sample route plan when orders are fulfilled based on revenue](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/revenue-per-order.webp)

_Optimizer doesn’t fulfill a order with low profitability_

## Analyzing the Solution

- Looking at the result we can observe that:
- Only 2 pickup tasks were fulfilled while one remained unassigned.
- The “summary” attribute returns the total cost incurred to make this trip, 1011, and the total revenue earned, 1700. Hence, an overall profit of 689 is earned by following the suggested route plan.
- The unassigned task was the farthest from the depot location and had the lowest revenue. Hence it was not profitable to fulfill this task as the cost incurred to fulfill it was higher than the revenue earned from it.
- The solution also returns the reason for keeping this task unassigned - “fulfilling this job will not be profitable”.

The above example exhibits how NextBillion.ai’s Route Optimization API uses the revenue information to suggest a route with high profitability. We encourage you to go ahead and try out different configurations of revenues, number of tasks / vehicles and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the [other powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
