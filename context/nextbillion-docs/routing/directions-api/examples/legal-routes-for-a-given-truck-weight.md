# Legal routes for a given truck weight

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

Directions Flexible API allows configuring the truck weight when making a request so that the routes returned are safe and legal for the given route to travel on. `truck_weight` parameter is used to eliminate routes which pass through roads with an allowed weight threshold lower than the given weight. For this request, we configure:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “truck” to get a route which a car can take
- `truck_weight` parameter set with the actual weight of the truck
- `option` set to “flexible”

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.17240201,-118.38548103&destination=34.17667026,-118.36597825&mode=truck&key=<your_api_key>&option=flexible&truck_weight=11000' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "ohqoEtdqqUyHCiJ???@uE?uE@eF??EwA??@uB?ACuBBwEA_B???kM?uA?sB???gBAmB?M?wH?yE?gD???{@???o@Aq@@m@???}@?qB???{E@yE?iB???qB??oD@",
      "distance": 2283.624,
      "duration": 343.324,
      "start_location": {
        "latitude": 34.1724,
        "longitude": -118.38555
      },
      "end_location": {
        "latitude": 34.17667,
        "longitude": -118.36593
      },
      "legs": [
        {
          "distance": {
            "value": 2283
          },
          "duration": {
            "value": 343
          },
          "start_location": {
            "latitude": 34.1724,
            "longitude": -118.38555
          },
          "end_location": {
            "latitude": 34.17667,
            "longitude": -118.36593
          },
          "steps": [
            {
              "geometry": "ohqoEtdqqUyHCiJ???",
              "start_location": {
                "latitude": 34.1724,
                "longitude": -118.38555
              },
              "end_location": {
                "latitude": 34.17578,
                "longitude": -118.38552
              },
              "distance": {
                "value": 376
              },
              "duration": {
                "value": 46
              }
            },
            {
              "geometry": "s}qoEpdqqU@uE?uE@eF??EwA??@uB?ACuBBwEA_B???kM?uA?sB???gBAmB?M?wH?yE?gD???{@???o@Aq@@m@???}@?qB???{E@yE?iB???qB??",
              "start_location": {
                "latitude": 34.17578,
                "longitude": -118.38553
              },
              "end_location": {
                "latitude": 34.17579,
                "longitude": -118.36592
              },
              "distance": {
                "value": 1809
              },
              "duration": {
                "value": 279
              }
            },
            {
              "geometry": "u}qoE~imqUoD@",
              "start_location": {
                "latitude": 34.17579,
                "longitude": -118.36592
              },
              "end_location": {
                "latitude": 34.17667,
                "longitude": -118.36593
              },
              "distance": {
                "value": 98
              },
              "duration": {
                "value": 16
              }
            },
            {
              "geometry": "ecroE`jmqU??",
              "start_location": {
                "latitude": 34.17667,
                "longitude": -118.36593
              },
              "end_location": {
                "latitude": 34.17667,
                "longitude": -118.36593
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              }
            }
          ]
        }
      ]
    }
  ]
}
```
