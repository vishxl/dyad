# Max Ride Time

In certain industries like car-pooling and emergency services, reducing the amount of time spent in vehicles is a critical factor in assessing the competitive advantage of a business. Optimizing pickups and drop-offs such that the total time in the vehicle for the passengers or field service agents does not exceed a given threshold can be quite complex for traditional softwares. NextBillion.ai’s Route Optimization API provides this capability as an out of the box feature for shipments. `max_time_in_vehicle` allows users to configure the threshold for such tasks and the optimization engine then treats it as a hard filter while determining possible route plans.

Let’s take a look at the following example where we generate an optimized routing plan for a business which doesn’t want its shipments to stay in the vehicle for more than a specific amount of time.

## Setup

We have 4 shipments to be made using 2 delivery vans which start from a fixed, common location. Each of the shipments are configured to stay in the vehicle for a specific amount of time. Let’s configure the shipments, vehicles and location attributes one by one below.

### Locations

First, we define the `locations` object and add all the location coordinates used in the problem along with a valid `id`. The `locations` object used in this example:

```json
    "locations": {
        "id": 1,
        "location": [
            "34.06173622,-118.32402555",
            "34.06266790,-118.33873187",
            "34.06871599,-118.33873626",
            "34.06186820,-118.31180940",
            "34.06925486,-118.32394628",
            "34.07119806,-118.32022049",
            "34.07119806,-118.31263094",
            "34.05908092,-118.33498563",
            "34.05725176,-118.33967735"
        ]
    }
```

### Shipments

Next, we define the 4 shipments in our problem statement. For each shipment we add:

- Details of pickup leg along with a unique identifier
- Details of delivery leg using the same unique identifier as the corresponding pickup leg
- `amount` or the quantity of the items/goods to be shipped
- `max_time_in_vehicle` limiting the time for which the shipment can stay in the van. For one of the shipments, we will deliberately give a duration which is not enough to complete the delivery after starting from the corresponding pickup location.

Following is the JSON we use in this example:

```json
    "shipments": [
        {
            "pickup": {
                "id": "Shipment 1",
                "location_index": 0,
                "service": 300
            },
            "delivery": {
                "id": "Shipment 1",
                "location_index": 1,
                "service": 300
            },
            "amount": [
                5
            ],
            "max_time_in_vehicle": 600
        },
        {
            "pickup": {
                "id": "Shipment 2",
                "location_index": 2,
                "service": 180
            },
            "delivery": {
                "id": "Shipment 2",
                "location_index": 3,
                "service": 120
            },
            "amount": [
                2
            ],
            "max_time_in_vehicle": 900
        },
        {
            "pickup": {
                "id": "Shipment 3",
                "location_index": 4,
                "service": 240
            },
            "delivery": {
                "id": "Shipment 3",
                "location_index": 5,
                "service": 240
            },
            "amount": [
                4
            ],
            "max_time_in_vehicle": 900
        },
        {
            "pickup": {
                "id": "Shipment 4",
                "location_index": 6,
                "service": 120
            },
            "delivery": {
                "id": "Shipment 4",
                "location_index": 7,
                "service": 120
            },
            "amount": [
                1
            ],
            "max_time_in_vehicle": 240
        }
    ]
```

### Vehicles

Now we configure 2 delivery vans that will be responsible for fulfilling the shipments. We specify:

- A unique ID for each vehicle
- `start_index` to denote the common start location for both vehicles
- `capacity` to indicate the amount of load that can be carried

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
      {
          "id": "Vehicle 1",
          "start_index": 8,
          "capacity": [15]
      },
      {
          "id": "Vehicle 2",
          "start_index": 8,
          "capacity": [15]
      }
 ]
```

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Max Ride Time Example",
   "locations": {
       "id": 1,
       "location": ["34.06173622,-118.32402555","34.06266790,-118.33873187","34.06871599,-118.33873626","34.06186820,-118.31180940","34.06925486,-118.32394628","34.07119806,-118.32022049","34.07119806,-118.31263094","34.05908092,-118.33498563","34.05725176,-118.33967735"]
   },
   "shipments": [
       {
           "pickup":{
            "id": "Shipment 1",
            "location_index": 0,
            "service": 300
           },
           "delivery": {
            "id": "Shipment 1",
            "location_index": 1,
            "service": 300
           },
           "amount":[5],
           "max_time_in_vehicle":600
       },
       {
           "pickup":{
            "id": "Shipment 2",
            "location_index": 2,
            "service": 180
           },
           "delivery": {
            "id": "Shipment 2",
            "location_index": 3,
            "service": 120
           },
           "amount":[2],
           "max_time_in_vehicle":900
       },
       {
           "pickup":{
            "id": "Shipment 3",
            "location_index": 4,
            "service": 240
           },
           "delivery": {
            "id": "Shipment 3",
            "location_index": 5,
            "service": 240
           },
           "amount":[4],
           "max_time_in_vehicle":900
       },
       {
           "pickup":{
            "id": "Shipment 4",
            "location_index": 6,
            "service": 120
           },
           "delivery": {
            "id": "Shipment 4",
            "location_index": 7,
            "service": 120
           },
           "amount":[1],
           "max_time_in_vehicle":240
       }
   ],
   "vehicles": [
       {
           "id": "Vehicle 1",
           "start_index": 8,
           "capacity": [15]
       },
       {
           "id": "Vehicle 2",
           "start_index": 8,
           "capacity": [15]
       }
  ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "b7dcdb3161c74980423f10c16127e75b",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=b7dcdb3161c74980423f10c16127e75b
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Max Ride Time Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1061,
      "routes": 1,
      "unassigned": 2,
      "setup": 0,
      "service": 1380,
      "duration": 1061,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [11],
      "pickup": [11],
      "distance": 10066
    },
    "unassigned": [
      {
        "id": "Shipment 4",
        "type": "pickup",
        "location": [34.07119806, -118.31263094],
        "reason": "MaxTimeInVehicleConstraint"
      },
      {
        "id": "Shipment 4",
        "type": "delivery",
        "location": [34.05908092, -118.33498563],
        "reason": "MaxTimeInVehicleConstraint"
      }
    ],
    "routes": [
      {
        "vehicle": "Vehicle 2",
        "cost": 1061,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05725176, -118.33967735],
            "location_index": 8,
            "load": [0],
            "distance": 0,
            "snapped_location": [34.05707, -118.33968]
          },
          {
            "type": "pickup",
            "arrival": 171,
            "duration": 171,
            "service": 300,
            "waiting_time": 0,
            "location": [34.06173622, -118.32402555],
            "location_index": 0,
            "id": "Shipment 1",
            "load": [5],
            "distance": 1909,
            "internal_id": 1244193496,
            "snapped_location": [34.06176, -118.32412]
          },
          {
            "type": "pickup",
            "arrival": 701,
            "duration": 401,
            "service": 180,
            "waiting_time": 0,
            "location": [34.06871599, -118.33873626],
            "location_index": 2,
            "id": "Shipment 2",
            "load": [7],
            "distance": 4034,
            "internal_id": 1294526353,
            "snapped_location": [34.06872, -118.33862]
          },
          {
            "type": "delivery",
            "arrival": 941,
            "duration": 461,
            "service": 300,
            "waiting_time": 0,
            "location": [34.0626679, -118.33873187],
            "location_index": 1,
            "id": "Shipment 1",
            "load": [2],
            "distance": 4704,
            "internal_id": 1244193496,
            "snapped_location": [34.06267, -118.33861]
          },
          {
            "type": "delivery",
            "arrival": 1476,
            "duration": 696,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0618682, -118.3118094],
            "location_index": 3,
            "id": "Shipment 2",
            "load": [0],
            "distance": 7234,
            "internal_id": 1294526353,
            "snapped_location": [34.0617, -118.31181]
          },
          {
            "type": "pickup",
            "arrival": 1872,
            "duration": 972,
            "service": 240,
            "waiting_time": 0,
            "location": [34.06925486, -118.32394628],
            "location_index": 4,
            "id": "Shipment 3",
            "load": [4],
            "distance": 9518,
            "internal_id": 1277748734,
            "snapped_location": [34.06937, -118.32367]
          },
          {
            "type": "delivery",
            "arrival": 2201,
            "duration": 1061,
            "service": 240,
            "waiting_time": 0,
            "location": [34.07119806, -118.32022049],
            "location_index": 5,
            "id": "Shipment 3",
            "load": [0],
            "distance": 10066,
            "internal_id": 1277748734,
            "snapped_location": [34.07128, -118.32021]
          },
          {
            "type": "end",
            "arrival": 2441,
            "duration": 1061,
            "service": 0,
            "waiting_time": 0,
            "location": [34.07119806, -118.32022049],
            "location_index": 5,
            "load": [0],
            "distance": 10066,
            "snapped_location": [34.07128, -118.32021]
          }
        ],
        "service": 1380,
        "duration": 1061,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [11],
        "pickup": [11],
        "distance": 10066,
        "geometry": "uwznE~ehqU?ZAb@a@Ii@MWG[IkA[cA[]Ia@Ma@MuCy@kBg@e@Mc@MmCu@]Kq@Uu@UEEEEMm@?_@?g@@aA@qB@yB@cB@s@?[?M?c@@o@@wA?w@@}@@cA@_B?U?Q?w@BuB@cB?m@?_@@g@?]?cA@a@?sA@iA@kA?Q?U@oA?e@?U?k@@W?O?q@?e@@S@aC@qA?M?M@_A@o@?c@?m@@iA@q@B?B?FBGCC?C?Ap@AhA?l@?b@An@A~@?L?LApAA`CAR?d@?p@?NAV?j@?T?d@AnA?T?PAjAAhA?rAA`@?bA?\\Af@?^?l@AbBCtB?v@?P?TA~AAbAA|@?v@AvAAn@?b@?L?ZAr@AbBAxBApBA`A?f@?^Ad@A|AE?M@QIM?O@O?}@@mB?cAAoC@w@?c@?c@@mB@Q?gE?_@?_@?_D?cAAkB@a@??V`@AB?B?b@?v@?hF@b@?X?xE?pBAb@?^AnA?bC?hD?^?B?J?N?LAPALANKLAD?@}A@e@?_@?g@@aA@qB@yB@cB@s@?[?M?c@@o@@wA?w@@}@@cA@_B?U?Q?w@BuB@cB?m@?_@@g@?]?cA@a@?sA@iA@kA?Q?U@oA?e@?U?k@@W?O?q@?e@@S@aC@qA?M?M@_A@o@?c@?m@@iA@q@@yB?M?c@@mABoB@_A@mBByC@kA?}@@{@?Y@iA@gA?I?q@?c@@c@?g@?K?I?M?i@@e@?_C?eC?c@@uBA_@?i@?g@?]?gA?a@?g@@O?K?SHS?M?a@?eA?QAiC?G?KIQ?W?VIR?|C?rA?T?L@JHT?R?JAN?f@?`@?fA?\\?f@?h@@^E?E?_ADg@BO@U@K@}BHKp@?BERCJCLIZAHCPENCTAHGb@ANCf@An@?`C?\\Ah@?jAAfAAb@AxAAzAE`HE`HuI@kJ@iG@iA?U??j@?X?`@?h@eA?UIyF@s@?i@@?P`E?tC@FELGdA??i@?a@?Y?k@?y@?g@?eC?{@MASAUC_AQgDaAgA_@a@QQIMIIKIIW]B_@??",
        "internal_id": 571251357
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/max-ride-time.webp)

## Analyzing the Solution

Looking at the result we can observe that:

- 3 shipments (i.e. 6 tasks) were fulfilled and one shipment (i.e. 2 tasks) remained unassigned. The total cost of the solution is 1061.
- Only 1 vehicle was used to fulfill all shipments
- The Shipment 1 was delivered with 290 seconds, Shipment 2 with 294 seconds and Shipment 3 with 89 seconds of drive time. Hence, all shipments met the max ride time criteria specified for each of them.
- Shipment 4 could not be completed as the minimum drive time needed to go from its pickup location to delivery location is around 330 seconds and the max ride time configured for it was only 240 seconds.
- Under `unassigned` attribute, the response also shares the reason why the two legs of shipment 4 remained unfulfilled. It was because of _“MaxTimeInVehicleConstraint”_, indicating that the max ride time constraint was the culprit.

Above example exhibits how NextBillion.ai’s Route Optimization API uses the max ride time constraints to solve the problem and suggests the most optimized route plan. We encourage you to go ahead and try out different configurations of `max_time_in_vehicle`, and multiple distribution of shipments to explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the [other powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
