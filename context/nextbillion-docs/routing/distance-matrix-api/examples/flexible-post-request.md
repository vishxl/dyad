# Basic Distance Matrix Flexible - POST Request

_Implement Using_: [Distance Matrix Flexible API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-flexible-api)

Let’s see how to build a Distance Matrix Flexible POST method request for the same scenario from the [trips in future example](https://docs.nextbillion.ai/routing/distance-matrix-api/examples/etas-for-trips-in-future)

### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/distancematrix/json?key=<your_api_key>&option=flexible' \
--header 'Content-Type: application/json' \
--data-raw '{
"origins":"34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151|33.94535370,-118.33148414",
"destinations":"33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.1963432",
    "mode":"truck",
    "departure_time":1685371968
    }'
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
            "value": 2056
          },
          "distance": {
            "value": 16216
          }
        },
        {
          "duration": {
            "value": 2083
          },
          "distance": {
            "value": 18503
          }
        },
        {
          "duration": {
            "value": 2205
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
            "value": 1767
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
