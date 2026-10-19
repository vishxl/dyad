# ETAs for cross-border trips

_Implement Using_: [Distance Matrix Flexible API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-flexible-api)

In this example, let’s request for distance and duration values for a route that a truck can take when allowed to cross country borders. We will create a Distance Matrix Flexible request with 2 `origins` (O) and 2 `destinations` (D). We set `option` as `flexible` along with:

- `mode` set to “truck” to get distance and duration values for a route that a truck can take
- `cross_border` option set to “true”

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?origins=48.96845365,-110.21708796|48.96266414,-109.73794494&destinations=48.95108310,-110.22002749|48.95494374,-109.72324730&mode=truck&key=<your_api_key>&option=flexible&cross_border=true'
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
            "value": 90
          },
          "distance": {
            "value": 1933
          }
        },
        {
          "duration": {
            "value": 7894
          },
          "distance": {
            "value": 88584
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 8131
          },
          "distance": {
            "value": 89211
          }
        },
        {
          "duration": {
            "value": 145
          },
          "distance": {
            "value": 1328
          }
        }
      ]
    }
  ]
}
```
