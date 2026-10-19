## SnapToRoadsService

### Methods

| Method         |                                                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getSnapToRoads | getSnapToRoads(opt: [SnapToRoadsRequest](#interface-snaptoroadsrequest))<br> <br>Parameters<br> <br>1. opt: [SnapToRoadsRequest](#interface-snaptoroadsrequest)<br> <br>Return Value: Promise |

## Interface SnapToRoadsRequest

### Properties

| Name                     |                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| approaches Optional      | Type: Array<[ApproachType](#constants-approachtype)\><br> <br>A semicolon-separated list indicating the side of the road from which to approach waypoints in a requested route. If provided, the number of approaches must be one more than the number of waypoints.                             |
| avoid Optional           | Type: [AvoidType](#constants-avoidtype)<br> <br>Setting this will ensure the route avoids ferry, tolls or highways.                                                                                                                                                                              |
| geometry Optional        | Type: [GeometryType](#constants-geometrytype)<br> <br>Sets the output format of the route geometry in the response.If `geojson` is selected, the response will include geometry in polyline6 format and will also include a geojson object that defines the route polyline. Default: `polyline6` |
| interpolate Optional     | Type: boolean<br> <br>Enable to interpolate the path. Default: `false` Note: might return more points                                                                                                                                                                                            |
| mode Optional            | Type: string<br> <br>A parameter which which sets the transportation mode for the route. PS: Only the 4w/car profile is enabled by default. The other customised routing profiles are only supported in premium plan.                                                                            |
| path                     | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Pipe separated list of points along a path on which a snap to road will be done. The default maximum limit is 200                                                                                             |
| radiuses Optional        | Type: Array<number><br> <br>Pipe separated Radiuses of each location for performing snap to road. Unit: meters                                                                                                                                                                                   |
| timestamps Optional      | Type: Array<number><br> <br>Pipe separated unix timestamps for each location. Unit: seconds                                                                                                                                                                                                      |
| tolerateOutlier Optional | Type: boolean<br> <br>enable to ignore location not found in service boundary. <br>Note: enable this to ignore outliers, otherwise an error will be thrown. <br>Default: `false`                                                                                                                 |

## Interface SnapToRoadsResult

## Interface SnapToRoadsResponsePoint

### Properties

| Name          |                                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| bearing       | Type: number<br> <br>Bearing angle of the snapped point.                     |
| distance      | Type: number<br> <br>Distance of the snapped point from the original.        |
| location      | Type: { latitude: number,longitude: number }<br> <br>Latitude and longitude. |
| name          | Type: string<br> <br>Name of the street the coordinate snapped to.           |
| originalIndex | Type: number<br> <br>Index of original input array.                          |

## Constants ApproachType

| Constants    |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| CURB         | route will arrive at the waypoint on the driving_side of the region |
| UNRESTRICTED | route can arrive at the waypoint from either side of the road       |

## Constants AvoidType

| Constants |                         |
| --------- | ----------------------- |
| FERRY     | Avoid ferry in route.   |
| HIGHWAY   | Avoid highway in route. |
| TOLL      | Avoid toll in route.    |

## Constants TravelMode

The transportation mode for the route.

| Constants |                           |
| --------- | ------------------------- |
| AUTO      | default mode, same as car |
| CAR       | car mode                  |
| TRUCK     | truck mode                |

## Constants GeometryType

Output format of the route geometry.

| Constants  |                            |
| ---------- | -------------------------- |
| GEOJSON    | Geojson format geometry.   |
| POLYLINE   | Polyline format geometry.  |
| POLYLINE_6 | Polyline6 format geometry. |
