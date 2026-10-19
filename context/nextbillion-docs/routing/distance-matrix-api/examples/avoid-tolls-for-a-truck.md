# Avoid tolls for a truck

_Implement Using_: [Distance Matrix Fast API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-fast-api)

In this example, we will add a 4 x 5 matrix with 4 origins and 5 destinations which would result in a total of 20 combinations (or elements) in the response with each containing distance and duration for respective combination of locations. We will also customize our request and set:

- `avoid` set to “toll” to ensure routes with tolls are avoided
- `mode` set to “truck” to get routes suitable for a truck

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151|33.94535370,-118.33148414&destinations=33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.19634326|33.93580446,-118.12173867|33.88308753,-118.32679471&mode=truck&key=<your_api_key>&avoid=toll'
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
            "value": 1228
          },
          "distance": {
            "value": 18218
          }
        },
        {
          "duration": {
            "value": 1031
          },
          "distance": {
            "value": 18591
          }
        },
        {
          "duration": {
            "value": 1416
          },
          "distance": {
            "value": 30675
          }
        },
        {
          "duration": {
            "value": 1540
          },
          "distance": {
            "value": 29371
          }
        },
        {
          "duration": {
            "value": 1376
          },
          "distance": {
            "value": 26607
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 452
          },
          "distance": {
            "value": 4679
          }
        },
        {
          "duration": {
            "value": 607
          },
          "distance": {
            "value": 6988
          }
        },
        {
          "duration": {
            "value": 1120
          },
          "distance": {
            "value": 23941
          }
        },
        {
          "duration": {
            "value": 1327
          },
          "distance": {
            "value": 27223
          }
        },
        {
          "duration": {
            "value": 1050
          },
          "distance": {
            "value": 17687
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1210
          },
          "distance": {
            "value": 13938
          }
        },
        {
          "duration": {
            "value": 1013
          },
          "distance": {
            "value": 14311
          }
        },
        {
          "duration": {
            "value": 1428
          },
          "distance": {
            "value": 28581
          }
        },
        {
          "duration": {
            "value": 1635
          },
          "distance": {
            "value": 31864
          }
        },
        {
          "duration": {
            "value": 1320
          },
          "distance": {
            "value": 22573
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1025
          },
          "distance": {
            "value": 11692
          }
        },
        {
          "duration": {
            "value": 654
          },
          "distance": {
            "value": 6896
          }
        },
        {
          "duration": {
            "value": 1048
          },
          "distance": {
            "value": 22428
          }
        },
        {
          "duration": {
            "value": 1255
          },
          "distance": {
            "value": 25711
          }
        },
        {
          "duration": {
            "value": 773
          },
          "distance": {
            "value": 8388
          }
        }
      ]
    }
  ]
}
```
