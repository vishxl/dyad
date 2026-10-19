# Traffic Incidents API

## Introduction

NextBillion.ai’s Traffic Incidents API provides users with detailed information about the traffic related incidents within a specified geographic area. The service provides users with a list of all incidents/road closures and their associated properties like - cause of incident, impacted roads, severity and probability of incident, start-end times for scheduled or planned closures and the impact on travel time or delays caused by a given incident. The service allows users to search for incidents in a given bounding box area along with other classifying inputs like - specific incident types or timings to receive all desired incident details.

GET

https://api.nextbillion.io/map/traffic_incidents?key={your_api_key}

### Request Parameters

| Name                | Required | Format and Usage                                                                                                                                                                                                                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`               | Yes      | Type: `string`<br>Format: 32 bit alphanumeric character<br>Example: key=API_KEY                                                                                                                                                    | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `bbox`              | No       | Type: `string`<br>Format: minLon, minLat, maxLon, maxLat<br>Example: bbox=-83.16788, 39.90290, -82.90043, 40.09673                                                                                                                 | Specify the bounding box indicating the area to be used for retrieving the incidents from. The bouding box can be specified using a pair of location coordinates - first pair is for the lower-left corner of the bounding box and the second pair for the upper-right corner of the box. Please note that _ Maximum area of the specified bounding box is 10,000 km2. _ One of `bbox` and `id` is mandatory. \* However, when both `id` and `bbox` are provided, the `bbox` input is ignored. |
| `id`                | No       | Type: `string`<br>Example: id=9dd88b84-2da3, 46829b505-b3b1                                                                                                                                                                        | Provide a comma separated list of specific incident's IDs to be retrieved. The maximum number of IDs that can be provided in a list is 5. Users need to provide at least one of `bbox` and `id` for a valid input request. Please note when both `id` and `bbox` are provided in the input request, the `bbox` input is ignored. **Note:** Incidents IDs can be retrieved from results of previous queries with the 'bbox' parameter.                                                          |
| `incident_type`     | No       | Type: `string`<br>Default: All allowed values<br>Allowed values: `unknown`, `accident`, `fog`, `dangerous_conditions`, `rain`, `ice`, `jam`, `lane_closed`, `road_closed`, `road_works`, `wind`, `flooding`, `broken_down_vehicle` | Specify the types of incidents incidents to be included in the response. Multiple values are supported and should be separated by a comma `,`.                                                                                                                                                                                                                                                                                                                                                 |
| `incident_validity` | No       | Type: `string`<br>Default: `present`<br>Allowed values: `present`, `future`                                                                                                                                                        | Specify the choice of incidents based on their occurrence in time. Multiple values can be separated by a comma `,`.                                                                                                                                                                                                                                                                                                                                                                            |

### Response Schema

| Field                                         | Type                     | Description                                                                                                                                                                                                                                                                                           |
| --------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string                   | A string indicating the state of the response. On normal responses, the value will be `Ok`. Indicative HTTP error codes are returned for different errors. See the [API Errors Codes](https://docs.nextbillion.ai/map-data/traffic-incidents-api#api-error-codes) section below for more information. |
| `msg`                                         | string                   | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                                                 |
| `incidents`                                   | array of object          | An array of objects containing the details of the all incidents returned for the given input. Each object represents the details of a single incident.                                                                                                                                                |
| `incidents[].id`                              | string                   | Returns an unique ID for the traffic incident. Use this ID in the `id` input to retrieve details about specific incidents.                                                                                                                                                                            |
| `incidents[].incident_type`                   | string                   | Returns the type of the incident.                                                                                                                                                                                                                                                                     |
| `incidents[].incident_code`                   | integer                  | Returns the code of the incident.                                                                                                                                                                                                                                                                     |
| `incidents[].geometry`                        | object                   | An object with geoJSON details of the incident. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).                                                                                                                                             |
| `incidents[].geometry.type`                   | string                   | Type of the geoJSON geometry. Will mostly be one of `Linestring` or `Point` depending on the incident.                                                                                                                                                                                                |
| `incidents[].geometry.coordinates`            | array of array of number | An array of coordinates in the \[longitude, latitude\] format, representing the incident geometry.                                                                                                                                                                                                    |
| `incidents[].properties`                      | object                   | An object containing the details of the incident.                                                                                                                                                                                                                                                     |
| `incidents[].properties.events`               | object                   | The list of events describing the details of the incident. Traffic incident can be described with more than one `events` object.                                                                                                                                                                      |
| `incidents[].properties.events.description`   | string                   | The description of the event.                                                                                                                                                                                                                                                                         |
| `incidents[].properties.events.code`          | integer                  | The predefined incident code, describing the event.                                                                                                                                                                                                                                                   |
| `incidents[].properties.events.icon_category` | integer                  | The icon category associated with the event. The icon category from the first `events` in the list is also replicated in the `incident_code` field.                                                                                                                                                   |
| `incidents[].properties.start_time`           | string                   | Returns the start time of the incident, if available, in the [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format.                                                                                                                                                                                |
| `incidents[].properties.end_time`             | string                   | Returns the end time of the incident, if available, in the [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format.                                                                                                                                                                                  |
| `incidents[].properties.location_from`        | string                   | Returns the name of the location where the traffic incident's impact on traffic flow starts.                                                                                                                                                                                                          |
| `incidents[].properties.location_to`          | string                   | Returns the name of the location where the traffic incident's impact on traffic flow ends.                                                                                                                                                                                                            |
| `incidents[].properties.length`               | number                   | Returns the length of the road, in meters, affected due to the incident.                                                                                                                                                                                                                              |
| `incidents[].properties.delay`                | integer                  | Returns the delay, in seconds, caused by the incident (except road closures). It represents the additional time required when compared to free-flow travel time with minimal traffic.                                                                                                                 |
| `incidents[].properties.criticality`          | integer                  | Returns the criticality or the magnitude of delay associated with an incident. The values returned are mapped to following values: _ `0`: Unknown _ `1`: Minor _ `2`: Moderate _ `3`: Major \* `4`: Undefined (used for road closures and other indefinite delays)                                    |
| `incidents[].properties.incident_validity`    | string                   | Returns if the incident occurrence is ongoing (present) or in the future.                                                                                                                                                                                                                             |
| `incidents[].properties.probability`          | string                   | Returns the likelihood of the incident occuring. It will be one of: `certain`, `risk_of`, `probable`, `improbable`.                                                                                                                                                                                   |
| `incidents[].properties.road_numbers`         | array of string          | Returns an array with the road number(s), if available, affected by the incident.                                                                                                                                                                                                                     |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/map/traffic_incidents?key=<your_api_key>&bbox=-83.1678800,39.9029016,-82.9004315,40.0967332&incident_validity=present'
```

### Sample Response

```json
{
  "incidents": [
    {
      "id": "TTI-4b609aae-190f-4e96-9a81-c8a0a3112b60-TTR23841853236080000",
      "incident_type": "Lane Closed",
      "incident_code": 7,
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-83.1592378633, 39.9775421964],
          [-83.1589924412, 39.97753147],
          [-83.1587899344, 39.9775193947],
          [-83.1585632877, 39.9775086682],
          [-83.1580925601, 39.9774885642],
          [-83.1577921526, 39.9774764889],
          [-83.1494276838, 39.9771224507],
          [-83.1475528197, 39.9770661204]
        ]
      },
      "properties": {
        "events": {
          "description": "Lane closed",
          "code": 500,
          "icon_category": 7
        },
        "start_time": "2025-12-08T02:08:00Z",
        "end_time": "",
        "location_from": "OH-142/Exit 85 (I-70)",
        "location_to": "Hilliard Rome Rd/Exit 91 (I-70)",
        "length": 997.238,
        "delay": 0,
        "criticality": 0,
        "incident_validity": "present",
        "probability": "probable",
        "road_numbers": ["West Fwy E", "I-70 E"]
      }
    },
    {
      "id": "TTI-4b609aae-190f-4e96-9a81-c8a0a3112b60-TTR23807229448006000",
      "incident_type": "Road Closed",
      "incident_code": 8,
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-83.1231044845, 40.0955043778],
          [-83.1230226772, 40.0955486842],
          [-83.1229542808, 40.0956049808],
          [-83.1229153888, 40.0956371686],
          [-83.1219363825, 40.0962768816],
          [-83.1217352168, 40.0963385636],
          [-83.1216104941, 40.0963962701]
        ]
      },
      "properties": {
        "events": {
          "description": "Closed",
          "code": 401,
          "icon_category": 8
        },
        "start_time": "2025-12-03T13:25:00Z",
        "end_time": "",
        "location_from": "Frantz Rd",
        "location_to": "US-33 E / Shawan Falls Dr",
        "length": 165.5280472153,
        "delay": 0,
        "criticality": 4,
        "incident_validity": "present",
        "probability": "probable"
      }
    },
    {
      "id": "TTI-4b609aae-190f-4e96-9a81-c8a0a3112b60-TTR23836083216046000",
      "incident_type": "Road Closed",
      "incident_code": 8,
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-83.0857641117, 40.0340080368],
          [-83.0870488899, 40.0340429492],
          [-83.0872460322, 40.0340416015],
          [-83.08746195, 40.0340321674],
          [-83.087653728, 40.0340107323],
          [-83.0878656225, 40.0339772318],
          [-83.0899054425, 40.0327072185],
          [-83.0901066081, 40.0322686224]
        ]
      },
      "properties": {
        "events": {
          "description": "Closed",
          "code": 401,
          "icon_category": 8
        },
        "start_time": "2025-09-13T05:05:30Z",
        "end_time": "",
        "location_from": "Kioka Ave",
        "location_to": "River Park Dr",
        "length": 463.6474299271,
        "delay": 0,
        "criticality": 4,
        "incident_validity": "present",
        "probability": "probable"
      }
    },
    {
      "id": "TTI-4b609aae-190f-4e96-9a81-c8a0a3112b60-TTR23850509996012000",
      "incident_type": "Road Works",
      "incident_code": 9,
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-83.0772641914, 39.9985479],
          [-83.0773178355, 39.9984647474],
          [-83.0775498466, 39.9983427472],
          [-83.0776517706, 39.9982958092],
          [-83.077862324, 39.9982005847]
        ]
      },
      "properties": {
        "events": {
          "description": "Roadworks",
          "code": 701,
          "icon_category": 9
        },
        "start_time": "2025-11-05T23:02:30Z",
        "end_time": "",
        "location_from": "US-33/Riverside Dr (Trabue Rd)",
        "location_to": "N Hague Ave (Trabue Rd)",
        "length": 65.2427541157,
        "delay": 0,
        "criticality": 0,
        "incident_validity": "present",
        "probability": "probable"
      }
    }
  ]
}
```

## API Query Limits

1. The maximum area of `bbox` that can be specified is 10000 km².
2. The maximum number of IDs that can be provided for the `id` input list is 5.
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
