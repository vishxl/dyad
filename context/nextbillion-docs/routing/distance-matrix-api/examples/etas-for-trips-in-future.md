# ETAs for trips in future

_Implement Using_: [Distance Matrix Flexible API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-flexible-api)

For a Distance Matrix Flexible request with 4 `origins` (O) and 3 `destinations` (D) we will get a 4 x 3 matrix with `distance` and `duration` values for all 12 combinations (or elements) of O x D pairs. We configure the following parameters

- `option` as “flexible”
- `mode` set to “truck” to get distance and duration values for a route that a truck can take
- `departure_time` set to a time in future

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151|33.94535370,-118.33148414&destinations=33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.19634326&mode=truck&key=<your_api_key>&option=flexible&departure_time=1685371968'
```

### Response

```json
{
  "status": "Ok",
  "rows": [
    {
      "elements": [
        {
          "duration": {
            "value": 2061
          },
          "distance": {
            "value": 16216
          }
        },
        {
          "duration": {
            "value": 2087
          },
          "distance": {
            "value": 18503
          }
        },
        {
          "duration": {
            "value": 2209
          },
          "distance": {
            "value": 30885
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 735
          },
          "distance": {
            "value": 4715
          }
        },
        {
          "duration": {
            "value": 977
          },
          "distance": {
            "value": 6720
          }
        },
        {
          "duration": {
            "value": 1769
          },
          "distance": {
            "value": 19741
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1999
          },
          "distance": {
            "value": 13314
          }
        },
        {
          "duration": {
            "value": 1788
          },
          "distance": {
            "value": 13594
          }
        },
        {
          "duration": {
            "value": 2389
          },
          "distance": {
            "value": 30820
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1665
          },
          "distance": {
            "value": 17370
          }
        },
        {
          "duration": {
            "value": 960
          },
          "distance": {
            "value": 6761
          }
        },
        {
          "duration": {
            "value": 1515
          },
          "distance": {
            "value": 18168
          }
        }
      ]
    }
  ]
}
```
