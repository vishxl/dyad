## DirectionsService

A service for calculating directions between locations.  
Can be accessed by `nextbillion.maps.DirectionsService` if you load SDK by CDN url.

### Methods

| Method |                                                                                                                                                                                                                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| route  | route(opt: [DirectionsRequest](#interface-directionsrequest))<br> <br>Parameters<br> <br>1. opt: [DirectionsRequest](#interface-directionsrequest) A directions query to be sent to the DirectionsSerivce<br> <br>Return Value: Promise<null\|[DirectionsResult](#interface-directionsresult)\><br> <br>Request directions between an origin and a destination. |

## Interface DirectionsRequest

A directions query to be sent to the DirectionsSerivce

### Properties

| Name                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| altCount Optional      | Type: number<br> <br>Sets the number of alternative routes to return. Default: 3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| alternatives Optional  | Type: boolean<br> <br>If enabled, the API will return alternative routes. You can set the number of routes in the altcount property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| apiKey Optional        | Type: string<br> <br>api key for the request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| approaches Optional    | Type: Array<[ApproachType](#constants-approachtype)\><br> <br>A list indicating the side of the road from which to approach waypoints in a requested route. If provided, the number of approaches must be one more than the number of waypoints.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| avoid Optional         | Type: Array<[AvoidType](#constants-avoidtype)\><br> <br>Setting this will ensure the route avoids ferry, tolls or highways.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| crossBorder Optional   | Type: boolean<br> <br>Specify if crossing an international border is expected. When set to false, the API will place a penalty for crossing an international border through a checkpoint. Consequently, alternative routes will be preferred if they are feasible for the given set of `destination` or `waypoints` . A higher penalty is placed on a route crossing international border without a checkpoint, hence such routes will be preferred the least. <br> <br>When set to true, there will be no penalty for crossing an international border. <br> <br>This feature is available in North America and Singapore region only. Please get in touch with [support@nextbillion.ai](mailto:support@nextbillion.ai) to enquire/enable other areas. |
| departureTime Optional | Type: number<br> <br>This parameter sets the departure time in Unix epoch time seconds format. Unit: seconds. PS: This parameter is only supported in Premium plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| destination            | Type: [LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)<br> <br>The ending point of a route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| geometry Optional      | Type: [GeometryType](#constants-geometrytype)<br> <br>Sets the output format of the route geometry in the response. Default: GeometryType.POLYLINE6.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| hazmatType Optional    | Type: Array<DirectionsHazmatType><br> <br>Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. <br> <br>Allowed Values: general circumstantial explosive harmfulToWater <br> <br>Please note that this parameter is effective only when `mode=truck` .                                                                                                                                                                                                                                                                                                                                                                                                         |
| mode Optional          | Type: [TravelMode](#constants-travelmode) \| string<br> <br>A parameter which which sets the transportation mode for the route. PS: Only the 4w/car profile is enabled by default. The other customised routing profiles are only supported in Premium plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| option Optional        | Type: string<br> <br>Use this option to switch to 6w or truck specific routing. Using this option enables specific settings available only for truck based routing. Accepts `flexible` .                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| origin                 | Type: [LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)<br> <br>The starting point of a route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| overview Optional      | Type: [OverviewType](#constants-overviewtype)<br> <br>Output verbosity of overview (whole trip) geometry. Default: full.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| roadInfo Optional      | Type: Array<DirectionsRoadInfo><br> <br>Use this parameter to receive segment-wise maximum speed information of the route in the response. `max_speed is` the only allowed value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| routeType Optional     | Type: DirectionsRouteType<br> <br>Set the route type that needs to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| session Optional       | Type: string<br> <br>Unique session ID. If set, the response will reuse cached trip characteristics. PS: This parameter is only supported in Premium plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| steps Optional         | Type: boolean<br> <br>The steps flag determines whether to return the individual maneuver instructions that comprise the route in the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| truckAxleLoad Optional | Type: number<br> <br>Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle. <br> <br>Please note this parameter is effective only when `mode=truck` .                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| truckSize Optional     | Type: Array<number><br> <br>This defines the dimensions of a truck in centimeters (cm). This parameter is effective only when the mode=truck. Maximum dimensions are as follows: <br>Height = 1000 cm <br>Width = 5000 cm <br>Length = 5000 cm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| truckWeight Optional   | Type: number<br> <br>This defines the weight of the truck in kilograms (kg). This parameter is effective only when the mode= `truck` . Maximum weight is 100000 kg.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| waypoints Optional     | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Coordinates along the route between the Origin and the Destination.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## Interface DirectionsResult

The directions response retrieved from the directions server.

### Properties

| Name                  |                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| country_code Optional | Type: string                                                                                                                                                                               |
| msg Optional          | Type: string<br> <br>error message if status is not 200.                                                                                                                                   |
| routes Optional       | Type: Array<[DirectionsResponseRoute](#interface-directionsresponseroute)\><br> <br>routes calculated.                                                                                     |
| status                | Type: NBRequestStatus \| string<br> <br>A string indicating the state of the response. This is a separate code than the HTTP status code. On normal valid responses, the value will be Ok. |

## Interface DirectionsResponseRoute

### Properties

| Name                        |                                                                                |
| --------------------------- | ------------------------------------------------------------------------------ |
| distance                    | Type: number                                                                   |
| distance_full Optional      | Type: number                                                                   |
| duration                    | Type: number                                                                   |
| end_location Optional       | Type: { latitude: number,longitude: number }                                   |
| geojson Optional            | Type: { coordinates: Array<Array<number>> }                                    |
| geometry Optional           | Type: string<br> <br>encoded geometry value for step in polyline or polyline6. |
| legs                        | Type: Array<[DirectionsResponseLeg](#interface-directionsresponseleg)\>        |
| predicted_duration Optional | Type: number                                                                   |
| raw_duration Optional       | Type: number                                                                   |
| special_objects Optional    | Type: any                                                                      |
| start_location Optional     | Type: { latitude: number,longitude: number }                                   |

## Interface DirectionsResponseLeg

### Properties

| Name                    |                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------- |
| distance                | Type: { value: number }                                                         |
| duration                | Type: { value: number }                                                         |
| end_location Optional   | Type: { latitude: number,longitude: number }                                    |
| raw_duration Optional   | Type: { value: number }                                                         |
| start_location Optional | Type: { latitude: number,longitude: number }                                    |
| steps                   | Type: Array<[DirectionsResponseLegStep](#interface-directionsresponselegstep)\> |

## Interface DirectionsResponseLegStep

### Properties

| Name                   |                                                                 |
| ---------------------- | --------------------------------------------------------------- |
| distance               | Type: { value: number }                                         |
| duration               | Type: { value: number }                                         |
| end_location           | Type: { latitude: number,longitude: number }                    |
| geojson Optional       | Type: { coordinates: Array<Array<number>> }                     |
| geometry Optional      | Type: string                                                    |
| intersections Optional | Type: Array<[StepIntersections](#interface-stepintersections)\> |
| maneuver Optional      | Type: [StepManeuver](#interface-stepmaneuver)                   |
| name Optional          | Type: string                                                    |
| reference Optional     | Type: string                                                    |
| start_location         | Type: { latitude: number,longitude: number }                    |

## Interface StepIntersections

### Properties

| Name             |                                                            |
| ---------------- | ---------------------------------------------------------- |
| bearings         | Type: Array<number>                                        |
| classes          | Type: Array<string>                                        |
| entry            | Type: Array<boolean>                                       |
| intersection_in  | Type: number                                               |
| intersection_out | Type: number                                               |
| lanes            | Type: Array<{ indications: Array<string>,valid: boolean }> |
| location         | Type: { latitude: number,longtiude: number,name: string }  |

## Interface StepManeuver

### Properties

| Name                 |                                                                                   |
| -------------------- | --------------------------------------------------------------------------------- |
| bearing_after        | Type: number                                                                      |
| bearing_before       | Type: number                                                                      |
| coordinate           | Type: { latitude: number,longitude: number,name: string }                         |
| instruction Optional | Type: string                                                                      |
| maneuver_type        | Type: string                                                                      |
| modifier Optional    | Type: string                                                                      |
| muted Optional       | Type: boolean                                                                     |
| voice_instruction    | Type: Array<{ distance_along_geometry: number,instruction: string,unit: string }> |

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
