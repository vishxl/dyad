# Avoid sharp turns for a truck

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

It gets complicated and risky for large trucks to maneuver around sharp turns. With Directions Flexible API users can specify the custom turn angles which are safe for their trucks to take. In order to use the `turn_angle_range` parameter, users also need to set the `avoid` property to “sharp_turn”. Let’s see how to configure such a request:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “truck” to get a route which a car can take
- `avoid` parameter set “sharp_turn”
- `turn_angle_range` set to 110 to allow trucks to make turns between \[110,250\] degrees
- `option` set to “flexible”

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=32.75429821,-117.14624719&destination=32.75456089,-117.14694495&mode=truck&key=<your_api_key>&avoid=sharp_turn&option=flexible&turn_angle_range=110' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "ki|fEbc_jUU?c@???]AI?Q?w@AO?K?w@EC?A@C@??OF??[A??c@Ae@?C?w@?Y???Q?O???[?e@?Q?@_@?_@???S?IAk@??BmBdB?dDB@?fB???@hA?R?L??@z@@LBz@??@H?@??@F?@BJ@@BHFHHLvBdA??",
      "distance": 879.89,
      "duration": 149.33,
      "start_location": {
        "latitude": 32.7543,
        "longitude": -117.14626
      },
      "end_location": {
        "latitude": 32.75454,
        "longitude": -117.14694
      },
      "legs": [
        {
          "distance": {
            "value": 879
          },
          "duration": {
            "value": 149
          },
          "start_location": {
            "latitude": 32.7543,
            "longitude": -117.14626
          },
          "end_location": {
            "latitude": 32.75454,
            "longitude": -117.14694
          },
          "steps": [
            {
              "geometry": "ki|fEbc_jUU?c@???",
              "start_location": {
                "latitude": 32.7543,
                "longitude": -117.14626
              },
              "end_location": {
                "latitude": 32.75459,
                "longitude": -117.14626
              },
              "distance": {
                "value": 31
              },
              "duration": {
                "value": 4
              }
            },
            {
              "geometry": "ek|fEbc_jU]AI?Q?w@AO?K?w@EC?A@C@??OF??[A??c@Ae@?C?w@?Y???Q?O???[?e@?Q?",
              "start_location": {
                "latitude": 32.75459,
                "longitude": -117.14626
              },
              "end_location": {
                "latitude": 32.75723,
                "longitude": -117.14625
              },
              "distance": {
                "value": 298
              },
              "duration": {
                "value": 51
              }
            },
            {
              "geometry": "w{|fE`c_jU@_@?_@???S?IAk@??BmB",
              "start_location": {
                "latitude": 32.75724,
                "longitude": -117.14625
              },
              "end_location": {
                "latitude": 32.75722,
                "longitude": -117.14501
              },
              "distance": {
                "value": 116
              },
              "duration": {
                "value": 25
              }
            },
            {
              "geometry": "s{|fEh{~iUdB?dDB@?fB???",
              "start_location": {
                "latitude": 32.75721,
                "longitude": -117.14501
              },
              "end_location": {
                "latitude": 32.75534,
                "longitude": -117.14503
              },
              "distance": {
                "value": 208
              },
              "duration": {
                "value": 30
              }
            },
            {
              "geometry": "}o|fEl{~iU@hA?R?L??@z@@LBz@??@H?@??@F?@BJ@@BHFHHLvBdA??",
              "start_location": {
                "latitude": 32.75535,
                "longitude": -117.14503
              },
              "end_location": {
                "latitude": 32.75453,
                "longitude": -117.14694
              },
              "distance": {
                "value": 226
              },
              "duration": {
                "value": 37
              }
            },
            {
              "geometry": "{j|fEjg_jU??",
              "start_location": {
                "latitude": 32.75454,
                "longitude": -117.14694
              },
              "end_location": {
                "latitude": 32.75454,
                "longitude": -117.14694
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

Following is a visual representation of the above route on a map. We can observe that the turn at the interchange was avoided in favor of a longer route because of the “turn_angle_range” setting.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/api/avoid-sharp-turns-for-a-truck.webp)
