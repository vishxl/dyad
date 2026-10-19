# Approach destinations on curbside

_Implement Using_: [Distance Matrix Fast API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous)

In this example, we take a 3 x 3 matrix with 3 origins and 3 destinations which would result in a total of 9 combinations (or elements) in the response. We will also customize our request and set:

- `mode` set to truck
- `approaches` for each of the `destinations`. We will set it to “curb” since we want the truck to approach all destinations on the curbside.

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=34.05456317,-118.31528428|33.99167000,-118.25687955|34.00792776,-118.33063151&destinations=33.96763110,-118.23215346|33.93969502,-118.26583210|33.90184293,-118.19634326&mode=truck&key=<your_api_key>&approaches=curb;curb;curb'
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
            "value": 1291
          },
          "distance": {
            "value": 18278
          }
        },
        {
          "duration": {
            "value": 1021
          },
          "distance": {
            "value": 18591
          }
        },
        {
          "duration": {
            "value": 1599
          },
          "distance": {
            "value": 28744
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 521
          },
          "distance": {
            "value": 4739
          }
        },
        {
          "duration": {
            "value": 594
          },
          "distance": {
            "value": 6988
          }
        },
        {
          "duration": {
            "value": 1277
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
            "value": 1277
          },
          "distance": {
            "value": 13998
          }
        },
        {
          "duration": {
            "value": 1007
          },
          "distance": {
            "value": 14311
          }
        },
        {
          "duration": {
            "value": 1585
          },
          "distance": {
            "value": 24464
          }
        }
      ]
    }
  ]
}
```
