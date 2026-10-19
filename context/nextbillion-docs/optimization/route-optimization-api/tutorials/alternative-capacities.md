# Alternative Capacities

Businesses in industries like e-commerce, retail deliveries, and logistics providers deal with a variety of goods & items. In such operations, the actual load capacity of the vehicle can accommodate multiple combinations of different types of goods. As an example, a vehicle can accommodate either 10 boxes along with 2 pallets or else it can accommodate 3 boxes but 5 pallets.

For such scenarios, NextBillion.ai’s Route Optimization API provides alternate capacity settings to help leverage the cargo space of a vehicle by choosing the most efficient load configurations among those provided in the input problem statement. Once the users provide all possible load configurations for relevant vehicles, the optimization engine works with a wider range of potential solutions to provide a streamlined solution.

## Setup

We have a total of 6 pickup jobs with loads specified in two dimensions - weight and boxes. The pickups are to be fulfilled by two vans which start and end their trip on the same location (a depot). Each pickup has a combination of weighted goods and boxes to be collected. On the other hand, each van is also capable of storing multiple combinations of these two types of items. We configure the locations, pickup jobs, vans and their capacity constraints one by one in the following sections.

### Locations

First, we define the `locations` object and add all the location coordinates used in the problem along with a valid `id`. The `locations` object used in this example:

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
     "34.004364,-118.421170"
   ]
 }
```

### Jobs

Next, we define the 6 pickup jobs in our problem statement. For each of these tasks, we add:

A unique identifier Location index Pickup quantities of both dimensions i.e. weighted goods in kgs and the number of boxes.

Following is the JSON we use in this example:

```json
"jobs": [
   {
     "id": "Pickup 1",
     "location_index": 1,
     "pickup": [0,4]
   },
   {
     "id": "Pickup 2",
     "location_index": 2,
     "pickup": [3,5]
   },
   {
     "id": "Pickup 3",
     "location_index": 3,
     "pickup": [4,1]
   },
   {
     "id": "Pickup 4",
     "location_index": 4,
     "pickup": [5,1]
   },
   {
     "id": "Pickup 5",
     "location_index": 5,
     "pickup": [1,0]
   },
   {
     "id": "Pickup 6",
     "location_index": 6,
     "pickup": [2,1]
   }
 ]
```

### Vehicles

Now we configure 2 pickup vans that will be responsible for fulfilling the tasks. For each of them, we specify:

- A unique ID
- `start_index` & `end_index` to indicate the starting and ending locations of the route
- `capacity` indicating the usual storage capacity of the vehicles
- `alternative_capacities` to specify combinations of alternate capacities which can be used depending on the load quantities of the tasks to be performed.

Once the vehicles and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
   {
     "id": "Vehicle 1",
     "start_index": 0,
     "end_index": 0,
     "capacity": [5,5],
     "alternative_capacities": [
       [3,10],
       [15,3]
     ]
   },
   {
     "id": "Vehicle 2",
     "start_index": 0,
     "end_index": 0,
     "capacity": [5,5],
     "alternative_capacities": [
       [3,10],
       [15,3]
     ]
   }
 ]
```

The capacity configuration for each vehicle is explained below:

- Each van under usual conditions can accommodate \[5 kgs of weight + 5 boxes\], as specified by `capacity`.
- However, if needed, the vans can also accommodate alternate combinations of these load types. Each of them can either pick up \[3 kgs of weight + 10 boxes\] or they can pick up \[15kgs of weight + 3 boxes\], as specified by `alternative_capacities`.

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "description": "Alternative Capacities Example",
  "locations": {
    "id": 1,
    "location": [
      "34.083950,-118.318640",
      "34.054927,-118.323726",
      "34.075525,-118.361588",
      "34.076350,-118.338519",
      "34.090425,-118.338933",
      "34.037925,-118.459842",
      "34.004364,-118.421170"
    ]
  },
  "jobs": [
    {
      "id": "Pickup 1",
      "location_index": 1,
      "pickup": [0,4]
    },
    {
      "id": "Pickup 2",
      "location_index": 2,
      "pickup": [3,5]
    },
    {
      "id": "Pickup 3",
      "location_index": 3,
      "pickup": [4,1]
    },
    {
      "id": "Pickup 4",
      "location_index": 4,
      "pickup": [5,1]
    },
    {
      "id": "Pickup 5",
      "location_index": 5,
      "pickup": [1,0]
    },
    {
      "id": "Pickup 6",
      "location_index": 6,
      "pickup": [2,1]
    }
  ],
  "vehicles": [
    {
      "id": "Vehicle 1",
      "start_index": 0,
      "end_index": 0,
      "capacity": [5,5],
      "alternative_capacities": [
        [3,10],
        [15,3]
      ]
    },
    {
      "id": "Vehicle 2",
      "start_index": 0,
      "end_index": 0,
      "capacity": [5,5],
      "alternative_capacities": [
        [3,10],
        [15,3]
      ]
    }
  ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "bc254dcbc7638a443badf2a8db2a0eb1",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=bc254dcbc7638a443badf2a8db2a0eb1
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Alternative Capacities Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 5829,
      "routes": 2,
      "unassigned": 0,
      "setup": 0,
      "service": 0,
      "duration": 5829,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [0, 0],
      "pickup": [15, 12],
      "distance": 62256
    },
    "routes": [
      {
        "vehicle": "Vehicle 2",
        "cost": 3890,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "load": [0, 0],
            "distance": 0,
            "snapped_location": [34.08391, -118.31864]
          },
          {
            "type": "job",
            "arrival": 1398,
            "duration": 1398,
            "service": 0,
            "waiting_time": 0,
            "location": [34.037925, -118.459842],
            "location_index": 5,
            "id": "Pickup 5",
            "load": [1, 0],
            "distance": 19783,
            "internal_id": 4203508702,
            "snapped_location": [34.03793, -118.45985]
          },
          {
            "type": "job",
            "arrival": 1972,
            "duration": 1972,
            "service": 0,
            "waiting_time": 0,
            "location": [34.004364, -118.42117],
            "location_index": 6,
            "id": "Pickup 6",
            "load": [3, 1],
            "distance": 26465,
            "internal_id": 4186731083,
            "snapped_location": [34.00435, -118.4212]
          },
          {
            "type": "job",
            "arrival": 3279,
            "duration": 3279,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07635, -118.338519],
            "location_index": 3,
            "id": "Pickup 3",
            "load": [7, 2],
            "distance": 42676,
            "internal_id": 4237063940,
            "snapped_location": [34.07635, -118.33851]
          },
          {
            "type": "job",
            "arrival": 3470,
            "duration": 3470,
            "service": 0,
            "waiting_time": 0,
            "location": [34.090425, -118.338933],
            "location_index": 4,
            "id": "Pickup 4",
            "load": [12, 3],
            "distance": 44239,
            "internal_id": 4220286321,
            "snapped_location": [34.09043, -118.33862]
          },
          {
            "type": "end",
            "arrival": 3890,
            "duration": 3890,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "load": [12, 3],
            "distance": 47103,
            "snapped_location": [34.08391, -118.31864]
          }
        ],
        "service": 0,
        "duration": 3890,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [0, 0],
        "pickup": [12, 3],
        "distance": 47103,
        "geometry": "<route_geometry>",
        "internal_id": 571251357
      },
      {
        "vehicle": "Vehicle 1",
        "cost": 1939,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "load": [0, 0],
            "distance": 0,
            "snapped_location": [34.08391, -118.31864]
          },
          {
            "type": "job",
            "arrival": 639,
            "duration": 639,
            "service": 0,
            "waiting_time": 0,
            "location": [34.075525, -118.361588],
            "location_index": 2,
            "id": "Pickup 2",
            "load": [3, 5],
            "distance": 5047,
            "internal_id": 4253841559,
            "snapped_location": [34.07553, -118.36143]
          },
          {
            "type": "job",
            "arrival": 1280,
            "duration": 1280,
            "service": 0,
            "waiting_time": 0,
            "location": [34.054927, -118.323726],
            "location_index": 1,
            "id": "Pickup 1",
            "load": [3, 9],
            "distance": 10764,
            "internal_id": 4270619178,
            "snapped_location": [34.05492, -118.32363]
          },
          {
            "type": "end",
            "arrival": 1939,
            "duration": 1939,
            "service": 0,
            "waiting_time": 0,
            "location": [34.08395, -118.31864],
            "location_index": 0,
            "load": [3, 9],
            "distance": 15153,
            "snapped_location": [34.08391, -118.31864]
          }
        ],
        "service": 0,
        "duration": 1939,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [0, 0],
        "pickup": [3, 9],
        "distance": 15153,
        "geometry": "<route_geometry>",
        "internal_id": 520918500
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/alternative-capacities.webp)

## Analyzing the Solution

Looking at the result we can observe that:

- All task were fulfilled and the total cost of the solution is 5829
- Both vehicles were used. Vehicle 1 fulfills pickup 1 & 2 while Vehicle 2, fulfills pickup 3, 4, 5 & 6
- We also see that alternative capacities were used for both vehicles as the usual capacities were not sufficient to fulfill all jobs.
- For Vehicle 1, the \[3,10\] configuration was used and for Vehicle 2 the \[15, 3\] configuration was used.

The above example exhibits how NextBillion.ai’s Route Optimization API uses the alternative capacities to serve the tasks specified and suggest the best solution. We encourage you to go ahead and try out different configurations of capacities, delivery or pickup loads and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api/tutorials) and the related use cases that Route Optimization API can solve for you.
