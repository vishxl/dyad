# Avoid service roads for trucks

_Implement Using_: [Distance Matrix Flexible API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-flexible-api)

In this example, let’s request for distance and duration values for a route that a truck can take while avoiding service roads. We will create a Distance Matrix Flexible request with 2 `origins` (O) and 2 `destinations` (D). We set `option` as `flexible` along with:

- setting `mode` to “truck” to get distance and duration values for a route that a truck can take
- `avoid` option set to “service_road”

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=33.782861,-117.23477|33.3220362,-117.2358124&destinations=33.7829837,-117.2300256|33.329168,-117.24246&mode=truck&key=<your_api_key>&option=flexible&avoid=service_road'
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
            "value": 79
          },
          "distance": {
            "value": 552
          }
        },
        {
          "duration": {
            "value": 3268
          },
          "distance": {
            "value": 63551
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 3032
          },
          "distance": {
            "value": 68023
          }
        },
        {
          "duration": {
            "value": 506
          },
          "distance": {
            "value": 5579
          }
        }
      ]
    }
  ]
}
```
