# ETAs for custom truck dimensions

_Implement Using_: [Distance Matrix Flexible API](https://docs.nextbillion.ai/routing/distance-matrix-api/synchronous#distance-matrix-flexible-api)

In this example, we take a 3 x 3 matrix with 3 origins and 3 destinations which would result in a total of 9 combinations (or elements) in the response. We will also customize our request and set:

- `mode` to truck
- `truck_size` to truck height,width,length in centimeters (cm). This defines the dimensions of a truck.
- `truck_weight` set with the total weight of the truck including the weight of trailer and shipped goods in kilograms (kg).
- `departure_time` to indicate the time when the trip starts

### Request

```bash
curl --location 'https://api.nextbillion.io/distancematrix/json?key=<your_api_key>&origins=34.189973,-118.934659|34.19099901,-118.92534671|34.20453867,-118.92889235&destinations=34.1792122,-118.9437976|34.17209339,-118.93331971|34.17933722,-118.94442264&mode=truck&truck_size=200,210,600&truck_weight=11770&avoid=toll&option=flexible&departure_time=1715082600'
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
            "value": 1178
          },
          "distance": {
            "value": 23707
          }
        },
        {
          "duration": {
            "value": 1321
          },
          "distance": {
            "value": 26200
          }
        },
        {
          "duration": {
            "value": 1190
          },
          "distance": {
            "value": 23766
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 268
          },
          "distance": {
            "value": 2800
          }
        },
        {
          "duration": {
            "value": 468
          },
          "distance": {
            "value": 5596
          }
        },
        {
          "duration": {
            "value": 279
          },
          "distance": {
            "value": 2859
          }
        }
      ]
    },
    {
      "elements": [
        {
          "duration": {
            "value": 465
          },
          "distance": {
            "value": 4606
          }
        },
        {
          "duration": {
            "value": 611
          },
          "distance": {
            "value": 6312
          }
        },
        {
          "duration": {
            "value": 475
          },
          "distance": {
            "value": 4665
          }
        }
      ]
    }
  ]
}
```
