# Directions for custom truck sizes

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

Routing requirements for a truck with custom dimensions can be tricky as not all roads are suitable for all types of trucks. Taking wrong and inappropriate routes can result in operational and regulatory setbacks for a business. In this example, we will generate a route that is legal for a truck with custom dimensions to take. We configure:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “truck” to get a route which a car can take
- `truck_size` parameter specifying truck dimensions using its length, width and height

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?key=<your_api_key>&origin=36.84750172,-121.40023308&destination=36.85464131,-121.40096997&mode=truck&option=flexible&truck_size=213.36,300,413.36'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "{w{_F~}}cVA?{CE??uEEA?mEGgBA??cBAA?gBC??iBC?bEAjAAP???F?R??A|A??EhG?d@An@??AzB@{B??@o@?c@?ADiG@}A???S?G??@Q??@kAiBC??{@?m@C??eBC??e@AA?w@AU?",
      "distance": 1497.735,
      "duration": 198.875,
      "start_location": {
        "latitude": 36.84749,
        "longitude": -121.40016
      },
      "end_location": {
        "latitude": 36.85464,
        "longitude": -121.4009
      },
      "legs": [
        {
          "distance": {
            "value": 949
          },
          "duration": {
            "value": 120
          },
          "start_location": {
            "latitude": 36.84749,
            "longitude": -121.40016
          },
          "end_location": {
            "latitude": 36.85255,
            "longitude": -121.40444
          },
          "steps": [
            {
              "geometry": "{w{_F~}}cVA?{CE??uEEA?mEGgBA??cBAA?gBC??iBC",
              "start_location": {
                "latitude": 36.84749,
                "longitude": -121.40016
              },
              "end_location": {
                "latitude": 36.85248,
                "longitude": -121.4
              },
              "distance": {
                "value": 553
              },
              "duration": {
                "value": 67
              }
            },
            {
              "geometry": "_w|_F~|}cV?bEAjAAP???F?R??A|A??EhG?d@An@??AzB",
              "start_location": {
                "latitude": 36.85248,
                "longitude": -121.4
              },
              "end_location": {
                "latitude": 36.85256,
                "longitude": -121.40444
              },
              "distance": {
                "value": 396
              },
              "duration": {
                "value": 52
              }
            },
            {
              "geometry": "ow|_Fvx~cV??",
              "start_location": {
                "latitude": 36.85255,
                "longitude": -121.40444
              },
              "end_location": {
                "latitude": 36.85255,
                "longitude": -121.40444
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              }
            }
          ]
        },
        {
          "distance": {
            "value": 548
          },
          "duration": {
            "value": 78
          },
          "start_location": {
            "latitude": 36.85255,
            "longitude": -121.40444
          },
          "end_location": {
            "latitude": 36.85464,
            "longitude": -121.4009
          },
          "steps": [
            {
              "geometry": "ow|_Fvx~cV@{B??@o@?c@?ADiG@}A???S?G??@Q??@kA",
              "start_location": {
                "latitude": 36.85255,
                "longitude": -121.40444
              },
              "end_location": {
                "latitude": 36.85247,
                "longitude": -121.40097
              },
              "distance": {
                "value": 308
              },
              "duration": {
                "value": 42
              }
            },
            {
              "geometry": "_w|_Fbc~cViBC??{@?m@C??eBC??e@AA?w@AU?",
              "start_location": {
                "latitude": 36.85248,
                "longitude": -121.40098
              },
              "end_location": {
                "latitude": 36.85464,
                "longitude": -121.40089
              },
              "distance": {
                "value": 239
              },
              "duration": {
                "value": 35
              }
            },
            {
              "geometry": "od}_Frb~cV??",
              "start_location": {
                "latitude": 36.85464,
                "longitude": -121.4009
              },
              "end_location": {
                "latitude": 36.85464,
                "longitude": -121.4009
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

Following is a visual representation of the above route on a map. We can observe that a direct route is not suggested here due to the custom truck restrictions.

![documentation image](https://static.nextbillion.io/docs-next/routing/directions-api-for-custom-truck-sizes.webp)
