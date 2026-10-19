# Retrieve Optimized Routes

Use the following API request to retrieve optimized route plans using the unique job ID created in the POST request.

#### API Request

Fetch the results using the GET request.

```bash
curl --request GET \
    --url 'https://api.nextbillion.io/optimization/v2/result?id=<id>&key=<nextbillion_api_key>'
```

#### API Response

The response will contain the optimized route details.

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 18325,
      "routes": 3,
      "unassigned": 7,
      "setup": 0,
      "service": 3840,
      "duration": 18319,
      "waiting_time": 0,
      "priority": 0,
      "distance": 255133
    },
    "unassigned": [
      {
        "id": 1544145,
        "type": "job",
        "location": [40.1177, -83.1265],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1544146,
        "type": "job",
        "location": [40.1234, -82.3291],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1553606,
        "type": "job",
        "location": [40.0642327649757, -83.0954498522196],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1553669,
        "type": "job",
        "location": [40.0611704217055, -83.181289831021],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1553676,
        "type": "job",
        "location": [40.020209070492, -83.058255409732],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1553690,
        "type": "job",
        "location": [40.0890504234802, -82.9901069905561],
        "reason": "cannot be completed due to time constraint"
      },
      {
        "id": 1554007,
        "type": "job",
        "location": [39.8379130929935, -82.932275947482],
        "reason": "cannot be completed due to time constraint"
      }
    ],
    "routes": [
      {
        "vehicle": 4700955,
        "cost": 12997,
        "steps": [
          {
            "type": "start",
            "arrival": 1715740200,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 40,
            "distance": 0,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740200,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 29,
            "id": 1529029,
            "description": "V5",
            "distance": 0,
            "long_id": "1529029",
            "internal_id": 1529029,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740320,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 28,
            "id": 1526592,
            "description": "V4",
            "distance": 0,
            "long_id": "1526592",
            "internal_id": 1526592,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740440,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 26,
            "id": 1526536,
            "description": "V2",
            "distance": 0,
            "long_id": "1526536",
            "internal_id": 1526536,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740560,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 31,
            "id": 1529041,
            "description": "V7",
            "distance": 0,
            "long_id": "1529041",
            "internal_id": 1529041,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740680,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 27,
            "id": 1526537,
            "description": "V3",
            "distance": 0,
            "long_id": "1526537",
            "internal_id": 1526537,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740800,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 30,
            "id": 1529033,
            "description": "V6",
            "distance": 0,
            "long_id": "1529033",
            "internal_id": 1529033,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715741437,
            "duration": 517,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9370518181, -118.2866424007],
            "location_index": 4,
            "id": 1517259,
            "description": "C20",
            "distance": 5284,
            "long_id": "1517259",
            "internal_id": 1517259,
            "snapped_location": [33.93691, -118.28664]
          },
          {
            "type": "job",
            "arrival": 1715742326,
            "duration": 1286,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9267459262, -118.1549039028],
            "location_index": 7,
            "id": 1517262,
            "description": "C5",
            "distance": 20795,
            "long_id": "1517262",
            "internal_id": 1517262,
            "snapped_location": [33.92706, -118.15547]
          },
          {
            "type": "job",
            "arrival": 1715742931,
            "duration": 1771,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9593813921, -118.1390891541],
            "location_index": 14,
            "id": 1517280,
            "description": "C14",
            "distance": 25515,
            "long_id": "1517280",
            "internal_id": 1517280,
            "snapped_location": [33.9592, -118.13921]
          },
          {
            "type": "job",
            "arrival": 1715743564,
            "duration": 2284,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9773340361, -118.1638252632],
            "location_index": 2,
            "id": 1517182,
            "description": "C22",
            "distance": 29317,
            "long_id": "1517182",
            "internal_id": 1517182,
            "snapped_location": [33.97736, -118.16408]
          },
          {
            "type": "job",
            "arrival": 1715744408,
            "duration": 3008,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9713117009, -118.2234522241],
            "location_index": 10,
            "id": 1517273,
            "description": "C3",
            "distance": 36073,
            "long_id": "1517273",
            "internal_id": 1517273,
            "snapped_location": [33.97149, -118.22343]
          },
          {
            "type": "job",
            "arrival": 1715745109,
            "duration": 3589,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9611881852, -118.1786377789],
            "location_index": 18,
            "id": 1517288,
            "description": "C11",
            "distance": 40701,
            "long_id": "1517288",
            "internal_id": 1517288,
            "snapped_location": [33.96111, -118.17865]
          },
          {
            "type": "job",
            "arrival": 1715746016,
            "duration": 4376,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0375115647, -118.1599203471],
            "location_index": 11,
            "id": 1517275,
            "description": "C10",
            "distance": 52081,
            "long_id": "1517275",
            "internal_id": 1517275,
            "snapped_location": [34.03771, -118.15965]
          },
          {
            "type": "job",
            "arrival": 1715746959,
            "duration": 5199,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0142845967, -118.099137225],
            "location_index": 9,
            "id": 1517265,
            "description": "C25",
            "distance": 58953,
            "long_id": "1517265",
            "internal_id": 1517265,
            "snapped_location": [34.0143, -118.09922]
          },
          {
            "type": "job",
            "arrival": 1715747693,
            "duration": 5813,
            "service": 120,
            "waiting_time": 0,
            "location": [33.994806672, -118.069445333],
            "location_index": 8,
            "id": 1517263,
            "description": "C1",
            "distance": 64907,
            "long_id": "1517263",
            "internal_id": 1517263,
            "snapped_location": [33.99475, -118.0695]
          },
          {
            "type": "job",
            "arrival": 1715748558,
            "duration": 6558,
            "service": 120,
            "waiting_time": 0,
            "location": [33.874397511, -118.0002348148],
            "location_index": 16,
            "id": 1517286,
            "description": "C6",
            "distance": 83907,
            "long_id": "1517286",
            "internal_id": 1517286,
            "snapped_location": [33.8744, -117.99976]
          },
          {
            "type": "job",
            "arrival": 1715749259,
            "duration": 7139,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9158585984, -118.0437357557],
            "location_index": 21,
            "id": 1517291,
            "description": "C19",
            "distance": 92025,
            "long_id": "1517291",
            "internal_id": 1517291,
            "snapped_location": [33.91585, -118.04425]
          },
          {
            "type": "job",
            "arrival": 1715750468,
            "duration": 8228,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9957748099, -117.9611193144],
            "location_index": 17,
            "id": 1517287,
            "description": "C16",
            "distance": 105632,
            "long_id": "1517287",
            "internal_id": 1517287,
            "snapped_location": [33.99609, -117.96108]
          },
          {
            "type": "job",
            "arrival": 1715751225,
            "duration": 8865,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0437467077, -117.9496315061],
            "location_index": 22,
            "id": 1517292,
            "description": "C21",
            "distance": 112280,
            "long_id": "1517292",
            "internal_id": 1517292,
            "snapped_location": [34.04375, -117.94967]
          },
          {
            "type": "job",
            "arrival": 1715752223,
            "duration": 9743,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0999260627, -117.9540154996],
            "location_index": 15,
            "id": 1517283,
            "description": "C18",
            "distance": 121436,
            "long_id": "1517283",
            "internal_id": 1517283,
            "snapped_location": [34.09993, -117.95395]
          },
          {
            "type": "job",
            "arrival": 1715753235,
            "duration": 10635,
            "service": 120,
            "waiting_time": 0,
            "location": [34.0843516516, -118.0439987826],
            "location_index": 1,
            "id": 1517148,
            "description": "C2",
            "distance": 132302,
            "long_id": "1517148",
            "internal_id": 1517148,
            "snapped_location": [34.08453, -118.04395]
          },
          {
            "type": "job",
            "arrival": 1715754694,
            "duration": 11974,
            "service": 120,
            "waiting_time": 0,
            "location": [34.1516230525, -118.2205332144],
            "location_index": 13,
            "id": 1517278,
            "description": "C17",
            "distance": 164428,
            "long_id": "1517278",
            "internal_id": 1517278,
            "snapped_location": [34.15154, -118.22001]
          },
          {
            "type": "job",
            "arrival": 1715755837,
            "duration": 12997,
            "service": 120,
            "waiting_time": 0,
            "location": [34.1480477281, -118.2889987561],
            "location_index": 20,
            "id": 1517290,
            "description": "C13",
            "distance": 180205,
            "long_id": "1517290",
            "internal_id": 1517290,
            "snapped_location": [34.14929, -118.29004]
          },
          {
            "type": "end",
            "arrival": 1715755957,
            "duration": 12997,
            "service": 0,
            "waiting_time": 0,
            "location": [34.1480477281, -118.2889987561],
            "location_index": 20,
            "distance": 180205,
            "snapped_location": [34.14929, -118.29004]
          }
        ],
        "service": 2760,
        "duration": 12997,
        "waiting_time": 0,
        "priority": 0,
        "distance": 180205,
        "geometry": "ys}mEffbqU??",
        "internal_id": 4700955
      },
      {
        "vehicle": 4745137,
        "cost": 4452,
        "steps": [
          {
            "type": "start",
            "arrival": 1715740200,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 40,
            "distance": 0,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715740200,
            "duration": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9080267864571, -118.309012757221],
            "location_index": 0,
            "id": 1517113,
            "description": "V1",
            "distance": 1,
            "long_id": "1517113",
            "internal_id": 1517113,
            "snapped_location": [33.90797, -118.30902]
          },
          {
            "type": "job",
            "arrival": 1715741160,
            "duration": 840,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8154941964, -118.2842403081],
            "location_index": 19,
            "id": 1517289,
            "description": "C9",
            "distance": 13070,
            "long_id": "1517289",
            "internal_id": 1517289,
            "snapped_location": [33.8156, -118.2846]
          },
          {
            "type": "job",
            "arrival": 1715741835,
            "duration": 1395,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8228791657, -118.2513537751],
            "location_index": 5,
            "id": 1517260,
            "description": "C12",
            "distance": 18131,
            "long_id": "1517260",
            "internal_id": 1517260,
            "snapped_location": [33.82288, -118.25142]
          },
          {
            "type": "job",
            "arrival": 1715742603,
            "duration": 2043,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8658148115, -118.2286499053],
            "location_index": 23,
            "id": 1517293,
            "description": "C15",
            "distance": 24591,
            "long_id": "1517293",
            "internal_id": 1517293,
            "snapped_location": [33.86557, -118.22865]
          },
          {
            "type": "job",
            "arrival": 1715743281,
            "duration": 2601,
            "service": 120,
            "waiting_time": 0,
            "location": [33.9096142383, -118.1797313262],
            "location_index": 24,
            "id": 1517294,
            "description": "C8",
            "distance": 34693,
            "long_id": "1517294",
            "internal_id": 1517294,
            "snapped_location": [33.90968, -118.17994]
          },
          {
            "type": "job",
            "arrival": 1715743986,
            "duration": 3186,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8898854032, -118.0961963449],
            "location_index": 12,
            "id": 1517277,
            "description": "C24",
            "distance": 46340,
            "long_id": "1517277",
            "internal_id": 1517277,
            "snapped_location": [33.88988, -118.09644]
          },
          {
            "type": "job",
            "arrival": 1715744698,
            "duration": 3778,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8473154856, -118.11941475],
            "location_index": 6,
            "id": 1517261,
            "description": "C23",
            "distance": 55215,
            "long_id": "1517261",
            "internal_id": 1517261,
            "snapped_location": [33.84722, -118.11942]
          },
          {
            "type": "job",
            "arrival": 1715745490,
            "duration": 4450,
            "service": 120,
            "waiting_time": 0,
            "location": [33.8190224843, -118.1473703077],
            "location_index": 25,
            "id": 1517295,
            "description": "C4",
            "distance": 61049,
            "long_id": "1517295",
            "internal_id": 1517295,
            "snapped_location": [33.81906, -118.14532]
          },
          {
            "type": "end",
            "arrival": 1715745610,
            "duration": 4450,
            "service": 0,
            "waiting_time": 0,
            "location": [33.8190224843, -118.1473703077],
            "location_index": 25,
            "distance": 61049,
            "snapped_location": [33.81906, -118.14532]
          }
        ],
        "service": 960,
        "duration": 4450,
        "waiting_time": 0,
        "priority": 0,
        "distance": 61049,
        "geometry": "ys}mEffbqU?",
        "internal_id": 4745137
      },
      {
        "vehicle": 4764848,
        "cost": 876,
        "steps": [
          {
            "type": "start",
            "arrival": 1715740200,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [33.908, -118.309],
            "location_index": 40,
            "distance": 0,
            "snapped_location": [33.90797, -118.309]
          },
          {
            "type": "job",
            "arrival": 1715741072,
            "duration": 872,
            "service": 120,
            "waiting_time": 0,
            "location": [33.964525609, -118.3837089952],
            "location_index": 3,
            "id": 1517226,
            "description": "C7",
            "distance": 13879,
            "long_id": "1517226",
            "internal_id": 1517226,
            "snapped_location": [33.96453, -118.38379]
          },
          {
            "type": "end",
            "arrival": 1715741192,
            "duration": 872,
            "service": 0,
            "waiting_time": 0,
            "location": [33.964525609, -118.3837089952],
            "location_index": 3,
            "distance": 13879,
            "snapped_location": [33.96453, -118.38379]
          }
        ],
        "service": 120,
        "duration": 872,
        "waiting_time": 0,
        "priority": 0,
        "distance": 13879,
        "geometry": "ys}mEffb",
        "internal_id": 4764848
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

The optimized route can be visualized using the NextBillion.ai’s Route Planner Web App available in NextBillion.ai Cloud Console.

The following image visualizes the optimized routes in the Route Planner Web App interface.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/image-4.webp)
