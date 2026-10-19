# Multiple trips to a depot

Depots or fulfillment centers are a key component in industries like e-commerce, retail deliveries. They are critical for order processing, and storage of goods while helping businesses manage the inventory efficiently and ensure quick and accurate delivery to customers. In such operations, it is quite common for vehicles to make repeat trips to the depots throughout the day to pick-up inventory for the next round of deliveries. The repeated trips can be due to multiple reasons like limited number of vehicles or their limited capacity, incompatible types of goods or bulk orders among others.

NextBillion.ai’s Route Optimization API can easily model such an operation using its shipments property and generate an optimized route plan to complete all the deliveries across by making multiple trips back to a designated depot.

## Setup

In this example we will deliver 7 orders using a single 1 vehicle. Each shipment has to be picked from a given location (designated depot) and then delivered to its respective drop-off location. Also, the capacity of the available vehicle is such that it can’t accommodate more than 3 orders at a time.

Let’s configure the locations, shipments, and vehicles one by one in the following sections to model this business problem.

### Locations

First, we add all the location coordinates used in the problem to the `locations` object along with a valid `id`. The `locations` object used in this example:

```json
"locations": {
       "id": 1,
       "location": [
           "34.04118314,-118.24377960",
           "34.05248264,-118.25345384",
           "34.04890945,-118.25881547",
           "34.04456349,-118.26277841",
           "34.03674018,-118.25811613",
           "34.03374589,-118.25333728",
           "34.02959234,-118.24611074",
           "34.04736425,-118.23375569"
       ]
   }
```

### Shipments

Next, we define the 7 shipments in our problem statement. For each of these shipments, we add:

- A unique identifier for both steps
- Respective location index for both steps. Since we have all the pickups to be performed at the given depot, the location index for all pickup steps would be the same
- Service time to perform the pickup and delivery steps
- Quantities of the load to be delivered

Following is the JSON we use in this example:

```json
"shipments": [
       {
           "pickup": {
               "id": "Depot Pickup 1",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 1",
               "service": 300,
               "location_index": 1
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 2",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 2",
               "service": 300,
               "location_index": 2
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 3",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 3",
               "service": 300,
               "location_index": 3
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 4",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 4",
               "service": 300,
               "location_index": 4
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 5",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 5",
               "service": 300,
               "location_index": 5
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 6",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 6",
               "service": 300,
               "location_index": 6
           },
           "amount": [
               1
           ]
       },
       {
           "pickup": {
               "id": "Depot Pickup 7",
               "service": 300,
               "location_index": 0
           },
           "delivery": {
               "id": "Delivery 7",
               "service": 300,
               "location_index": 7
           },
           "amount": [
               1
           ]
       }
   ]
```

### Vehicles

Now we configure the delivery vehicle that will complete these shipments. For the given vehicle, we specify:

- A unique ID
- `start_index` & `end_index` to indicate the starting and ending locations of the route. We will configure both locations to be the same as the depot location.
- `capacity` of the vehicle

Once the vehicles and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
       {
           "id": 1,
           "start_index": 0,
           "end_index": 0,
           "capacity": [
               3
           ]
       }
   ]
```

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```json
{
  "description": "Multiple Trips to Depot",
  "locations": {
    "id": 1,
    "location": [
      "34.04118314,-118.24377960",
      "34.05248264,-118.25345384",
      "34.04890945,-118.25881547",
      "34.04456349,-118.26277841",
      "34.03674018,-118.25811613",
      "34.03374589,-118.25333728",
      "34.02959234,-118.24611074",
      "34.04736425,-118.23375569"
    ]
  },
  "shipments": [
    {
      "pickup": {
        "id": "Depot Pickup 1",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 1",
        "service": 300,
        "location_index": 1
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 2",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 2",
        "service": 300,
        "location_index": 2
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 3",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 3",
        "service": 300,
        "location_index": 3
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 4",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 4",
        "service": 300,
        "location_index": 4
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 5",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 5",
        "service": 300,
        "location_index": 5
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 6",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 6",
        "service": 300,
        "location_index": 6
      },
      "amount": [1]
    },
    {
      "pickup": {
        "id": "Depot Pickup 7",
        "service": 300,
        "location_index": 0
      },
      "delivery": {
        "id": "Delivery 7",
        "service": 300,
        "location_index": 7
      },
      "amount": [1]
    }
  ],
  "vehicles": [
    {
      "id": 1,
      "start_index": 0,
      "end_index": 0,
      "capacity": [3]
    }
  ]
}
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "9eb9904a8b5dbdfa7167dab60d00bbd9",
  "message": "Optimization job created",
  "status": "Ok",
  "warning": [
    "location_index[0] is used for both pickups/deliveries as well as vehicle start/end"
  ]
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=9eb9904a8b5dbdfa7167dab60d00bbd9&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Multiple Trips to Depot",
  "result": {
    "code": 0,
    "summary": {
      "cost": 2779,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 4200,
      "duration": 2779,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [7],
      "pickup": [7],
      "distance": 15391
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 2779,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "pickup",
            "arrival": 0,
            "duration": 0,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 5",
            "load": [1],
            "distance": 0,
            "internal_id": 3774417504,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "pickup",
            "arrival": 300,
            "duration": 0,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 4",
            "load": [2],
            "distance": 0,
            "internal_id": 3791195123,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "pickup",
            "arrival": 600,
            "duration": 0,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 7",
            "load": [3],
            "distance": 0,
            "internal_id": 3807972742,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "delivery",
            "arrival": 1210,
            "duration": 310,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04736425, -118.23375569],
            "location_index": 7,
            "id": "Delivery 7",
            "load": [2],
            "distance": 1569,
            "internal_id": 3739859560,
            "snapped_location": [34.04736, -118.2339]
          },
          {
            "type": "pickup",
            "arrival": 1825,
            "duration": 625,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 6",
            "load": [3],
            "distance": 3117,
            "internal_id": 3824750361,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "delivery",
            "arrival": 2389,
            "duration": 889,
            "service": 300,
            "waiting_time": 0,
            "location": [34.02959234, -118.24611074],
            "location_index": 6,
            "id": "Delivery 6",
            "load": [2],
            "distance": 4778,
            "internal_id": 3756637179,
            "snapped_location": [34.02958, -118.24608]
          },
          {
            "type": "delivery",
            "arrival": 3005,
            "duration": 1205,
            "service": 300,
            "waiting_time": 0,
            "location": [34.03674018, -118.25811613],
            "location_index": 4,
            "id": "Delivery 4",
            "load": [1],
            "distance": 7375,
            "internal_id": 3790192417,
            "snapped_location": [34.03679, -118.25807]
          },
          {
            "type": "delivery",
            "arrival": 3400,
            "duration": 1300,
            "service": 300,
            "waiting_time": 0,
            "location": [34.03374589, -118.25333728],
            "location_index": 5,
            "id": "Delivery 5",
            "load": [0],
            "distance": 7927,
            "internal_id": 3773414798,
            "snapped_location": [34.03373, -118.25335]
          },
          {
            "type": "pickup",
            "arrival": 3932,
            "duration": 1532,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 2",
            "load": [1],
            "distance": 9342,
            "internal_id": 3891860837,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "pickup",
            "arrival": 4232,
            "duration": 1532,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 3",
            "load": [2],
            "distance": 9342,
            "internal_id": 3875083218,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "pickup",
            "arrival": 4532,
            "duration": 1532,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "id": "Depot Pickup 1",
            "load": [3],
            "distance": 9342,
            "internal_id": 3841527980,
            "snapped_location": [34.04114, -118.2437]
          },
          {
            "type": "delivery",
            "arrival": 5252,
            "duration": 1952,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05248264, -118.25345384],
            "location_index": 1,
            "id": "Delivery 1",
            "load": [2],
            "distance": 11311,
            "internal_id": 3840525274,
            "snapped_location": [34.05248, -118.25344]
          },
          {
            "type": "delivery",
            "arrival": 5781,
            "duration": 2181,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04890945, -118.25881547],
            "location_index": 2,
            "id": "Delivery 2",
            "load": [1],
            "distance": 12337,
            "internal_id": 3823747655,
            "snapped_location": [34.0488, -118.25892]
          },
          {
            "type": "delivery",
            "arrival": 6219,
            "duration": 2319,
            "service": 300,
            "waiting_time": 0,
            "location": [34.04456349, -118.26277841],
            "location_index": 3,
            "id": "Delivery 3",
            "load": [0],
            "distance": 12944,
            "internal_id": 3806970036,
            "snapped_location": [34.04449, -118.26266]
          },
          {
            "type": "end",
            "arrival": 6979,
            "duration": 2779,
            "service": 0,
            "waiting_time": 0,
            "location": [34.04118314, -118.2437796],
            "location_index": 0,
            "load": [0],
            "distance": 15391,
            "snapped_location": [34.04114, -118.2437]
          }
        ],
        "service": 4200,
        "duration": 2779,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [7],
        "pickup": [7],
        "distance": 15391,
        "geometry": "<route_geometry>",
        "internal_id": 1
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![Route plan for vehicle making multiple trips to depot ](https://static.nextbillion.io/docs-next/docs/route-optimization/v2/multiple-trips-to-depot.webp)

## Analyzing the Solution

Looking at the result we can observe that:

- All task were fulfilled and the total cost of the solution is 2779
- Vehicle 1 makes multiple trips back to the depot location. After being loaded to full capacity at the start, the vehicle comes back to the depot to load goods another couple of times.

The above example exhibits how NextBillion.ai’s Route Optimization API models the conventional depot or a fulfillment center scenarios where the vehicles make multiple trips back to the center to complete all deliveries following an optimized route plan. We encourage you to go ahead and try out different configurations of vehicle capacities, delivery or pickup loads and explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
