# Basic Distance Matrix Fast - POST Request

_Implement Using_: [Distance Matrix Fast API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-fast-api)

Let’s see how to build a Distance Matrix POST method request for the same scenario from [curbside example](https://docs.nextbillion.ai/routing/distance-matrix-api/examples/approach-destinations-on-curbside)

### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/distancematrix/json?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
"origins":"34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151",
"destinations":"33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.19634326",
    "mode":"truck",
    "approaches":"curb;curb;curb"
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
            "value": 1309
          },
          "distance": {
            "value": 17102
          }
        },
        {
          "duration": {
            "value": 1033
          },
          "distance": {
            "value": 18599
          }
        },
        {
          "duration": {
            "value": 1610
          },
          "distance": {
            "value": 28752
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 525
          },
          "distance": {
            "value": 4897
          }
        },
        {
          "duration": {
            "value": 604
          },
          "distance": {
            "value": 6988
          }
        },
        {
          "duration": {
            "value": 1274
          },
          "distance": {
            "value": 19824
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 1286
          },
          "distance": {
            "value": 13997
          }
        },
        {
          "duration": {
            "value": 1006
          },
          "distance": {
            "value": 14311
          }
        },
        {
          "duration": {
            "value": 1583
          },
          "distance": {
            "value": 24463
          }
        }
      ]
    }
  ]
}
```
