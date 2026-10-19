# Order Grouping

NextBillion.ai’s Route Optimization API offers a simple but useful feature, called order grouping, that enhances the driver experience by conveniently planning a common stop for multiple tasks located closeby. Users can configure a diameter which will be used to group all tasks falling within the given range and treat them as a single stop. For scenarios involving multiple tasks in a condo, or in a building, or a housing complex, users can utilize this feature to resolve all such locations to a single stop saving time and driver’s effort to park the vehicle at multiple stops. Let’s build an example to implement this feature

## Setup

We have a total of 5 delivery jobs out of which 3 are located quite close to each other. We will use a single vehicle to fulfill all these deliveries. Locations We will start by adding all the `locations` used in the problem along with a valid `id`. The `locations` object with all the coordinates used in this example:

```json
    "locations": {
        "id": 1,
        "location": [
            "34.05083235,-118.24521687",
            "34.05062229,-118.24520506",
            "34.05056751,-118.24565383",
            "34.05635229,-118.25009887",
            "34.03314553,-118.25960305",
            "34.00915715,-118.26492807"
        ]
    }
```

### Jobs

Next we define 5 delivery jobs by specifying:

- A unique identifier for each task
- Location indexes for each task
- Delivery quantities for each task
- Service time for each task

Let’s take a look at the `jobs` JSON after the above properties are configured:

```json
"jobs": [
      {
          "id": "Delivery 1",
          "location_index": 0,
          "service": 300,
          "delivery": [
              5
          ]
      },
      {
          "id": "Delivery 2",
          "location_index": 1,
          "service": 300,
          "delivery": [
              3
          ]
      },
      {
          "id": "Delivery 3",
          "location_index": 2,
          "service": 300,
          "delivery": [
              3
          ]
      },
      {
          "id": "Delivery 4",
          "location_index": 3,
          "service": 300,
          "delivery": [
              5
          ]
      },
      {
          "id": "Delivery 5",
          "location_index": 4,
          "service": 300,
          "delivery": [
              5
          ]
      }
  ]
```

### Vehicles

Next, we add the details of the vehicles that will be responsible for fulfilling the tasks. We configure:

- A unique ID
- Vehicle’s capacity
- Start_index to denote the point from where the vehicle would start.

Following is the vehicle JSON that is used:

```json
"vehicles": [
      {
          "id": 1,
           "start_index": 5,
          "capacity": [
              25
          ]
      }
 ]
```

### Options

And lastly, we configure the criteria to group the tasks that are close by. For our example, we specify a diameter of 200 meters to group any tasks located close to each other :

```json
"options":{
   "grouping":{
       "order_grouping":{
           "grouping_diameter":200
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
   "description": "Order Grouping Example",
   "locations": {
       "id": 1,
       "location": ["34.05083235,-118.24521687","34.05062229,-118.24520506","34.05056751,-118.24565383","34.05635229,-118.25009887","34.03314553,-118.25960305","34.00915715,-118.26492807"]
   },
   "jobs": [
       {
           "id": "Delivery 1",
           "location_index": 0,
           "service": 300,
           "delivery": [
               5
           ]
       },
       {
           "id": "Delivery 2",
           "location_index": 1,
           "service": 300,
           "delivery": [
               3
           ]
       },
       {
           "id": "Delivery 3",
           "location_index": 2,
           "service": 300,
           "delivery": [
               3
           ]
       },
       {
           "id": "Delivery 4",
           "location_index": 3,
           "service": 300,
           "delivery": [
               5
           ]
       },
       {
           "id": "Delivery 5",
           "location_index": 4,
           "service": 300,
           "delivery": [
               5
           ]
       }
   ],
   "vehicles": [
       {
           "id": 1,
            "start_index": 5,
           "capacity": [
               25
           ]
       }
  ],
  "options":{
    "grouping":{
        "order_grouping":{
            "grouping_diameter":200
    }
    }
  }
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "27c6d7912589e1153b62867ccdae031d",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=27c6d7912589e1153b62867ccdae031d
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
  "description": "Order Grouping Example",
  "result": {
    "code": 0,
    "summary": {
      "cost": 1142,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 1500,
      "duration": 1142,
      "waiting_time": 0,
      "priority": 0,
      "delivery": [21],
      "pickup": [0],
      "distance": 6848
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 1142,
        "steps": [
          {
            "type": "start",
            "arrival": 0,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [34.00915715, -118.26492807],
            "location_index": 5,
            "load": [21],
            "distance": 0,
            "snapped_location": [34.00918, -118.26493]
          },
          {
            "type": "job",
            "arrival": 458,
            "duration": 458,
            "service": 300,
            "waiting_time": 0,
            "location": [34.03314553, -118.25960305],
            "location_index": 4,
            "id": "Delivery 5",
            "load": [16],
            "distance": 3120,
            "internal_id": 3773414798,
            "snapped_location": [34.033, -118.25973]
          },
          {
            "type": "job",
            "arrival": 1219,
            "duration": 919,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05083235, -118.24521687],
            "projected_location": [34.05062229, -118.24520506],
            "location_index": 0,
            "id": "Delivery 1",
            "load": [11],
            "distance": 5791,
            "internal_id": 3840525274,
            "snapped_location": [34.05061, -118.24519]
          },
          {
            "type": "job",
            "arrival": 1519,
            "duration": 919,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05062229, -118.24520506],
            "projected_location": [34.05062229, -118.24520506],
            "location_index": 1,
            "id": "Delivery 2",
            "load": [8],
            "distance": 5791,
            "internal_id": 3823747655,
            "snapped_location": [34.05061, -118.24519]
          },
          {
            "type": "job",
            "arrival": 1819,
            "duration": 919,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05056751, -118.24565383],
            "projected_location": [34.05062229, -118.24520506],
            "location_index": 2,
            "id": "Delivery 3",
            "load": [5],
            "distance": 5791,
            "internal_id": 3806970036,
            "snapped_location": [34.05061, -118.24519]
          },
          {
            "type": "job",
            "arrival": 2342,
            "duration": 1142,
            "service": 300,
            "waiting_time": 0,
            "location": [34.05635229, -118.25009887],
            "location_index": 3,
            "id": "Delivery 4",
            "load": [0],
            "distance": 6848,
            "internal_id": 3790192417,
            "snapped_location": [34.05629, -118.25001]
          },
          {
            "type": "end",
            "arrival": 2642,
            "duration": 1142,
            "service": 0,
            "waiting_time": 0,
            "location": [34.05635229, -118.25009887],
            "location_index": 3,
            "load": [0],
            "distance": 6848,
            "snapped_location": [34.05629, -118.25001]
          }
        ],
        "service": 1500,
        "duration": 1142,
        "waiting_time": 0,
        "priority": 0,
        "delivery": [21],
        "pickup": [0],
        "distance": 6848,
        "geometry": "klqnExrypU?~@_B@Y?sA@cAAS?c@?o@?[?_@?QA_@@S?k@?{@?qA@W?}@?k@?m@?M?[?oB?i@?O?O@k@AS?S@SAa@@y@e@OK_@Sw@c@KGuAw@u@a@]SsAu@c@Uq@_@[O]S[OUMSMk@YUMQK[OsBgASMMGcAk@SMk@[SKKGoAs@w@a@i@Yg@Ye@WOIw@c@WO]SMGc@WQK}@g@iAm@GEkAo@u@a@WO}Ay@gAm@SM{Ay@KGkAo@GEe@Um@][S_Ai@OIGE]Qa@UYQIGQKe@WSMMIy@e@gAm@c@W]SGESMOISK]SGE]UyA~CiAnCq@xAOZi@fAqBlEiCoB{@jBc@~@Sb@[p@_@v@y@fBmEeDmEcDeBuAa@]eA{@]WgHkF}BeBIIOSACGMGM[o@Ye@GG_@q@S_@}AkCU_@aAeBYe@{AiCoBkDkAkB]g@MSe@s@o@aAOWs@cA}@iAeAkA_BeBe@g@c@g@YYIKAAg@g@oAgA_BuAaA|A[n@a@r@cB_BoAmA_@[kA_Ae@g@YWSSa@_@[YUUQOw@s@EE_@a@g@a@[YUSMKMMOMi@e@KIWd@EC????DBVe@GGYWGGKIUSe@a@GGQQgBaBUUi@c@a@[MMOTKRo@fAMRKLONMRQZa@t@]h@KROXU`@U^[p@g@~@OXYd@Wd@i@`AMROVKPOVKR[h@]n@GLININMV_@r@[h@S`@OTKRS\\OVGLYd@EHKREHGHHHTT??",
        "internal_id": 1
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

The following images give a visual representation of how this feature works.

_Without Order Grouping_

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/without-order-grouping.webp)

_With Order Grouping_

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/with-order-grouping.webp)

## Analyzing the Solution

Looking at the result we observe that:

- All the tasks were successfully assigned with a total travel cost of 1410
- The 3 delivery tasks, Delivery 1, 2 & 3, located close to each other were treated as a single stop. The location of the common stop was returned by the field `projected_location` in the solution.

This example exhibits how NextBillion.ai’s Route Optimization API can be used to group nearby tasks to save time, get efficient route plans and deliver a good driver experience. Readers can go ahead and try out different configurations of grouping criteria and task locations or just remove the grouping constraint and compare travel costs to explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.
