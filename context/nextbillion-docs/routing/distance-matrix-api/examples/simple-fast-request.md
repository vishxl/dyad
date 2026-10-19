# Basic Distance Matrix Fast Request

_Implement Using_: [Distance Matrix Fast API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-fast-api)

Let’s create a simple Distance Matrix Fast request with 3 `origins` (O) and 3 `destinations` (D). We will get a 3 x 3 matrix with `distance` and `duration` values for all 9 combinations (or elements) of O x D pairs. We also set \`mode=car’ to get distance and duration values for a route that a car can take

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151&destinations=33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.19634326&mode=car&key=<your_api_key>'
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
            "value": 1190
          },
          "distance": {
            "value": 16195
          }
        },
        {
          "duration": {
            "value": 1055
          },
          "distance": {
            "value": 18589
          }
        },
        {
          "duration": {
            "value": 1459
          },
          "distance": {
            "value": 30851
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 493
          },
          "distance": {
            "value": 4674
          }
        },
        {
          "duration": {
            "value": 670
          },
          "distance": {
            "value": 6708
          }
        },
        {
          "duration": {
            "value": 1179
          },
          "distance": {
            "value": 23620
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1280
          },
          "distance": {
            "value": 14084
          }
        },
        {
          "duration": {
            "value": 1065
          },
          "distance": {
            "value": 14458
          }
        },
        {
          "duration": {
            "value": 1487
          },
          "distance": {
            "value": 28406
          }
        }
      ]
    }
  ]
}
```
