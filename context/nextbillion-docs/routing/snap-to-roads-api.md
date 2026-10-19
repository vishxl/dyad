# Snap To Roads API

## Introduction

NextBillion.ai's Snap To Roads API takes a series of locations and snaps them to nearby roads representing the best-matched route where a trip took place connecting all the given locations. Users can choose to retrieve a geometry of the route connecting all the points while using several other configurations. They can also choose to receive the segment-wise speed limits of the route identified in the response.

GET

```
https://api.nextbillion.io/snapToRoads/json?key={your_api_key}
```

## GET Request

Users can build a basic GET request using the 2 required parameters, `key` and `path`, to obtain accurate road-snap data. They can further customize the request by including other optional parameters as listed in the table below.

It is recommended to use the GET method when the number of coordinate points in the `path` parameter is less than 100.

### Request Parameters

| Name               | Required | Format and Usage                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`              | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY`                                                                                        | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `path`             | Yes      | Type: `string`<br>Format: `latitude_1,longitude_1\|latitude_2,longitude_2\|...`<br>Example: `path=41.38602272,2.17621539\|41.38312885,2.17207083`                           | Pipe-separated list of coordinate points along a path which would be snapped to a road.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `timestamps`       | No       | Type: `string`<br>Format: `timestamps_1\|timestamps_2\|...`<br>Example: `timestamps=1656570000\|1656570015`                                                                 | Pipe-separated UNIX epoch timestamp in seconds for each location. If used, the number of timestamps must be equal to the number of coordinate points in the `path` parameter. The `timestamps` must increase monotonically starting from the first timestamp. This means that each subsequent timestamp should either be more than or equal to the preceding one.                                                                                                                                                                                          |
| `radiuses`         | No       | Type: `string`<br>Format: `radius_1\|radius_2\|...`<br>Example: `radiuses=14\|16\|14`                                                                                       | Pipe separated radiuses, in meters (m), up to which a coordinate point can be snapped. Please note, if no valid road is available within the specified radius, the API would snap the points to nearest, most viable road. When using this parameter, it is recommended to specify as many radius values as the number of points in the `path` parameter. If the same number of `radiuses` are not provided, the API will use the default radius value of 25 meters for all locations.                                                                     |
| `approaches`       | No       | Type: `string`<br>Default: `unrestricted`<br>Allowed values: `unrestricted`, `curb`<br>Format: `approaches_1;approaches_2;...`<br>Example: `approaches=unrestricted;;curb;` | A semicolon-separated list indicating the side of the road from which to approach the locations on the snapped route. When set to `unrestricted` a route can arrive at the snapped location from either side of the road and when set to `curb` the route will arrive at the snapped location on the driving side of the region. Please note the number of values provided must be equal to the number of coordinate points provided in the `path` parameter. However, you can skip a coordinate and show its position in the list with the `;` separator. |
| `avoid`            | No       | Type: `string`<br>Default: `ferry`<br>Allowed values: `toll`, `ferry`, `highway`, `none`<br>Format: `value_1\|value_2\|...`<br>Example: `avoid=highway\|toll`               | Setting this will ensure the route avoids ferries, tolls, highways or nothing. Multiple values should be separated by a pipe (`\|`). If `none` is provided along with other values, an error is returned as a valid route is not feasible. Please note that when this parameter is not provided in the input, ferries are set to be avoided by default. When this parameter is provided, only the mentioned objects are avoided.                                                                                                                           |
| `geometry`         | No       | Type: `string`<br>Default: `polyline`<br>Allowed values: `polyline`, `polyline6`, `geojson`<br>Example: `geometry=polyline`                                                 | Sets the output format of the route geometry in the response. Only the `polyline` or `polyline6` encoded `geometry` of the snapped path is returned in the response depending on the value provided in the input. When `geojson` is selected as the input value, `polyline6` encoded geometry of the snapped path is returned in the response along with the `geojson` details of the route.                                                                                                                                                               |
| `mode`             | No       | Type: `string`<br>Default: `car`<br>Allowed values: `car`, `truck`<br>Example: `mode=car`                                                                                   | Set which driving mode the service should use to determine a route. For example, if you use `car`, the API will return a route that a car can take. Using `truck` will return a route a truck can use, taking into account appropriate truck routing restrictions. **Note:** Only the `car` profile is enabled by default. Customized profiles (including `truck`) might not be available for all regions. Please contact your account manager, sales representative or reach out at support@nextbillion.ai in case you need additional profiles.          |
| `tolerate_outlier` | No       | Type: `boolean`<br>Default: `false`                                                                                                                                         | Enable it to ignore locations outside the service boundary. When `true`, the service would ignore `path` coordinates points falling outside the accessible area, which otherwise would cause an error when this parameter is `false` (default value).                                                                                                                                                                                                                                                                                                      |
| `option`           | No       | Type: `string`<br>Allowed values: `flexible`<br>Example: `option=flexible`                                                                                                  | Include this parameter in the request to return segment-wise speed information of the route returned in the response. Please note that returning speed information is a function of `road_info` parameter, which is effective only when `option=flexible`. However, the resultant route might not contain all the locations provided in `path` input.                                                                                                                                                                                                      |
| `road_info`        | No       | Type: `string`<br>Allowed values: `max_speed`, `way_id`<br>Example: `road_info=max_speed`                                                                                   | Use this parameter to receive additional details about the segments forming the snapped route. Please note that `road_info` is effective only when `option=flexible`. Following values are allowed for this parameter: <br> _ `max_speed`: Returns the segment-wise maximum speed information, if available, for each road segment present in the route. <br> _ `way_id`: Returns the OpenStreetMap way ID of each road segment present in the route.                                                                                                      |
| `detail`           | No       | Type: `boolean`<br>Default: `false`                                                                                                                                         | Set this parameter to `true` to get information about the types of road used in the snapped route and the distance covered on each of them. Please note that this parameter is effective only when `option=flexible`. The default value for this parameter is `false`. This feature is available only in select geographical regions. Please get in touch with support@nextbillion.ai to enquire/enable other areas.                                                                                                                                       |

### POST Request

Snap To Road API supports HTTPS POST method as well. The parameters and their properties for the POST method are the same as listed in the [Request Parameters](#request-parameters) section. The `key` is passed as a query parameter whereas other parameters need to be part of the Request Body. An example of a POST request is added in the [Sample Queries](#sample-queries) section below.

Please note that the maximum number of `path` coordinate points allowed in a POST request is 200.

### Response Schema

| Field                                | Type             | Description                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                             | string           | A string indicating the state of the response. On normal responses, the value will be `Ok`. Indicative HTTP error codes are returned for different errors. See the [API Errors Codes](#api-error-codes) section below for more information.                                                                      |
| `msg`                                | string           | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                                                            |
| `snappedPoints`                      | array of objects | An array of objects. Each object provides the details of a `path` coordinate point snapped to the nearest road.                                                                                                                                                                                                  |
| `snappedPoints[].location`           | object           | The latitude and longitude coordinates of the snapped point.                                                                                                                                                                                                                                                     |
| `snappedPoints[].location.latitude`  | number           | Latitude of the snapped point.                                                                                                                                                                                                                                                                                   |
| `snappedPoints[].location.longitude` | number           | Longitude of the snapped point.                                                                                                                                                                                                                                                                                  |
| `snappedPoints[].originalIndex`      | integer          | The index of the input `path` coordinate point to which this snapped point corresponds to.                                                                                                                                                                                                                       |
| `snappedPoints[].distance`           | number           | The distance of the snapped point from the original input coordinate in meters.                                                                                                                                                                                                                                  |
| `snappedPoints[].name`               | string           | The name of the street or road that the input coordinate snapped to.                                                                                                                                                                                                                                             |
| `snappedPoints[].bearing`            | number           | The bearing, calculated as the angle from true north in clockwise direction, of the route leading to the next snapped point from the current `snapped_point`, in radians. In case of the last `snapped_point` of the route, the bearing indicates the direction of the route to the previous `snapped_location`. |
| `distance`                           | integer          | The total distance of the snapped path in meters.                                                                                                                                                                                                                                                                |
| `geometry`                           | array of strings | An array of strings containing the encoded geometries of snapped paths in `polyline` or `polyline6` format.                                                                                                                                                                                                      |
| `geojson`                            | object           | A GeoJSON object with details of the snapped path. This object is returned when the `geometry` field is set to `geojson` in the input request, otherwise it is not present in the response. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946).            |
| `geojson.type`                       | string           | Type of the GeoJSON object.                                                                                                                                                                                                                                                                                      |
| `geojson.geometry`                   | object           | An object with details of the geoJSON geometry of the snapped path.                                                                                                                                                                                                                                              |
| `geojson.geometry.type`              | string           | Type of the geoJSON geometry.                                                                                                                                                                                                                                                                                    |
| `geojson.geometry.coordinates`       | array of numbers | An array of coordinates in the `[longitude, latitude]` format, representing the snapped path geometry.                                                                                                                                                                                                           |
| `geojson.properties`                 | string           | Properties associated with the geoJSON shape of the snapped path.                                                                                                                                                                                                                                                |
| `road_info`                          | object           | An object containing the maximum speed information for each road segment present in the route.                                                                                                                                                                                                                   |
| `road_info.max_speed`                | array of objects | An array of objects containing maximum speed, in kilometers per hour, for each segment of the route. Each object represents one road segment.                                                                                                                                                                    |
| `road_info.max_speed[].offset`       | integer          | `offset` is the index value of the vertex of route geometry, which is the starting point of the segment.                                                                                                                                                                                                         |
| `road_info.max_speed[].length`       | integer          | `length` refers to a sequence of 'n' consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route where the maximum speed is the same and is indicated in `value`.                                                                                               |
| `road_info.max_speed[].value`        | number           | `value` denotes the maximum speed of this segment, in kilometers per hour. A value of `-1` indicates that the speed is unlimited for this road segment. A value of `0` indicates that there is no information about the maximum speed for this road segment.                                                     |
| `road_info.way_id`                   | array of objects | An array of objects containing way IDs for each segment of the route. Each object represents one road segment.                                                                                                                                                                                                   |
| `road_info.way_id[].offset`          | string           | `offset` is the index value of the vertex of route geometry, which is the starting point of the given segment.                                                                                                                                                                                                   |
| `road_info.way_id[].length`          | string           | `length` refers to a sequence of 'n' consecutive vertices in the route geometry starting from the `offset`. It's generally 1 as each segment has a unique ID `way_id`, indicated by `value` below.                                                                                                               |
| `road_info.way_id[].value`           | string           | `value` denotes the `way_id` of the segment indicated by `offset` and `length` values above.                                                                                                                                                                                                                     |
| `detail`                             | object           | An object containing the break-up of snapped path by types of road used. The attribute is present in the response only when `detail=true` is configured in the input.                                                                                                                                            |
| `detail.distance`                    | object           | An object containing the break-up of road types used in the route, by distance.                                                                                                                                                                                                                                  |
| `detail.distance.total`              | integer          | The total distance, in meters, calculated as the sum of distances covered outside the snapped path and inside (or on) the snapped path.                                                                                                                                                                          |
| `detail.distance.off_road`           | integer          | The total distance, in meters, covered outside any road-segments on the snapped path.                                                                                                                                                                                                                            |
| `detail.distance.private_road`       | integer          | The total distance, in meters, covered using privately owned road-segments on the snapped path.                                                                                                                                                                                                                  |
| `detail.distance.public_road`        | integer          | The total distance, in meters, covered using public road-segments on the snapped path.                                                                                                                                                                                                                           |

## Sample Queries

### GET Request Example 1

Let's create a simple snapToRoad request with:

- 4 `path` coordinate points that need to be snapped to the nearest road
- `radiuses` values configured for each of the `path` coordinate points
- `timestamps` added for each of the `path` coordinate points

#### Request

```bash
curl --location 'https://api.nextbillion.io/snapToRoads/json?key=<your_api_key>&path=34.02632257,-118.31353281|34.05029825,-118.29896811|34.04873267,-118.24571761|34.02951637,-118.23833125&radiuses=20|25|15|30&timestamps=1681834632|1681835232|1681835832|1681836632'
```

#### Response

```json
{
  "status": "Ok",
  "snappedPoints": [
    {
      "location": {
        "latitude": 34.026471,
        "longitude": -118.313533
      },
      "originalIndex": 0,
      "distance": 16.0,
      "name": "W 31st St",
      "bearing": 89.0
    },
    {
      "location": {
        "latitude": 34.050298,
        "longitude": -118.298938
      },
      "originalIndex": 1,
      "distance": 2.0,
      "name": "S Mariposa Ave",
      "bearing": 0.0
    },
    {
      "location": {
        "latitude": 34.048518,
        "longitude": -118.245483
      },
      "originalIndex": 2,
      "distance": 32.0,
      "name": "",
      "bearing": 231.0
    },
    {
      "location": {
        "latitude": 34.030078,
        "longitude": -118.238943
      },
      "originalIndex": 3,
      "distance": 84.0,
      "name": "S Alameda St",
      "bearing": 182.0
    }
  ],
  "distance": 12870,
  "geometry": [
    "mxtnEpbcqU?mH?yN?wBoA@oA?U?q@@wB@iD@kD@uD@gC@Y?W?m@?W?Q@M?k@?a@?o@?kA@G?W?cA?Q?i@AM?kB@sC?S?O?A?M?I?KGA?CAE?Y?O?m@?SA_@?Co@GwAGeBKkCCa@E{AAaB?{BA}A?WAi@AK@c@?k@@o@F{ABOD]Bg@FmAFcAB_@Bs@@a@?q@?eA?gA?m@?UEE[EIA]?O@W?a@?O@YJE@e@AY?W@_@?U@g@?]?yA@g@?S?I?UA[@C?a@@K?K@G@K@SDMB]H_AVIBQDQDMBc@Fa@Bc@Bm@?}@AQ?K@a@?o@Cc@CIAMCKAOCSEa@KGCSGq@Qc@KGAIAMCKAA?EAI?M?WA[Ao@?M?a@AS?O?k@?}@?]?sA?W?SAKAOCEAGAu@WMEWIMCEAK?GAC?u@@C?mAA{D@?qEsD@eA?qB?cE?cA?S?aA??_A?g@?S?YA{@?aB?e@?gA?uA?g@?uAAeA?e@?aBAuA?g@?sA?mA?YAg@?i@?U@q@?_@?G?E?K@S@I@KBKBKFe@BKHe@Da@Dg@@O?I?I@U?Q?GAS?A?SAoB?K?k@?yA?mB?O@I?[?[?kA?_B?S?Q?K?w@?g@?_BAi@?wA?gA?i@?e@?S?aABm@Bq@@SF_BBq@HwBFeBDs@B}@Be@D[BWD]BG@IBKBGBG@GFMJYFKVo@La@L[HWJYFOHUHUVs@Z_ARk@HSTo@Pi@Z_ARk@Ng@^gA\\cAPg@HUFS`@mAL]Rk@FSL]\\cATq@Pe@Pm@HWFOHUNa@Tq@L_@DIJ]Vs@L[\\_AJYPg@DOL_@Vw@Ti@FOFQn@mBHSHWFQL_@BKHQVw@FORk@H]L]LYLWDKJSNc@Xy@L_@V}@Ne@DMRe@UOi@_@e@WYSKGgAq@s@g@IEi@]KGq@]sA{@YU[[SWWc@CCe@y@[e@KOOSWg@Wi@a@{@Wk@Uc@O[OWa@{@IMg@_AKQIOGKKOWc@g@}@Q[Wg@U]IM}@{AKOKQOUOY]g@QWOQ[e@OSSYU]OUGIOQSYUYIIAAGGOQEECAAAGCc@_@]a@w@m@][WS]]SYGMCICOAI?G?E@I@EDKDKBEFEHGHEJC\\KPINMFEFKJOHOd@u@Zk@jAmBrC_FLUHQrAmCFODGHS`@q@Va@r@oAZi@\\o@NWVc@~@}A`AgBT[HOp@gAd@{@`@s@Xg@f@}@JSd@y@R]Zi@h@aAJOHKx@eAZ_@Z_@NOT[_@m@g@aAMQAACEEGYWIKSSaA}@EGA?YWWj@O\\Ub@XHDDTPFHJPHDTJv@_BRRHJXVDFBD@@LPf@`A^l@FIFKFKBGDGJWJSz@yBFMXo@JUJ[Ni@Ha@l@eCJg@Vw@Xk@~@kB|AqC|A{C`BwCb@}@P_@DMFOj@}CD_@F[@O@Oj@Br@@pGNz@B^?zELbBFt@Bz@@t@@X@n@@d@@|DJ`ABZ@t@@d@@n@Bd@@v@BV@@?p@Bh@Bv@@f@@^@V@zABrAB~@B`@@pDP`ABhCFhCF"
  ]
}
```

Here is a visual representation of the above response

![Snap To Roads API example](https://static.nextbillion.io/docs-next/docs/navigation/api/snap-to-road-example-1.webp)

### GET Request Example 2

Let's take a step further and expand the request from Example 1 to add:

- `geometry`=`geojson` to get the geoJSON details of the snapped path
- get a snapped route that a `truck` can take

#### Request

```bash
curl --location 'https://api.nextbillion.io/snapToRoads/json?key=<your_api_key>&path=34.02632257,-118.31353281|34.05029825,-118.29896811|34.04873267,-118.24571761|34.02951637,-118.23833125&radiuses=20|25|15|30&timestamps=1681834632|1681835232|1681835832|1681836632&mode=truck&geometry=geojson'
```

#### Response

```json
{
  "status": "Ok",
  "snappedPoints": [
    {
      "location": {
        "latitude": 34.026471,
        "longitude": -118.313533
      },
      "originalIndex": 0,
      "distance": 16.0,
      "name": "W 31st St",
      "bearing": 89.0
    },
    {
      "location": {
        "latitude": 34.050298,
        "longitude": -118.298938
      },
      "originalIndex": 1,
      "distance": 2.0,
      "name": "S Mariposa Ave",
      "bearing": 0.0
    },
    {
      "location": {
        "latitude": 34.048518,
        "longitude": -118.245483
      },
      "originalIndex": 2,
      "distance": 32.0,
      "name": "",
      "bearing": 231.0
    },
    {
      "location": {
        "latitude": 34.030078,
        "longitude": -118.238943
      },
      "originalIndex": 3,
      "distance": 84.0,
      "name": "S Alameda St",
      "bearing": 182.0
    }
  ],
  "distance": 12870,
  "geometry": [
    "mxtnEpbcqU?mH?yN?wBoA@oA?U?q@@wB@iD@kD@uD@gC@Y?W?m@?W?Q@M?k@?a@?o@?kA@G?W?cA?Q?i@AM?kB@sC?S?O?A?M?I?KGA?CAE?Y?O?m@?SA_@?Co@GwAGeBKkCCa@E{AAaB?{BA}A?WAi@AK@c@?k@@o@F{ABOD]Bg@FmAFcAB_@Bs@@a@?q@?eA?gA?m@?UEE[EIA]?O@W?a@?O@YJE@e@AY?W@_@?U@g@?]?yA@g@?S?I?UA[@C?a@@K?K@G@K@SDMB]H_AVIBQDQDMBc@Fa@Bc@Bm@?}@AQ?K@a@?o@Cc@CIAMCKAOCSEa@KGCSGq@Qc@KGAIAMCKAA?EAI?M?WA[Ao@?M?a@AS?O?k@?}@?]?sA?W?SAKAOCEAGAu@WMEWIMCEAK?GAC?u@@C?mAA{D@?qEsD@eA?qB?cE?cA?S?aA??_A?g@?S?YA{@?aB?e@?gA?uA?g@?uAAeA?e@?aBAuA?g@?sA?mA?YAg@?i@?U@q@?_@?G?E?K@S@I@KBKBKFe@BKHe@Da@Dg@@O?I?I@U?Q?GAS?A?SAoB?K?k@?yA?mB?O@I?[?[?kA?_B?S?Q?K?w@?g@?_BAi@?wA?gA?i@?e@?S?aABm@Bq@@SF_BBq@HwBFeBDs@B}@Be@D[BWD]BG@IBKBGBG@GFMJYFKVo@La@L[HWJYFOHUHUVs@Z_ARk@HSTo@Pi@Z_ARk@Ng@^gA\\cAPg@HUFS`@mAL]Rk@FSL]\\cATq@Pe@Pm@HWFOHUNa@Tq@L_@DIJ]Vs@L[\\_AJYPg@DOL_@Vw@Ti@FOFQn@mBHSHWFQL_@BKHQVw@FORk@H]L]LYLWDKJSNc@Xy@L_@V}@Ne@DMRe@UOi@_@e@WYSKGgAq@s@g@IEi@]KGq@]sA{@YU[[SWWc@CCe@y@[e@KOOSWg@Wi@a@{@Wk@Uc@O[OWa@{@IMg@_AKQIOGKKOWc@g@}@Q[Wg@U]IM}@{AKOKQOUOY]g@QWOQ[e@OSSYU]OUGIOQSYUYIIAAGGOQEECAAAGCc@_@]a@w@m@][WS]]SYGMCICOAI?G?E@I@EDKDKBEFEHGHEJC\\KPINMFEFKJOHOd@u@Zk@jAmBrC_FLUHQrAmCFODGHS`@q@Va@r@oAZi@\\o@NWVc@~@}A`AgBT[HOp@gAd@{@`@s@Xg@f@}@JSd@y@R]Zi@h@aAJOHKx@eAZ_@Z_@NOT[_@m@g@aAMQAACEEGYWIKSSaA}@EGA?YWWj@O\\Ub@XHDDTPFHJPHDTJv@_BRRHJXVDFBD@@LPf@`A^l@FIFKFKBGDGJWJSz@yBFMXo@JUJ[Ni@Ha@l@eCJg@Vw@Xk@~@kB|AqC|A{C`BwCb@}@P_@DMFOj@}CD_@F[@O@Oj@Br@@pGNz@B^?zELbBFt@Bz@@t@@X@n@@d@@|DJ`ABZ@t@@d@@n@Bd@@v@BV@@?p@Bh@Bv@@f@@^@V@zABrAB~@B`@@pDP`ABhCFhCF"
  ]
}
```

Below is a visual representation of the above response. Notice the slight differences in the route that is appropriate for a `truck` instead of a `car` from Example 1.

![Snap To Roads API example 2](https://static.nextbillion.io/docs-next/docs/navigation/api/snap-to-road-example-2.webp)

### POST Request Example

Now, let's see how the POST request for the same scenario from Example 2 above looks like

```bash
curl --location --request POST 'https://api.nextbillion.io/snapToRoads/json?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "path":"34.02632257,-118.31353281|33.99120320,-118.29522906|34.00024016,-118.26026685|33.99205579,-118.20885182",
    "radiuses":"20|25|15|30",
    "timestamps":"1681834632|1681835232|1681835832|1681836632",
    "mode":"truck",
    "geometry":"geojson"
}'
```

## API Query Limits

- The maximum number of coordinate points that can be added to the `path` parameter in a GET request is 100 and in a POST request is 200.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests. Note: We can increase the quota if needed, on request. Contact support@nextbillion.ai for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                                    |
| 400           | Input validation failed.                                         | There is a missing or invalid parameter or a parameter with an invalid value type is added to the request.                                                                              |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                                      |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                              |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used                                                                                                                                     |
| 413           | Request entity too large                                         | This error is caused when the length of input request URI or the request body is too large. Please modify the request. Reach out to support@nextbillion.ai if the issue still persists. |
| 422           | Could not process the request.                                   | The points could not be snapped successfully for the given combination of location coordinates or the parameters.                                                                       |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                                                  |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                              |
