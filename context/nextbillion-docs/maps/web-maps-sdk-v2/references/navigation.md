## NavigationService

A service for calculating navigation between locations.  
Can be accessed by `nextbillion.maps.NavigationService` if you load SDK by CDN url.

### Methods

| Method |                                                                                                                                                                                                                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| route  | route(opt: [NavigationRequest](#interface-navigationrequest))<br> <br>Parameters<br> <br>1. opt: [NavigationRequest](#interface-navigationrequest) A navigation query to be sent to the NavigationSerivce<br> <br>Return Value: Promise<null\|[NavigationResult](#interface-navigationresult)\><br> <br>Request navigation between an origin and a destination. |

## Interface NavigationRequest

A navigation query to be sent to the NavigationSerivce

### Properties

| Name                   |                                                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| altCount Optional      | Type: number<br> <br>Sets the number of alternative routes to return. Default: `3` .                                                                                                                                                                                   |
| alternatives Optional  | Type: boolean<br> <br>If enabled, the API will return alternative routes. <br> <br>You can set the number of routes in the `altCount` property. Note: `altcount` will default to `3` if this is enabled.                                                               |
| apiKey Optional        | Type: string<br> <br>api key for the request                                                                                                                                                                                                                           |
| approaches Optional    | Type: Array<[ApproachType](#constants-approachtype)\><br> <br>A list indicating the side of the road from which to approach waypoints in a requested route. If provided, the number of approaches must be one more than the number of waypoints.                       |
| avoid Optional         | Type: Array<[AvoidType](#constants-avoidtype)\><br> <br>Setting this will ensure the route avoids ferry, tolls or highways.                                                                                                                                            |
| bearings Optional      | Type: Array<[NavigationBearingInfo](#interface-navigationbearinginfo)\><br> <br>Limits the search to segments with given bearing in degrees towards true north in clockwise direction. <br> <br>Note: Number of bearings should be equal to the number of coordinates. |
| departureTime Optional | Type: number<br> <br>This parameter sets the departure time in Unix epoch time seconds format. Unit: seconds. PS: This parameter is only supported in premium plan.                                                                                                    |
| destination Optional   | Type: [LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)<br> <br>Destination is the ending coordinates of your route. Ensure that destination is a valid land location. <br> <br>\[This parameter is mandatory IF geometry parameter is not given\]          |
| geometry Optional      | Type: string<br> <br>If this parameter is provided, the only other parameters which will be considered in the request are `geometry_type` , `lang` and `key` . The rest of the parameters will be ignored.                                                             |
| geometryType Optional  | Type: [GeometryType](#constants-geometrytype)<br> <br>Sets the output format of the route geometry in the response. Default: `polyline6` .                                                                                                                             |
| lang Optional          | Type: string<br> <br>language of the text instruction                                                                                                                                                                                                                  |
| mode Optional          | Type: [TravelMode](#constants-travelmode) \| string<br> <br>A parameter which which sets the transportation mode for the route. PS: Only the 4w/car profile is enabled by default. The other customised routing profiles are only supported in premium plan.           |
| origin Optional        | Type: [LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)<br> <br>Origin is the starting point of your route. Ensure that origin is a valid land location. <br> <br>\[This parameter is mandatory IF geometry parameter is not given\]                        |
| overview Optional      | Type: [OverviewType](#constants-overviewtype)<br> <br>Output verbosity of overview (whole trip) geometry. Default: `full` .                                                                                                                                            |
| session Optional       | Type: string<br> <br>Unique session ID. If set, the response will reuse cached trip characteristics. PS: This parameter is only supported in premium plan.                                                                                                             |
| waypoints Optional     | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Waypoints are coordinates along the route between Origin and Destination. This is a pipe separated list of coordinate pairs. <br> <br>Default maximum limit is 200                  |

## Interface NavigationResult

The navigation response retrieved from the navigation server.

### Properties

| Name                  |                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| country_code Optional | Type: string                                                                                                                                                                               |
| error_msg Optional    | Type: string<br> <br>error message if status is not 200.                                                                                                                                   |
| routes Optional       | Type: Array<[NavigationResponseRoute](#interface-navigationresponseroute)\><br> <br>routes calculated.                                                                                     |
| status                | Type: NBRequestStatus \| string<br> <br>A string indicating the state of the response. This is a separate code than the HTTP status code. On normal valid responses, the value will be Ok. |

## Interface NavigationResponseRoute

### Properties

| Name                     |                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| distance                 | Type: number<br> <br>route driving distance. <br> <br>Unit: `meters`                                                                                |
| distance_full Optional   | Type: number                                                                                                                                        |
| duration                 | Type: number<br> <br>route driving duration. <br> <br>Unit: `seconds`                                                                               |
| end_location Optional    | Type: { latitude: number,longitude: number }<br> <br>end location of route                                                                          |
| geojson Optional         | Type: { coordinates: Array<Array<number>> }                                                                                                         |
| geometry Optional        | Type: string<br> <br>encoded geometry value for step in `polyline` or `polyline6` .                                                                 |
| legs                     | Type: Array<[NavigationResponseLeg](#interface-navigationresponseleg)\><br> <br>legs of route. <br> <br>Note: `waypoints` split `route` into `legs` |
| special_objects Optional | Type: any<br> <br>special geospatial objects crossed along the trip.                                                                                |
| start_location Optional  | Type: { latitude: number,longitude: number }<br> <br>start location of route                                                                        |

## Interface NavigationResponseLeg

### Properties

| Name                    |                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------- |
| distance                | Type: { value: number }<br> <br>leg driving distance. <br> <br>Unit: `meters`   |
| duration                | Type: { value: number }<br> <br>leg driving duration. <br> <br>Unit: `seconds`  |
| end_location Optional   | Type: { latitude: number,longitude: number }                                    |
| start_location Optional | Type: { latitude: number,longitude: number }                                    |
| steps                   | Type: Array<[NavigationResponseLegStep](#interface-navigationresponselegstep)\> |

## Interface NavigationResponseLegStep

### Properties

| Name                   |                                                                                |
| ---------------------- | ------------------------------------------------------------------------------ |
| distance               | Type: { value: number }<br> <br>leg driving distance. <br> <br>Unit: `meters`  |
| duration               | Type: { value: number }<br> <br>leg driving duration. <br> <br>Unit: `seconds` |
| end_location           | Type: { latitude: number,longitude: number }                                   |
| geojson Optional       | Type: { coordinates: Array<Array<number>> }                                    |
| geometry Optional      | Type: string                                                                   |
| intersections Optional | Type: Array<StepIntersections>                                                 |
| maneuver Optional      | Type: StepManeuver                                                             |
| name Optional          | Type: string                                                                   |
| reference Optional     | Type: string                                                                   |
| start_location         | Type: { latitude: number,longitude: number }                                   |

## Interface NavigationBearingInfo

### Properties

| Name   |              |
| ------ | ------------ |
| degree | Type: number |
| range  | Type: number |

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

## Constants OverviewType

| Constants  |                                         |
| ---------- | --------------------------------------- |
| FALSE      | Not include overview in result          |
| FULL       | Include full info in oveview            |
| SIMPLIFIED | Only inlude simplified info in overview |
