# Road Segments API

## Introduction

The Road Segments API from NextBillion.ai provides users with detailed information on all road segments within a specified geographic area. The service provides users with a list of all road segments, their shapes, midpoints, and associated driving attributes, including maximum speed and direction of travel. Users can define either a circular or bounding box area by providing simple inputs to receive this information.

POST

https://api.nextbillion.io/map/segments?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field               | Type    | Description                                                                                                                          |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `type`              | string  | Indicate the type of area to retrieve the road segments it contains. Only a "circle" or a "bbox" can be specified.                   |
| `circle`            | object  | An object to collect the details of a circular area. Please note that `circle` attribute is effective only when `type = circle`.     |
| `circle.center`     | object  | Specify the coordinates of the center of the circular area.                                                                          |
| `circle.center.lat` | number  | Latitude of the circle's center location.                                                                                            |
| `circle.center.lon` | number  | Longitude of the circle's center location.                                                                                           |
| `circle.radius`     | integer | Specify the radius of the circle, in meters, of the circular area.                                                                   |
| `bbox`              | object  | An object to collect details of a bounding box's boundaries. Please note that `bbox` attribute is effective only when `type = bbox`. |
| `bbox.max_lat`      | number  | Specify the maximum latitude of the bounding box area.                                                                               |
| `bbox.max_lon`      | number  | Specify the maximum longitude of the bounding box area.                                                                              |
| `bbox.min_lat`      | number  | Specify the minimum latitude of the bounding box area.                                                                               |
| `bbox.min_lon`      | number  | Specify the minimum longitude of the bounding box area.                                                                              |

### Response Schema

| Field                      | Type            | Description                                                                                                                                                  |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                   | string          | A string indicating the state of the response. On successful responses, the value will be `Ok` otherwise it will be `Failed` .                               |
| `message`                  | string          | Displays indicative error messages in case of a failed request or operation. See the [API Error Codes](#api-error-codes) section below for more information. |
| `segments`                 | array of object | An array of objects returning the details of individual segments contained within the specified area. Each object represents a single segment.               |
| `segments[].segment_id`    | integer         | Returns the unique ID of the road segment returned.                                                                                                          |
| `segments[].shape`         | string          | Returns the encoded geometry of the road segment in polyline format.                                                                                         |
| `segments[].mid_point`     | object          | Returns the location coordinates of the mid-point of the given road segment.                                                                                 |
| `segments[].mid_point.lat` | number          | Latitude of the mid-point location.                                                                                                                          |
| `segments[].mid_point.lon` | number          | Longitude of the mid-point location.                                                                                                                         |
| `segments[].attributes`    | object          | An object returning attributes associated with the given road segment. Each attribute is represented as a "key : value" pair.                                |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/map/segments?key=<your_api_key>' \

--header 'Content-Type: application/json' \

--data '{

"type": "circle",

"circle": {

"center": {

"lat": 1.3132272656379491,

"lon": 103.82278560368337

},

"radius": 100

}

}'
```

### Sample Response

```json
{
  "status": "Ok",
  "message": "",
  "segments": [
    {
      "segment_id": 100121041980,
      "shape": "gr_GmwtxRFM",
      "mid_point": {
        "lat": 1.31376,
        "lon": 103.82221999999999
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 50,
        "truck:backward": false,
        "truck:forward": false
      }
    },
    {
      "segment_id": 100120742790,
      "shape": "}k_Gm_uxRQz@",
      "mid_point": {
        "lat": 1.3128799999999998,
        "lon": 103.82313
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 50,
        "truck:backward": true,
        "truck:forward": true
      }
    },
    {
      "segment_id": 100121850700,
      "shape": "an_Ga`uxRF@D@LBRFL@D@",
      "mid_point": {
        "lat": 1.3129899999999999,
        "lon": 103.82348999999999
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 50,
        "truck:backward": true,
        "truck:forward": true
      }
    },
    {
      "segment_id": 100121041985,
      "shape": "_r_G{wtxRDG@ADC`AA",
      "mid_point": {
        "lat": 1.31372,
        "lon": 103.82227
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 0,
        "truck:backward": false,
        "truck:forward": false
      }
    },
    {
      "segment_id": 100121768445,
      "shape": "_r_G{wtxRl@^",
      "mid_point": {
        "lat": 1.31353,
        "lon": 103.82206000000001
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 0,
        "truck:backward": false,
        "truck:forward": false
      }
    },
    {
      "segment_id": 100121441155,
      "shape": "an_Ga`uxRW`A",
      "mid_point": {
        "lat": 1.3132499999999998,
        "lon": 103.8232
      },
      "attributes": {
        "motorcar:backward": true,
        "motorcar:forward": true,
        "speed": 18,
        "speed_limit": 0,
        "truck:backward": true,
        "truck:forward": true
      }
    }
  ]
}
```

## API Query Limits

1. The maximum value that can be specified for the `radius` is 50000m (50 km).
2. The maximum diagonal length of the configured bounding box should be less than 100,000m (100km).
3. NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
   _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response code | Description                                                     | Additional notes                                                                                                                                           |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether.                                                        |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account or requesting a service which is not enabled for you.                  |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request                                   | A feasible solution could not be generated for the given set of locations or parameter configuration.                                                      |
| 429           | Too many requests                                               | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                         | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |
