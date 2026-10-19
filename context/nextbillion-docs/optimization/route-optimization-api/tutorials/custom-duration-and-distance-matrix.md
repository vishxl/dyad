# Custom Duration & Distance Matrix

Users can leverage the modular nature of NextBillion.ai’s Route Optimization by configuring custom distance values when a vehicle goes from one location to another. These values then override the distances suggested by the optimization engine and are used for all distance related calculations during the process. Custom distance and duration matrices give the users a strong control over the routes that the algorithm prefers eventually in the final solution. Consequently, optimization engine’s modular implementation allows users to modify its algorithm to achieve a fairly customized solution, fulfilling even some niche business objectives. In the following example we will take a set of locations, tasks and a vehicle to bring out the impact of this powerful feature.

## Setup

We will take a set of 3 delivery tasks and a single vehicle to fulfill them. We also provide the custom distance and duration matrices and set some We will define the locations, jobs, vehicles, custom distance and duration matrix and options attributes one by one.

### Locations

We start by adding all the delivery locations as well as the vehicle’s starting position.

```json
    "locations": {
        "id": 1,
        "location": [
            "33.9257000241,-118.05427619934",
            "33.90917560312,-118.14491340637",
            "34.0628996039,-117.91557380676",
            "33.93652463118,-118.09616157532"
        ]
    }
```

### Jobs

Next we configure each of the 4 delivery tasks. For each task we add:

- A unique identifier
- Location index
- Delivery quantity
- A time window within which the delivery is to be completed
- A service time to carry out the delivery

Following is the `jobs` JSON used in the example

```json
    "jobs": [
        {
            "id": 1,
            "location_index": 0,
            "service": 180,
            "delivery": [
                1
            ],
            "time_windows": [
                [
                    1718812800,
                    1718814600
                ]
            ]
        },
        {
            "id": 2,
            "location_index": 1,
            "service": 180,
            "delivery": [
                1
            ],
            "time_windows": [
                [
                    1718814900,
                    1718816700
                ]
            ]
        },
        {
            "id": 3,
            "location_index": 2,
            "service": 10,
            "delivery": [
                1
            ],
            "time_windows": [
                [
                    1718817000,
                    1718818800
                ]
            ]
        }
    ]
```

### Vehicles

Next, we add the details of the vehicle that will be responsible for fulfilling these deliveries. For the vehicle we specify:

- A unique ID
- `start_index` to denote the point from which the vehicle starts its trip.
- `capacity` of the vehicle

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
       {
           "id": "Vehicle 1",
           "start_index": 3,
           "capacity": [10]
       }
   ]
```

### Custom Distance Matrix

Next we come to the custom distance matrix attribute where we provide the distances, in meters, for traveling from one location to all the others. Consequently, the resultant matrix would always be a N X N two-dimensional matrix where N is the total number of unique location coordinates involved in the problem.

For this example, we are going to provide the following 4 X 4 distance matrix

| Distance (m)               | Delivery 1 | Delivery 2 | Delivery 3 | Vehicle start location |
| -------------------------- | ---------- | ---------- | ---------- | ---------------------- |
| **Delivery 1**             | 0          | 12300      | 31800      | 5800                   |
| **Delivery 2**             | 13500      | 0          | 34800      | 7200                   |
| **Delivery 3**             | 24900      | 33600      | 0          | 27200                  |
| **Vehicle start location** | 5200       | 8200       | 29100      | 0                      |

We use the above matrix represented as a JSON object in our input request:

```json
"distance_matrix": [
       [0, 12300, 31800, 5800],
       [13500, 0, 34800, 7200],
       [24900, 33600, 0, 27200],
       [5200, 8200, 29100, 0]
   ]
```

Users can provide any values which they believe to be closer to actual driving distances or just about any random values which helps them achieve a given business goal.

### Custom Duration Matrix

Next we would configure the duration matrix to go along with the custom distance matrix. It is worth highlighting that the distance matrix is only used for driving distance calculations and determining the solution costs when travel_cost = distance or control the vehicle’s behavior if the “max_distance” constraints are defined. However, the duration matrix is integral as it is used to determine driving time between locations and the consequent “time_windows” implications which is critical in accepting and rejecting the potential solutions.

Like the distance matrix, the duration matrix is also a N X N two-dimensional matrix of time values, in seconds, where N is the number of unique locations involved in the problem.

For this example, we are going to provide the following 4 X 4 duration matrix.

| Duration (s)               | Delivery 1 | Delivery 2 | Delivery 3 | Vehicle start location |
| -------------------------- | ---------- | ---------- | ---------- | ---------------------- |
| **Delivery 1**             | 0          | 1450       | 2100       | 1050                   |
| **Delivery 2**             | 1400       | 0          | 1950       | 850                    |
| **Delivery 3**             | 2450       | 2750       | 0          | 2400                   |
| **Vehicle start location** | 900        | 1000       | 1750       | 0                      |

We use the above matrix represented as a JSON object in our input request:

```json
"duration_matrix": [
       [0, 1450, 2100, 1050],
       [1400, 0, 1950, 850],
       [2450, 2750, 0, 2400],
       [900, 1000, 1750, 0]
   ]
```

Like the distance matrix, the values provided to the duration matrix can be anything that users believe to be closer to actual drive times or any other values which help them achieve specific business operation goals.

### Options

For this example, we will go for minimizing the distance as the optimization objective. Following is the JSON to configure this objective:

```json

"options":{
       "objective":{
           "travel_cost":"distance"
           }
   }
```

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "description": "Custom Distance & Duration Matrix Example",
    "locations": {
        "id": 1,
        "location": [
            "33.9257000241,-118.05427619934",
            "33.90917560312,-118.14491340637",
            "34.0628996039,-117.91557380676",
            "33.93652463118,-118.09616157532"
        ]
    },
    "jobs": [
        {
            "id": 1,
            "location_index": 0,
            "service": 180,
            "delivery": [1],
            "time_windows":[
                [1718812800,1718814600]
                ]
        },
        {
            "id": 2,
            "location_index": 1,
            "service": 180,
            "delivery": [1],
            "time_windows":[
                [1718814900,1718816700]
                ]
        },
        {
            "id": 3,
            "location_index": 2,
            "service": 10,
            "delivery": [1],
            "time_windows":[
                [1718817000,1718818800]
                ]
        }
    ],
    "vehicles": [
        {
            "id": "Vehicle 1",
            "start_index": 3,
            "capacity": [10]
        }
    ],
    "distance_matrix":[
        [0, 12300, 31800, 5800],
        [13500, 0, 34800, 7200],
        [24900, 33600, 0, 27200],
        [5200, 8200, 29100, 0]
    ],
    "duration_matrix":[
        [0, 1450, 2100, 1050],
        [1400, 0, 1950, 850],
        [2450, 2750, 0, 2400],
        [900, 1000, 1750, 0]
    ],
    "options":{
        "objective":{
            "travel_cost":"distance"
            }
    }
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```bash
{
"id": "8211f16d7da940da54a255c91a4b3bc9",
"message": "Optimization job created",
"status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=8211f16d7da940da54a255c91a4b3bc9
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Custom Distance & Duration Matrix Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 52300,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 370,
      "duration": 4300,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [3],
      "pickup": [0],
      "distance": 0
    },
    "routes": [
      {
        "vehicle": "Vehicle 1",
        "cost": 52300,
        "steps": [
          {
            "type": "start",
            "arrival": 1718812370,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.93652463118, -118.09616157532],
            "location_index": 3,
            "load": [3]
          },
          {
            "type": "job",
            "arrival": 1718813270,
            "duration": 900,
            "service": 180,
            "waiting_time": 0,
            "location": [33.9257000241, -118.05427619934],
            "location_index": 0,
            "id": 1,
            "load": [2],
            "distance": 5200,
            "internal_id": 1
          },
          {
            "type": "job",
            "arrival": 1718814900,
            "duration": 2350,
            "service": 180,
            "waiting_time": 0,
            "location": [33.90917560312, -118.14491340637],
            "location_index": 1,
            "id": 2,
            "load": [1],
            "distance": 17500,
            "internal_id": 2
          },
          {
            "type": "job",
            "arrival": 1718817030,
            "duration": 4300,
            "service": 10,
            "waiting_time": 0,
            "location": [34.0628996039, -117.91557380676],
            "location_index": 2,
            "id": 3,
            "load": [0],
            "distance": 52300,
            "internal_id": 3
          },
          {
            "type": "end",
            "arrival": 1718817040,
            "duration": 4300,
            "service": 0,
            "waiting_time": 0,
            "location": [34.0628996039, -117.91557380676],
            "location_index": 2,
            "load": [0],
            "distance": 52300
          }
        ],
        "service": 370,
        "duration": 4300,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [3],
        "pickup": [0],
        "distance": 52300,
        "geometry": null,
        "internal_id": 520918500
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- All tasks were assigned using the available vehicle with a total cost of 52300.
- We can also see that the duration values and distance values used for calculating the duration and distance fields is from the respective custom matrices that were provided in the input

Above solution shows how NextBillion.ai’s Route Optimization API is highly modular in its approach and can be plugged-in easily into current processes or traditional solutions to improve upon existing optimization techniques. We encourage you to go ahead and try out different values of distance and duration matrices, for different configurations of vehicles and task locations to explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api/tutorials) and the related use cases that Route Optimization API can solve for you.
