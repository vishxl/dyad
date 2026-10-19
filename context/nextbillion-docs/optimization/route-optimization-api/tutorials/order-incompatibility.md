# Order Incompatibility

An important business criteria for logistics providers is handling the cargo safely which can sometimes entail not mixing cargo of certain types when transporting them. Order Incompatibility feature of NextBillion.ai’s Route Optimization is designed to efficiently solve such cases involving multiple types of loads. Once the load types of each pickup/delivery are configured along with the information about incompatible load types, the optimization engine suggests a route plan in which vehicles carrying a particular load type will not be assigned to fulfill another pickup/delivery involving an incompatible load type.

Let’s take a look at the following example where we generate an optimized routing plan for a business which manages deliveries involving different types of cargo and some of them are incompatible with each other.

## Setup

We have 8 deliveries to be made using 3 vehicles which start from a fixed depot location. Each of the deliveries have a load type and accompanying incompatible load types. Let’s configure the jobs, vehicles and location attributes one by one below.

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

### Jobs

Next, we define the 8 delivery jobs in our problem statement. For each delivery we add:

- A unique identifier
- Location index
- Load type and the corresponding incompatible load type(s)
- Delivery quantities

Following is the JSON we use in this example:

```json

"jobs": [
      {
          "id": "Delivery 1",
          "location_index": 1,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["materials"],
          "incompatible_load_types":["groceries", "fragile"]
      },
      {
          "id": "Delivery 2",
          "location_index": 2,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["groceries"],
          "incompatible_load_types":["materials", "fragile"]
      },
      {
          "id": "Delivery 3",
          "location_index": 3,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["fragile"],
          "incompatible_load_types":["materials", "groceries"]
      },
      {
          "id": "Delivery 4",
          "location_index": 4,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["dairy"]
      },
      {
          "id": "Delivery 5",
          "location_index": 5,
          "service": 300,
          "delivery": [
              1
          ],
          "incompatible_load_types":["materials", "paper"]
      },
      {
          "id": "Delivery 6",
          "location_index": 6,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["groceries"]
      },
      {
          "id": "Delivery 7",
          "location_index": 7,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["fragile"]
      },
      {
          "id": "Delivery 8",
          "location_index": 8,
          "service": 300,
          "delivery": [
              1
          ],
          "load_types":["materials"]
      }
  ]
```

### Vehicles

Now we configure 3 delivery vans that will be responsible for fulfilling the tasks. We specify:

- A unique ID for each vehicle
- `start_index` to denote the depot location from where all vehicles start with right cargo loaded on them for deliveries
- `capacity` to indicate the amount of load that can be carried

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
"vehicles": [
      {
          "id": "Vehicle 1",
           "start_index": 0,
          "capacity": [10]
      },
      {
          "id": "Vehicle 2",
           "start_index": 0,
          "capacity": [10]
      },
      {
          "id": "Vehicle 3",
           "start_index": 0,
          "capacity": [10]
      }
 ]
```

## Optimization POST Request

When all the above components are put together we get the final POST request that we will submit to the optimizer.

```bash
curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
   "description": "Order Incompatibility Example",
   "locations": {
       "id": 1,
       "location": ["34.06173622,-118.32402555","34.06266790,-118.33873187","34.06871599,-118.33873626","34.06186820,-118.31180940","34.06925486,-118.32394628","34.07119806,-118.32022049","34.07119806,-118.31263094","34.05908092,-118.33498563","34.05725176,-118.33967735"]
   },
   "jobs": [
       {
           "id": "Delivery 1",
           "location_index": 1,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["materials"],
           "incompatible_load_types":["groceries", "fragile"]
       },
       {
           "id": "Delivery 2",
           "location_index": 2,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["groceries"],
           "incompatible_load_types":["materials", "fragile"]
       },
       {
           "id": "Delivery 3",
           "location_index": 3,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["fragile"],
           "incompatible_load_types":["materials", "groceries"]
       },
       {
           "id": "Delivery 4",
           "location_index": 4,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["dairy"]
       },
       {
           "id": "Delivery 5",
           "location_index": 5,
           "service": 300,
           "delivery": [
               1
           ],
           "incompatible_load_types":["materials", "paper"]
       },
       {
           "id": "Delivery 6",
           "location_index": 6,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["groceries"]
       },
       {
           "id": "Delivery 7",
           "location_index": 7,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["fragile"]
       },
       {
           "id": "Delivery 8",
           "location_index": 8,
           "service": 300,
           "delivery": [
               1
           ],
           "load_types":["materials"]
       }
   ],
   "vehicles": [
       {
           "id": "Vehicle 1",
            "start_index": 0,
           "capacity": [10]
       },
       {
           "id": "Vehicle 2",
            "start_index": 0,
           "capacity": [10]
       },
       {
           "id": "Vehicle 3",
            "start_index": 0,
           "capacity": [10]
       }
  ]
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "11a74d5345bc13693a9e8d6dd3ef6aea",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We use the request ID and retrieve the result through the Optimization GET request. Following is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=11a74d5345bc13693a9e8d6dd3ef6aea
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Order Incompatibility Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1165,
      "routes": 3,
      "unassigned": 0,
      "setup": 0,
      "service": 2400,
      "duration": 1165,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [8],
      "pickup": [0],
      "distance": 10389
    },
    "routes": [
      {
        "vehicle": "Vehicle 2",
        "cost": 336,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06173622, -118.32402555],
            "location_index": 0,
            "load": [2],
            "distance": 0,
            "snapped_location": [34.06176, -118.32412]
          },
          {
            "type": "job",
            "arrival": 104,
            "duration": 104,
            "service": 300,
            "waiting_time": 0,
            "location": [34.0618682, -118.3118094],
            "location_index": 3,
            "id": "Delivery 3",
            "load": [1],
            "distance": 1147,
            "internal_id": 3806970036,
            "snapped_location": [34.0617, -118.31181]
          },
          {
            "type": "job",
            "arrival": 636,
            "duration": 336,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05908092, -118.33498563],
            "location_index": 7,
            "id": "Delivery 7",
            "load": [0],
            "distance": 3534,
            "internal_id": 3739859560,
            "snapped_location": [34.05918, -118.33499]
          },
          {
            "type": "end",
            "arrival": 936,
            "duration": 336,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05908092, -118.33498563],
            "location_index": 7,
            "load": [0],
            "distance": 3534,
            "snapped_location": [34.05918, -118.33499]
          }
        ],
        "service": 600,
        "duration": 336,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [0],
        "distance": 3534,
        "geometry": "_u{nEvdeqUGCC?C?@yB?M?c@@mABoB@_A@mBByC@kA?}@@{@?Y@iA@gA?I?q@?c@@c@?g@?K?I?M?i@@e@?_C?eC?c@@uBA_@?i@?g@?]?gA?a@?g@@O?K?SHS?M?a@?eA?QAiC?G?KIQ?W?VIR?|C?rA?T?L@JHT?R?JAN?f@?`@?fA?\\?f@?h@@^AtB?b@?dC?~BAd@?h@?L?H?J?f@Ab@?b@?p@?HAfAAhA?XAz@?|@AjACxCAlBA~@CnBAlA?b@?LAxBAp@AhA?l@?b@An@A~@?L?LApAA`CAR?d@?p@?NAV?j@?T?d@AnA?T?PAjAAhA?rAA`@?bA?\\Af@?^?l@AbBPJ^PPFRDVJZJXHb@Jf@NzAd@fFxAHB^JAd@Ah@A`@?ZARARAXCTCNU`BEd@?^??",
        "internal_id": 571251357
      },
      {
        "vehicle": "Vehicle 3",
        "cost": 268,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06173622, -118.32402555],
            "location_index": 0,
            "load": [2],
            "distance": 0,
            "snapped_location": [34.06176, -118.32412]
          },
          {
            "type": "job",
            "arrival": 178,
            "duration": 178,
            "service": 300,
            "waiting_time": 0,
            "location": [34.0626679, -118.33873187],
            "location_index": 1,
            "id": "Delivery 1",
            "load": [1],
            "distance": 1452,
            "internal_id": 3840525274,
            "snapped_location": [34.06267, -118.33861]
          },
          {
            "type": "job",
            "arrival": 568,
            "duration": 268,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05725176, -118.33967735],
            "location_index": 8,
            "id": "Delivery 8",
            "load": [0],
            "distance": 2128,
            "internal_id": 3723081941,
            "snapped_location": [34.05707, -118.33968]
          },
          {
            "type": "end",
            "arrival": 868,
            "duration": 268,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05725176, -118.33967735],
            "location_index": 8,
            "load": [0],
            "distance": 2128,
            "snapped_location": [34.05707, -118.33968]
          }
        ],
        "service": 600,
        "duration": 268,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [2],
        "pickup": [0],
        "distance": 2128,
        "geometry": "_u{nEvdeqUGCC?C?Ap@AhA?l@?b@An@A~@?L?LApAA`CAR?d@?p@?NAV?j@?T?d@AnA?T?PAjAAhA?rAA`@?bA?\\Af@?^?l@AbBCtB?v@?P?TA~AAbAA|@?v@AvAAn@?b@?L?ZAr@AbBAxBApBA`A?f@?^Ad@A|AE?M@QIM?O@O?}@@?V^?B?J?N?LAPALANKLAD?VILEB?FCJELAJAHAJ@V?\\JlCt@b@Ld@LjBf@tCx@`@L`@L\\HbAZjAZZHVFh@L`@H@c@?[??",
        "internal_id": 554473738
      },
      {
        "vehicle": "Vehicle 1",
        "cost": 561,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06173622, -118.32402555],
            "location_index": 0,
            "load": [4],
            "distance": 0,
            "snapped_location": [34.06176, -118.32412]
          },
          {
            "type": "job",
            "arrival": 231,
            "duration": 231,
            "service": 300,
            "waiting_time": 0,
            "location": [34.07119806, -118.31263094],
            "location_index": 6,
            "id": "Delivery 6",
            "load": [3],
            "distance": 2048,
            "internal_id": 3756637179,
            "snapped_location": [34.07113, -118.31263]
          },
          {
            "type": "job",
            "arrival": 630,
            "duration": 330,
            "service": 300,
            "waiting_time": 0,
            "location": [34.07119806, -118.32022049],
            "location_index": 5,
            "id": "Delivery 5",
            "load": [2],
            "distance": 2751,
            "internal_id": 3773414798,
            "snapped_location": [34.07128, -118.32021]
          },
          {
            "type": "job",
            "arrival": 1000,
            "duration": 400,
            "service": 300,
            "waiting_time": 0,
            "location": [34.06925486, -118.32394628],
            "location_index": 4,
            "id": "Delivery 4",
            "load": [1],
            "distance": 3275,
            "internal_id": 3790192417,
            "snapped_location": [34.06937, -118.32367]
          },
          {
            "type": "job",
            "arrival": 1461,
            "duration": 561,
            "service": 300,
            "waiting_time": 0,
            "location": [34.06871599, -118.33873626],
            "location_index": 2,
            "id": "Delivery 2",
            "load": [0],
            "distance": 4727,
            "internal_id": 3823747655,
            "snapped_location": [34.06872, -118.33862]
          },
          {
            "type": "end",
            "arrival": 1761,
            "duration": 561,
            "service": 0,
            "waiting_time": 0,
            "location": [34.06871599, -118.33873626],
            "location_index": 2,
            "load": [0],
            "distance": 4727,
            "snapped_location": [34.06872, -118.33862]
          }
        ],
        "service": 1200,
        "duration": 561,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [4],
        "pickup": [0],
        "distance": 4727,
        "geometry": "_u{nEvdeqUGCC?C?@yB?M?c@@mAU@cA@U?uF?uI@kJ@iG@iA?U?OAYEa@Ig@OcDiAk@Uk@UmAk@OWMYCKEWAi@@kABa@D[Dk@Do@@y@E{@Eg@AWA_@@}@B_A@GL]Nm@Ba@?oCAcH@uE?kA?MAS?{@@oA?_B?m@?l@?~AAnA?z@@R?L?jAAtE@bH?nCC`@Ol@M\\AFC~@A|@@^@VDf@Dz@Ax@ANC^Ej@EZC`@AjA@h@DVBJLXNVJpB?xAAbC?P`E?tC@FELGdA??`A?R?T?P?Z?pA?b@?L?p@?R?f@?z@?`A?~@@b@?`@?d@?j@?p@?j@?^?|@?\\?D?^?d@?f@?Z?`@?lA?f@@zA?|B?fB?x@?fA?lA?xA?R@bB?j@?b@?j@?^?nA?lA?h@?dA?d@?b@?bC?b@@l@?n@?V?R?L?j@?P?V?b@?h@?V`@AB???",
        "internal_id": 520918500
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

Following image shows a visual representation of the above route plan.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/order-incompatibility.webp)

## Analyzing the Solution

Looking at the result we can observe that:

- All task were fulfilled and the total cost of the solution is 1165
- All 3 vehicles were used to cater to different load compatibility constraints of the items to be delivered
- Vehicle 1 caters to deliveries involving “groceries” & “dairy” type items, vehicle 2 caters to “fragile” type and vehicle 3 caters to “materials” type items.
- The Delivery tasks 6, 7, 8 do not mention the incompatible types but were still grouped with other deliveries which shared their “load_types”.
- We can also observe that “Delivery 4” was not configured with a load type, instead only the incompatible load types were provided. Consequently, it was fulfilled by a vehicle which did not fulfill deliveries involving the incompatible load types, which in this case is, Vehicle 1.

The above example exhibits how NextBillion.ai’s Route Optimization API uses the order incompatibility configurations to solve the problem and suggests the optimized route plan. We encourage you to go ahead and try out different configurations of load types, and varying distribution of delivery / pickup tasks to explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the [other powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
