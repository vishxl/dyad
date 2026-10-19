# Route Report API

## Introduction

NextBillion.ai’s Route Report API is a useful service to get a comprehensive report of a trip. Users can provide the geometry of the desired route or trip and then get details like duration, distance covered during the trip - broken down by state, country, road class along with maximum speeds on the road segments forming the route. The service also informs if the route has any tolls, bridges, tunnels or roundabout maneuvers along it. The service is useful for comparing routes, computing drive mileage and estimating associated metrics as per your business needs.

A valid Route Report request can be submitted using an HTTPS POST method containing the desired route geometry and its encoding type through a request body.

POST

https://api.nextbillion.io/route_report?key={your_api_key}&option=flexible

## Request Parameters

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

## Request Body

| Field                 | Type   | Description                                                                                                                                                                                                                                                                    |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `original_shape`      | string | Takes a route geometry as input and returns the route details. Accepts `polyline` and `polyline6` encoded geometry as input. **Note**: Route geometries generated from sources other than [NextBillion.ai](http://NextBillion.ai) services, are not supported in this version. |
| `original_shape_type` | string | Specify the encoding type of route geometry provided in `original_shape` input. Please note that an error is returned when this parameter is not specified while an input is added to `original_shape` parameter.                                                              |

## Response Schema

| Field                                          | Type            | Description                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                       | string          | A string indicating the state of the response. On normal responses, the value will be `Ok`. Indicative HTTP error codes are returned for different errors. See the [**API Errors Codes**](https://app.reapi.com/ws/hmx8aL45B5jjrJa8/p/vNNilNksLVz675pI/s/ealJmVGjTQv4x5Wi/edit/path/VYzo7gOlRsQQZo0U#api-error-codes) section below for more information. |
| `geometry`                                     | array of string | An array of objects returning encoded geometry of the routes. Each object represents an individual route in the input.                                                                                                                                                                                                                                    |
| `mileage`                                      | array of object | Returns the details of route segments in each state or country that the route passes through. Each object represents an individual route in the input request.                                                                                                                                                                                            |
| `mileage[].summary`                            | object          | Returns a summary of distances that the route covers in different states and countries.                                                                                                                                                                                                                                                                   |
| `mileage[].summary.state`                      | object          | A break up of state-wise distances that the route covers specified in `key:value` pair format.                                                                                                                                                                                                                                                            |
| `mileage[].summary.country`                    | object          | A break up of country-wise distances that the route covers in `key:value` pair format.                                                                                                                                                                                                                                                                    |
| `mileage[].segment`                            | object          | Returns the details of road segments that the route covers in different states and countries.                                                                                                                                                                                                                                                             |
| `mileage[].segment.state`                      | array of object | An array of objects containing state-wise break up of the route segments. Each object returns the segment details of a different state.                                                                                                                                                                                                                   |
| `mileage[].segment.state[].offset`             | integer         | Represents the index value of the vertex of current segment's starting point in route geometry. First vertex in the route geometry has an offset of 0.                                                                                                                                                                                                    |
| `mileage[].segment.state[].length`             | integer         | Represents a sequence of ‘n’ consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route with a distance indicated in `distance`field.                                                                                                                                                                   |
| `mileage[].segment.state[].distance`           | number          | Represents the real distance of this segment, in meters.                                                                                                                                                                                                                                                                                                  |
| `mileage[].segment.state[].value`              | string          | Returns the name of the state in which the segment lies.                                                                                                                                                                                                                                                                                                  |
| `mileage[].segment.country`                    | array of object | An array of objects containing country-wise break up of the route segments. Each object returns the segment details of a different country.                                                                                                                                                                                                               |
| `mileage[].segment.country[].offset`           | integer         | Represents the index value of the vertex of current segment's starting point in route geometry. First vertex in the route geometry has an offset of 0.                                                                                                                                                                                                    |
| `mileage[].segment.country[].length`           | integer         | Represents a sequence of ‘n’ consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route with a distance indicated in `distance`field.                                                                                                                                                                   |
| `mileage[].segment.country[].distance`         | number          | Represents the total distance of this segment, in meters.                                                                                                                                                                                                                                                                                                 |
| `mileage[].segment.country[].value`            | string          | Returns the name of the country in which the segment lies.                                                                                                                                                                                                                                                                                                |
| `road_summary`                                 | array of object | An array of objects returning a summary of the route with information about tolls, bridges, tunnels, segments, maximum speeds and more. Each array represents an individual route in the input request.                                                                                                                                                   |
| `road_summary[].summary`                       | object          | Returns an overview of the route with information about trip distance, duration and road class details among others.                                                                                                                                                                                                                                      |
| `road_summary[].summary.has_toll`              | boolean         | A boolean value indicating if there are any tolls in the given route.                                                                                                                                                                                                                                                                                     |
| `road_summary[].summary.has_bridge`            | boolean         | A boolean value indicating if there are any bridges in the given route.                                                                                                                                                                                                                                                                                   |
| `road_summary[].summary.has_tunnel`            | boolean         | A boolean value indicating if there are any tunnels in the given route.                                                                                                                                                                                                                                                                                   |
| `road_summary[].summary.has_roundabout`        | boolean         | A boolean value indicating if there are any roundabouts in the given route.                                                                                                                                                                                                                                                                               |
| `road_summary[].summary.duration`              | number          | Returns the total duration of the route, in seconds.                                                                                                                                                                                                                                                                                                      |
| `road_summary[].summary.distance`              | number          | Returns the total distance of the route , in meters.                                                                                                                                                                                                                                                                                                      |
| `road_summary[].summary.toll_distance`         | number          | Returns the total distance travelled on toll roads. This field is present in the response only when the `has_toll` property is true.                                                                                                                                                                                                                      |
| `road_summary[].summary.road_class`            | object          | An object with details about the different types of road classes that the route goes through. Distance traversed on a given road class is also returned. The contents of this object follow the `key:value` pair format.                                                                                                                                  |
| `road_summary[].segment`                       | object          | Returns the segment-wise road class and max speed information of the route.                                                                                                                                                                                                                                                                               |
| `road_summary[].segment.road_class`            | array of object | An array of objects returning the details of road segments belonging to different road classes that the route goes through. Each object refers to a unique road class.                                                                                                                                                                                    |
| `road_summary[].segment.road_class[].offset`   | integer         | Represents the index value of the vertex of current segment's starting point in route geometry. First vertex in the route geometry has an offset of 0.                                                                                                                                                                                                    |
| `road_summary[].segment.road_class[].length`   | integer         | Represents a sequence of ‘n’ consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route with a distance indicated in `distance`field.                                                                                                                                                                   |
| `road_summary[].segment.road_class[].distance` | integer         | Returns the total distance of this segment, in meters.                                                                                                                                                                                                                                                                                                    |
| `road_summary[].segment.road_class[].value`    | string          | Returns the road class name to which the segment belongs.                                                                                                                                                                                                                                                                                                 |
| `road_summary[].segment.max_speed`             | array of object | An array of objects returning the maximum speed of different segments that the route goes through.                                                                                                                                                                                                                                                        |
| `road_summary[].segment.max_speed[].offset`    | integer         | Represents the index value of the vertex of current segment's starting point in route geometry. First vertex in the route geometry has an offset of 0.                                                                                                                                                                                                    |
| `road_summary[].segment.max_speed[].length`    | integer         | Represents a sequence of ‘n’ consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route where the maximum speed is same and is indicated in `value`.                                                                                                                                                    |
| `road_summary[].segment.max_speed[].distance`  | integer         | Returns the total distance of this segment, in meters.                                                                                                                                                                                                                                                                                                    |
| `road_summary[].segment.max_speed[].value`     | integer         | Denotes the maximum speed of this segment, in kilometers per hour. - A value of “-1” indicates that the speed is unlimited for this road segment. - A value of “0” indicates that there is no information about the maximum speed for this road segment.                                                                                                  |
| `msg`                                          | string          | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                                                                                                     |

## Example

Let’s request a report and other stats for a trip made across multiple states by providing a sample route geometry.

### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/route_report?option=flexible&key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
"original_shape": "u`kbGjekhPa@R??\\dB?@j@jB?@~CoA~As@PIVINCPCMaAKeA?AIc@Ha@FSDKHEHCHEPGl@QB?XA??^???BAB?B???@?J@B?J@p@FdAJ??^BPBN@??n@Jr@HZD@S??@W?AFaA@Q??@OHwB??BiAI[??NaDFqAJsABk@Bu@Ba@??Be@?a@?i@?mEA_A?eAAeFGuIAq@CqFIwJEcIMwD?a@?sD?}A?}ACmIA}AAqCC_D?i@Ae@?[?U@]@[@WBYB_@Da@??BQDSDI@?He@?AXuABGJg@??NMHEBADAD?D@FD@BDFFJHRU`@eApBu@vAOV??a@c@?Ag@i@??KM?Ac@c@??MSAEGKEQQk@U{@??Oi@EQ_@sAkA{DAE?AeAcEAGO_@KSKMKO??s@i@a@_@QOGISWaAaBQ[KO]m@Qe@[eASq@EMQg@AAAGOWSWUU[SeB_Ai@_@GGSSY_@S_@CI??KWEMIUG[Ga@C[Cc@BeB?AXyEFcABm@?M?AEi@Eu@Ak@Ea@?IIm@??EMWcAU{@GOO_@MYuCyGwBoFy@gC?AKYg@}AWy@YeAeByIiBgKcA{CmAwB[[oAqAe@_@aEwCaAq@??_Aq@cCcB??qEeD}@}@A?m@w@g@y@a@w@c@mAOa@q@}BWaAY_BIiAAm@?i@FgB??BgBCy@C[??EY??a@oBW}@??m@{A_AkC[{@O[Uc@_@s@S[UWc@i@c@e@i@e@SQm@a@_@U]O_@Ma@Mg@M_@I[Eg@Ek@Ei@AaCHiCH@T",
"original_shape_type": "polyline"
}'
```

### Sample API Response

```json
{
  "status": "Ok",
  "geometry": [
    "u`kbGjekhPa@R\\fBj@lB~CoA~As@PIVINCPCMaAKgAIc@Ha@FSDKHEHCHEPGl@QB?XA^?BAB?B?@?J@B?J@p@FdAJ^BPBN@n@Jr@HZD@S@YFaA@Q@OHwBBiAI[NaDFqAJsABk@Bu@Ba@Be@?a@?i@?mEA_A?eAAeFGuIAq@CqFIwJEcIMwD?a@?sD?}A?}ACmIA}AAqCC_D?i@Ae@?[?U@]@[@WBYB_@Da@BQDSFIHg@XuABGJg@NMHEBADAD?D@FD@BDFFJHRU`@eApBu@vAOVa@e@g@i@KOc@c@MSAEGKEQQk@U{@U{@_@sAkA{DAGeAcEAGO_@KSKMKOs@i@a@_@QOGISWaAaBQ[KO]m@Qe@[eASq@EMSi@AGOWSWUU[SeB_Ai@_@GGSSY_@S_@CIKWEMIUG[Ga@C[Cc@BgBXyEFcABm@?OEi@Eu@Ak@Ea@?IIm@EMWcAU{@GOO_@MYuCyGwBoFy@iCKYg@}AWy@YeAeByIiBgKcA{CmAwB[[oAqAe@_@aEwCaAq@_Aq@cCcBqEeD_A}@m@w@g@y@a@w@c@mAOa@q@}BWaAY_BIiAAm@?i@FgBBgBCy@C[EYa@oBW}@m@{A_AkC[{@O[Uc@_@s@S[UWc@i@c@e@i@e@SQm@a@_@U]O_@Ma@Mg@M_@I[Eg@Ek@Ei@AaCHiCH@T"
  ],
  "mileage": [
    {
      "summary": {
        "state": {
          "United States|Illinois": 4851,
          "United States|Iowa": 1476,
          "United States|Wisconsin": 721
        },
        "country": {
          "United States": 7048
        }
      },
      "segment": {
        "state": [
          {
            "offset": 0,
            "length": 60,
            "distance": 1476,
            "value": "United States|Iowa"
          },
          {
            "offset": 60,
            "length": 153,
            "distance": 4851,
            "value": "United States|Illinois"
          },
          {
            "offset": 212,
            "length": 26,
            "distance": 721,
            "value": "United States|Wisconsin"
          }
        ],
        "country": [
          {
            "offset": 0,
            "length": 239,
            "distance": 7048,
            "value": "United States"
          }
        ]
      }
    }
  ],
  "road_summary": [
    {
      "summary": {
        "has_toll": false,
        "has_bridge": true,
        "has_tunnel": false,
        "has_roundabout": false,
        "duration": 596.614,
        "distance": 7048.941,
        "road_class": {
          "residential": 9,
          "secondary": 4387,
          "tertiary": 97,
          "trunk": 2143,
          "unclassified": 412
        }
      },
      "segment": {
        "road_class": [
          {
            "offset": 0,
            "length": 1,
            "distance": 20,
            "value": "unclassified"
          },
          {
            "offset": 1,
            "length": 2,
            "distance": 97,
            "value": "tertiary"
          },
          {
            "offset": 2,
            "length": 20,
            "distance": 392,
            "value": "unclassified"
          },
          {
            "offset": 21,
            "length": 67,
            "distance": 2143,
            "value": "trunk"
          },
          {
            "offset": 85,
            "length": 148,
            "distance": 4387,
            "value": "secondary"
          },
          {
            "offset": 223,
            "length": 1,
            "distance": 9,
            "value": "residential"
          }
        ],
        "max_speed": [
          {
            "offset": 0,
            "length": 3,
            "distance": 117,
            "value": 40
          },
          {
            "offset": 3,
            "length": 1,
            "distance": 95,
            "value": 0
          },
          {
            "offset": 3,
            "length": 11,
            "distance": 207,
            "value": 40
          },
          {
            "offset": 13,
            "length": 55,
            "distance": 1843,
            "value": 56
          },
          {
            "offset": 65,
            "length": 35,
            "distance": 589,
            "value": 48
          },
          {
            "offset": 98,
            "length": 24,
            "distance": 532,
            "value": 56
          },
          {
            "offset": 121,
            "length": 8,
            "distance": 195,
            "value": 48
          },
          {
            "offset": 126,
            "length": 27,
            "distance": 528,
            "value": 64
          },
          {
            "offset": 151,
            "length": 15,
            "distance": 521,
            "value": 72
          },
          {
            "offset": 165,
            "length": 46,
            "distance": 2030,
            "value": 80
          },
          {
            "offset": 210,
            "length": 13,
            "distance": 382,
            "value": 89
          },
          {
            "offset": 210,
            "length": 1,
            "distance": 9,
            "value": 0
          }
        ]
      }
    }
  ]
}
```

## API Query Limits

- Route geometries generated from sources other than NextBillion.ai services, are not supported in this version.
- Using geometries generated from “Fast” NextBillion.ai services might lead to discrepancies in distance and duration results in Route Report’s output. It is recommended to source route geometries from “Flexible” Nextbillion.ai services.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.

  _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                                                                     |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                                                                            |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                                                                       |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                                                               |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                                                                                     |
| 413           | Request entity too large                                         | This error is caused when the length of input request URI or the request body is too large. Please modify the request. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) if the issue still persists. |
| 422           | Could not process the request.                                   | Valid route could not be generated for the given parameters                                                                                                                                                              |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                                                                                   |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                                                               |
