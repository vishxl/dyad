# Retrieve Optimized Routes

Use the following GET API request to retrieve optimized route result using the unique job ID created in the POST request.

##### API Request

```bash
https://api.nextbillion.io/optimization/v2/result?id=<id>&key=<nextbillions_api_key>
```

##### API Response

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 4551,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 960,
      "duration": 4551,
      "waiting_time": 0,
      "priority": 0,
      "distance": 79239
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 4551,
        "steps": [
          {
            "type": "start",
            "arrival": 1719973800,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [40.08, -83.16],
            "location_index": 9,
            "distance": 0,
            "snapped_location": [40.07998, -83.15995]
          },
          {
            "type": "job",
            "arrival": 1719973979,
            "duration": 179,
            "service": 120,
            "waiting_time": 0,
            "location": [40.07670211791992, -83.16177368164062],
            "location_index": 2,
            "id": 3,
            "description": "b5",
            "distance": 1135,
            "internal_id": 3,
            "snapped_location": [40.07626, -83.16172]
          },
          {
            "type": "job",
            "arrival": 1719974844,
            "duration": 924,
            "service": 120,
            "waiting_time": 0,
            "location": [40.156944274902344, -83.18661499023438],
            "location_index": 7,
            "id": 8,
            "description": "bA",
            "distance": 12649,
            "internal_id": 8,
            "snapped_location": [40.15631, -83.18632]
          },
          {
            "type": "job",
            "arrival": 1719975712,
            "duration": 1672,
            "service": 120,
            "waiting_time": 0,
            "location": [40.122867584228516, -83.12487030029297],
            "location_index": 1,
            "id": 2,
            "description": "b4",
            "distance": 21560,
            "internal_id": 2,
            "snapped_location": [40.12289, -83.12429]
          },
          {
            "type": "job",
            "arrival": 1719975832,
            "duration": 1672,
            "service": 120,
            "waiting_time": 0,
            "location": [40.122894287109375, -83.12489318847656],
            "location_index": 6,
            "id": 7,
            "description": "b9",
            "distance": 21564,
            "internal_id": 7,
            "snapped_location": [40.12293, -83.12429]
          },
          {
            "type": "job",
            "arrival": 1719975964,
            "duration": 1684,
            "service": 120,
            "waiting_time": 0,
            "location": [40.12344061874179, -83.12360889734997],
            "location_index": 5,
            "id": 6,
            "description": "b8",
            "distance": 21653,
            "internal_id": 6,
            "snapped_location": [40.12327, -83.12371]
          },
          {
            "type": "job",
            "arrival": 1719976729,
            "duration": 2329,
            "service": 120,
            "waiting_time": 0,
            "location": [40.10233688354492, -83.06173706054688],
            "location_index": 4,
            "id": 5,
            "description": "b7",
            "distance": 29732,
            "internal_id": 5,
            "snapped_location": [40.10274, -83.06165]
          },
          {
            "type": "job",
            "arrival": 1719978247,
            "duration": 3727,
            "service": 120,
            "waiting_time": 0,
            "location": [40.00126266479492, -82.88800811767578],
            "location_index": 0,
            "id": 1,
            "description": "b3",
            "distance": 59472,
            "internal_id": 1,
            "snapped_location": [40.00072, -82.88806]
          },
          {
            "type": "job",
            "arrival": 1719979099,
            "duration": 4459,
            "service": 120,
            "waiting_time": 0,
            "location": [39.972984313964844, -83.07879638671875],
            "location_index": 3,
            "id": 4,
            "description": "b6",
            "distance": 77934,
            "internal_id": 4,
            "snapped_location": [39.97288, -83.07884]
          },
          {
            "type": "end",
            "arrival": 1719979311,
            "duration": 4551,
            "service": 0,
            "waiting_time": 0,
            "location": [39.97, -83.08],
            "location_index": 8,
            "distance": 79239,
            "snapped_location": [39.97021, -83.08012]
          }
        ],
        "service": 960,
        "duration": 4551,
        "waiting_time": 0,
        "priority": 0,
        "distance": 79239,
        "geometry": "{bssFtdqz...",
        "description": "Arnav Malik",
        "internal_id": 1
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

The optimized route can be visualized using the NextBillion.ai’s Route Planner Web App available in NextBillion.ai Cloud Console.

The following image visualizes the optimized routes in the Route Planner Web App interface.

![Visualize optimized routes using NextBillion.ai Route Planner web application](https://static.nextbillion.io/docs-next/integrations/geotab/geotab-routes-in-route-planner.webp)
